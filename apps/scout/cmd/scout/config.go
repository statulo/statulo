package main

const Version string = "1.0.0"

type Config struct {
	LogInJson       bool
	OrchestratorUrl string
	Metrics         bool
	HttpPort        int
}
