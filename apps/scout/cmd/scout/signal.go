package main

import (
	"context"
	"os"
	"os/signal"
)

func listenSignals(cancel context.CancelFunc) {
	notifyCtx, _ := signal.NotifyContext(context.Background(), os.Interrupt)

	go func() {
		<-notifyCtx.Done()
		log.Info("Shutdown signal received, gracefully shutting down. Send INTERRUPT again to forcibly shut down and risk missing checks")
		cancel()

		// Second interrupt causes full shut down
		secondNotifyCtx, _ := signal.NotifyContext(context.Background(), os.Interrupt)
		<-secondNotifyCtx.Done()
		log.Info("Second shutdown signal received, forcibly shutting down")
		os.Exit(1)
	}()
}
