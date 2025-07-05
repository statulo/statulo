package main

import (
	"context"
	"os"
)

func main() {
	initLogger(false)
	defer log.Sync()

	log.Info("Setting up agent")

	defer func() {
		if r := recover(); r != nil {
			log.Errorf("Recovered in main: %v\n", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := NewAgent()
	err := agent.Run(ctx)

	if err != nil {
		log.Errorf("Agent failed to run: %v\n", err)
		os.Exit(1)
	}

	log.Info("Exiting")
	os.Exit(0)
}
