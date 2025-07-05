package main

import (
	"context"
	"sync"
	"time"
)

type Agent struct {
	wg sync.WaitGroup
}

func NewAgent() Agent {
	return Agent{}
}

func (a *Agent) startBg(ctx context.Context) {
	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		for {
			select {
			case <-ctx.Done():
				log.Info("Shutting down agent.startBg")
				return
			default:
				log.Debug("Doing things...")
				time.Sleep(2 * time.Second)
			}
		}
	}()
}

func (a *Agent) Run(ctx context.Context) error {
	log.Info("Agent is running")

	// TODO request HELLO immediately from orchestrator, exponential backoff on failure
	// TODO restart agent (not process) when token from HELLO gets invalidated
	// TODO create a checker struct
	// TODO bg: start heartbeat, heartbeat schedule defined in HELLO. If returned hash from heartbeat is different, refetch schedule
	// TODO bg: start check scheduler, check schedule defined in HELLO. Check schedule should be hot reloadable. Checker is called by check scheduler
	// TODO bg: start pubsub (if sent with HELLO), pubsub can call checker
	// TODO bg: web server for healthcheck and prometheus metrics
	a.startBg(ctx)

	<-ctx.Done()
	log.Info("Shutdown requested, waiting for tasks to quit")
	a.wg.Wait()

	// TODO graceful exit: send GOODBYE to orchestrator

	return nil
}
