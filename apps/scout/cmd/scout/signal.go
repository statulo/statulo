package scout

import (
	"context"
	"os"
	"os/signal"

	l "github.com/statulo/scout/internal/logger"
)

func listenSignals(cancel context.CancelFunc) {
	notifyCtx, _ := signal.NotifyContext(context.Background(), os.Interrupt)

	go func() {
		<-notifyCtx.Done()
		l.Log.Warn("Shutdown signal received. Please wait for shutdown or risk inaccurate checking")
		l.Log.Warn("Gracefully shutting down...")
		cancel()

		// Second interrupt causes full shut down
		secondNotifyCtx, _ := signal.NotifyContext(context.Background(), os.Interrupt)
		<-secondNotifyCtx.Done()
		l.Log.Error("Second shutdown signal received; Assigned checks may have degraded availability")
		l.Log.Error("Forcibly shutting down!")
		os.Exit(1)
	}()
}
