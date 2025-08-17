package scout

import (
	"context"
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

func NewAgent(conf Config) Agent {
	return Agent{
		conf: conf,
	}
}

func (a *Agent) startMetrics(metricsSrv *metrics.MetricsServer, bindAdrr string) {
	if bindAdrr == "" {
		return
	}

	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		metricsSrv.Start(bindAdrr)
	}()
}

func (a *Agent) startHeartbeater(heartbeater *heartbeat.Heartbeater, duration time.Duration) {
	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		heartbeater.Start(duration)
	}()
}

func (a *Agent) startScheduler(scheduler *scheduler.Scheduler, initialCheckHash string, initialChecks []http.CheckResponse) {
	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		scheduler.Start(initialCheckHash, initialChecks)
	}()
}

func (a *Agent) Run(ctx context.Context) error {
	client := http.OrchestratorClient{
		UserAgentName: "Scout",
		Version:       Version,
		BaseUrl:       a.conf.OrchestratorUrl,
	}

	l.Log.Debug("Sending HELLO to API server")
	helloRes, err := client.DoHello(http.HelloRequest{
		Timeout:  30 * time.Second,
		RegToken: a.conf.Token,
	})
	if err != nil {
		return err
	}
	l.Log.Debugf("Received HELLO response - joined pool as '%s'", helloRes.AgentId)
	l.Log.Info("Connected to API server")
	client.SetToken(helloRes.Token)

	metricsSrv := metrics.CreateMetricsServer()
	checker := checker.CreateChecker(ctx, &client)
	scheduler := scheduler.CreateScheduler(ctx, &checker, &client)
	heartbeater := heartbeat.CreateHeartbeater(ctx, scheduler.GetCheckUpdateChannel(), &client)

	a.startMetrics(&metricsSrv, conf.MetricsUrl)
	a.startHeartbeater(&heartbeater, time.Duration(helloRes.Heartbeat)*time.Second)
	a.startScheduler(&scheduler, helloRes.CheckHash, helloRes.Checks)
	// TODO restart agent (not process) when token from HELLO gets invalidated
	// TODO bg: start pubsub (if sent with HELLO), pubsub can call checker

	<-ctx.Done()

	l.Log.Debugf("Sending GOODBYE to API server")
	goodbyeErr := client.DoGoodbye(http.GoodbyeRequest{
		Timeout: 30 * time.Second,
	})
	if goodbyeErr != nil {
		return goodbyeErr
	}
	l.Log.Debugf("Received GOODBYE response")
	l.Log.Info("Offboarding schedule received, waiting to finish tasks")

	// TODO run schedule until the end specified by goodbye
	metricsSrv.Stop()
	a.wg.Wait()

	return nil
}
