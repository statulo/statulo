package scout

import (
	"context"
	"errors"
	"sync"
	"time"

	"github.com/statulo/scout/internal/checker"
	"github.com/statulo/scout/internal/heartbeat"
	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
	"github.com/statulo/scout/internal/metrics"
	"github.com/statulo/scout/internal/reporter"
	"github.com/statulo/scout/internal/scheduler"
)

type Agent struct {
	wg   sync.WaitGroup
	conf Config
}

var ErrAgentRestart = errors.New("agent restart error")

func NewAgent(conf Config) Agent {
	return Agent{
		conf: conf,
	}
}

func (a *Agent) startMetrics(ctx context.Context, metricsSrv *metrics.MetricsServer, bindAdrr string) {
	if bindAdrr == "" {
		return
	}

	RunWithRecovery("metrics", ctx, &a.wg, func() {
		metricsSrv.Start(bindAdrr)
	})
}

func (a *Agent) startHeartbeater(ctx context.Context, heartbeater *heartbeat.Heartbeater, duration time.Duration) {
	RunWithRecovery("heartbeater", ctx, &a.wg, func() {
		heartbeater.Start(ctx, duration)
	})
}

func (a *Agent) startScheduler(ctx context.Context, scheduler *scheduler.Scheduler, initialCheckHash string, initialChecks []http.CheckResponse) {
	RunWithRecovery("scheduler", ctx, &a.wg, func() {
		scheduler.Start(ctx, initialCheckHash, initialChecks)
	})
	RunWithRecovery("scheduler-update-checker", ctx, &a.wg, func() {
		scheduler.StartUpdateChecker(ctx)
	})
}

func (a *Agent) startReporter(ctx context.Context, reporter *reporter.Reporter) {
	RunWithRecovery("reporter", ctx, &a.wg, func() {
		reporter.Start(ctx)
	})
}

func (a *Agent) Run(parentCtx context.Context) error {
	ctx, cancel := context.WithCancel(parentCtx)
	client := http.CreateClient("Scout", Version, a.conf.OrchestratorUrl)

	l.Log.Debug("Sending HELLO to API server")
	helloRes, err := client.DoHello(http.HelloRequest{
		Timeout:  30 * time.Second,
		RegToken: a.conf.Token,
		Context:  ctx,
	})
	if err != nil {
		cancel()
		return err
	}
	l.Log.Debugf("Received HELLO response - joined pool as '%s'", helloRes.AgentId)
	l.Log.Info("Connected to API server")
	client.SetToken(helloRes.Token)

	metricsSrv := metrics.CreateMetricsServer()
	reporter := reporter.NewReporter(&client, 40)
	checker := checker.CreateChecker(&client, &reporter)
	scheduler := scheduler.CreateScheduler(&checker, &client)
	heartbeater := heartbeat.CreateHeartbeater(scheduler.GetCheckUpdateChannel(), &client)

	a.startMetrics(ctx, &metricsSrv, conf.MetricsUrl)
	a.startHeartbeater(ctx, &heartbeater, time.Duration(helloRes.Heartbeat)*time.Second)
	a.startScheduler(ctx, &scheduler, helloRes.CheckHash, helloRes.Checks)
	a.startReporter(ctx, &reporter)
	// TODO bg: start pubsub (if sent with HELLO), pubsub can call checker

	select {
	case <-ctx.Done():
		break
	case <-client.WaitTokenInvalidated():
		cancel()
		metricsSrv.Stop()
		checker.Wait()
		a.wg.Wait()
		return ErrAgentRestart
	}

	l.Log.Debugf("Sending GOODBYE to API server")
	goodbyeErr := client.DoGoodbye(http.GoodbyeRequest{
		Timeout: 30 * time.Second,
		Context: context.Background(),
	})
	if goodbyeErr != nil {
		cancel()
		metricsSrv.Stop()
		checker.Wait()
		a.wg.Wait()
		return goodbyeErr
	}
	l.Log.Debugf("Received GOODBYE response")
	l.Log.Info("Offboarding schedule received, waiting to finish tasks")

	// TODO run schedule until the end specified by goodbye (reporter)
	cancel()
	metricsSrv.Stop()
	checker.Wait()
	a.wg.Wait()

	return nil
}
