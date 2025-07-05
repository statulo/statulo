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

	a.startBg(ctx)

	<-ctx.Done()
	log.Info("Shutdown requested, waiting for tasks to quit")
	a.wg.Wait()
	return nil
}
