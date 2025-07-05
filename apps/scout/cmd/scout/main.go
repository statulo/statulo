package main

import (
	"context"
	"fmt"
	"os"
)

func main() {
	fmt.Println("Setting up agent")

	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered in main: %v\n", r)
		}
	}()

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	listenSignals(cancel)

	agent := Agent{}
	err := agent.Run(ctx)

	if err != nil {
		fmt.Printf("Agent failed to run: %v\n", err)
		os.Exit(1)
	}

	fmt.Println("Exiting")
	os.Exit(0)
}
