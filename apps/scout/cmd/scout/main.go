package main

import (
	"context"
	"os"
)

func main() {
	// TODO load config from environment and .env, load into struct:
	// - log level (default to INFO)
	// - log format (default to JSON)
	// - orchestrator URL (required)
	// - enable metrics? (default to false)
	// - web server port (maybe disable by default for security?)
	conf := Config{
		LogInJson:       false,
		OrchestratorUrl: "http://localhost:8080",
		Metrics:         false,
		HttpPort:        1234,
	}

	initLogger(conf.LogInJson)
	defer log.Sync()

	log.Info("Setting up agent")

	defer func() {
		// TODO this should go somewhere else, initialisation shouldn't recover from panics
		if r := recover(); r != nil {
			log.Errorf("Recovered in main: %v\n", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := NewAgent(conf)
	err := agent.Run(ctx)

	if err != nil {
		log.Errorf("Agent failed to run: %v\n", err)
		os.Exit(1)
	}

	log.Info("Exiting")
	os.Exit(0)
}
