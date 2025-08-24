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

	a.wg.Add(1)
	RunWithRecovery("metrics", ctx, func() {
		metricsSrv.Start(bindAdrr)
		defer a.wg.Done()
	})
}

func (a *Agent) startHeartbeater(ctx context.Context, heartbeater *heartbeat.Heartbeater, duration time.Duration) {
	a.wg.Add(1)
	RunWithRecovery("heartbeater", ctx, func() {
		defer a.wg.Done()
		heartbeater.Start(ctx, duration)
	})
}

func (a *Agent) startScheduler(ctx context.Context, scheduler *scheduler.Scheduler, initialCheckHash string, initialChecks []http.CheckResponse) {
	a.wg.Add(1)
	RunWithRecovery("scheduler", ctx, func() {
		defer a.wg.Done()
		scheduler.Start(ctx, initialCheckHash, initialChecks)
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
	checker := checker.CreateChecker(&client)
	scheduler := scheduler.CreateScheduler(&checker, &client)
	heartbeater := heartbeat.CreateHeartbeater(scheduler.GetCheckUpdateChannel(), &client)

	a.startMetrics(ctx, &metricsSrv, conf.MetricsUrl)
	a.startHeartbeater(ctx, &heartbeater, time.Duration(helloRes.Heartbeat)*time.Second)
	a.startScheduler(ctx, &scheduler, helloRes.CheckHash, helloRes.Checks)
	// TODO bg: start pubsub (if sent with HELLO), pubsub can call checker

	select {
	case <-ctx.Done():
		metricsSrv.Stop()
		break
	case <-client.WaitTokenInvalidated():
		cancel()
		metricsSrv.Stop()
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
		a.wg.Wait()
		return goodbyeErr
	}
	l.Log.Debugf("Received GOODBYE response")
	l.Log.Info("Offboarding schedule received, waiting to finish tasks")

	// TODO run schedule until the end specified by goodbye
	cancel()
	metricsSrv.Stop()
	a.wg.Wait()

	return nil
}
