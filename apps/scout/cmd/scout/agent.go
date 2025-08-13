package main

import (
	"context"
	"sync"
	"time"

	"github.com/statulo/scout/internal/heartbeat"
	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
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

func (a *Agent) startHeartbeater(heartbeater *heartbeat.Heartbeater, duration time.Duration) {
	l.Log.Info("Starting heartbeat")
	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		heartbeater.Start(duration)
	}()
}

func (a *Agent) Run(ctx context.Context) error {
	l.Log.Info("Agent is running")
	client := http.OrchestratorClient{
		UserAgentName: "Scout",
		Version:       Version,
		BaseUrl:       a.conf.OrchestratorUrl,
	}

	// TODO exponential backoff on failure
	helloRes, err := client.DoHello(http.HelloRequest{
		Timeout:  30 * time.Second,
		RegToken: a.conf.Token,
	})
	if err != nil {
		return err
	}
	l.Log.Info("Got HELLO from orchestrator")
	client.SetToken(helloRes.Token)

	heartbeater := heartbeat.CreateHeartbeater(ctx, &client)
	a.startHeartbeater(&heartbeater, time.Duration(helloRes.Heartbeat)*time.Second)
	// TODO restart agent (not process) when token from HELLO gets invalidated
	// TODO create a checker struct
	// TODO bg: start check scheduler, check schedule defined in HELLO. Check schedule should be hot reloadable. Checker is called by check scheduler
	// TODO bg: start pubsub (if sent with HELLO), pubsub can call checker
	// TODO bg: web server for healthcheck and prometheus metrics

	<-ctx.Done()
	l.Log.Info("Shutdown requested, sending GOODBYE to orchestrator")

	goodbyeErr := client.DoGoodbye(http.GoodbyeRequest{
		Timeout: 30 * time.Second,
	})
	if goodbyeErr != nil {
		// TODO exponential retry
		return goodbyeErr
	}
	l.Log.Info("GOODBYE acknowledged by orchestrator, gracefully offboarding tasks")
	// TODO run schedule until the end specified by goodbye
	a.wg.Wait()

	return nil
}
