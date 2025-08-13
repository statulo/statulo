package main

import (
	"fmt"

	"github.com/caarlos0/env/v11"
	"github.com/joho/godotenv"
)

const Version string = "1.0.0"

type Config struct {
	LogInJson       bool   `env:"LOG_JSON" envDefault:"true"`
	OrchestratorUrl string `env:"ORCHESTRATOR_URL,required"`
	Token           string `env:"TOKEN,required"`
	Metrics         bool   `env:"ENABLE_METRICS" envDefault:"false"`
	HttpPort        int    `env:"HTTP_PORT" envDefault:"0"`
}

func loadConfig() (*Config, error) {
	envLoadErr := godotenv.Load()
	if envLoadErr != nil {
		fmt.Println("Error loading .env file, skipping")
	}

	var conf Config
	err := env.Parse(&conf)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return &conf, nil
}

func logConfig(conf Config) {
	log.Infof("Configuration loaded, connecting to %s", conf.OrchestratorUrl)
}
