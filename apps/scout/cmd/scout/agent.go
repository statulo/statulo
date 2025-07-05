package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

type Agent struct {
	wg sync.WaitGroup
}

func (a *Agent) startBg(ctx context.Context) {
	a.wg.Add(1)
	go func() {
		defer a.wg.Done()
		for {
			select {
			case <-ctx.Done():
				fmt.Println("Shutting down agent.startBg")
				return
			default:
				fmt.Println("Doing things...")
				time.Sleep(2 * time.Second)
			}
		}
	}()
}

func (a *Agent) Run(ctx context.Context) error {
	fmt.Println("Agent is running")

	a.startBg(ctx)

	<-ctx.Done()
	fmt.Println("Shutdown requested, waiting for tasks to quit")
	a.wg.Wait()
	return nil
}
