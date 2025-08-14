package scout

import (
	"context"
	"os"

	l "github.com/statulo/scout/internal/logger"
)

func startScout() {
	l.InitLogger(l.GetLogFormat(conf.LogFormat), conf.ShouldDebug)
	l.Log.Infof("Scout v" + Version)
	logConfigDebug()

	defer func() {
		// TODO this should go somewhere else, initialisation shouldn't recover from panics
		if r := recover(); r != nil {
			l.Log.Errorf("Recovered in main: %v\n", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := NewAgent(conf)
	err := agent.Run(ctx)

	if err != nil {
		l.Log.Errorf("Failed to start: %v\n", err)
		os.Exit(1)
	}

	l.Log.Info("Exiting...")
	os.Exit(0)
}
