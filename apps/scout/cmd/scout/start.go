package scout

import (
	"context"
	"errors"
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
			l.Log.Errorf("Recovered in main: %v", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := NewAgent(conf)
	for {
		err := agent.Run(ctx)

		if err != nil {
			// Recoverable failure, restart
			if errors.Is(err, ErrAgentRestart) {
				l.Log.Errorf("Recoverable error caught, restarting application")
				continue
			}

			// Unrecoverable failure
			l.Log.Errorf("Scout encountered an error: %v", err)
			os.Exit(1)
		}

		break
	}

	l.Log.Info("Exiting...")
	os.Exit(0)
}
