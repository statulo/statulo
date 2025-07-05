package main

import (
	"context"
	"os/signal"
	"syscall"
)

func listenSignals(cancel context.CancelFunc) {
	notifyCtx, _ := signal.NotifyContext(context.Background(), syscall.SIGINT, syscall.SIGTERM)

	go func() {
		<-notifyCtx.Done()
		log.Info("Shutdown signal received")
		cancel()
	}()
}
