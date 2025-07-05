package main

import (
	"context"
	"fmt"
	"os/signal"
	"syscall"
)

func listenSignals(cancel context.CancelFunc) {
	notifyCtx, _ := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-notifyCtx.Done()
		fmt.Println("Shutdown signal received")
		cancel()
	}()
}
