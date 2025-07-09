package main

import (
	"context"
	"fmt"
	"os"
)

func main() {
	conf, logErr := loadConfig()
	if logErr != nil {
		fmt.Printf("Failed to load configuration, exiting: %v\n", logErr)
		os.Exit(1)
	}

	initLogger(conf.LogInJson)
	defer log.Sync()

	log.Info("Setting up agent")
	logConfig(*conf)

	defer func() {
		// TODO this should go somewhere else, initialisation shouldn't recover from panics
		if r := recover(); r != nil {
			log.Errorf("Recovered in main: %v\n", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := NewAgent(*conf)
	err := agent.Run(ctx)

	if err != nil {
		log.Errorf("Agent failed to run: %v\n", err)
		os.Exit(1)
	}

	log.Info("Exiting")
	os.Exit(0)
}
