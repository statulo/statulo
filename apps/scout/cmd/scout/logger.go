package main

import (
	"go.uber.org/zap"
)

var log *zap.SugaredLogger

func initLogger(useProd bool) error {
	var logger *zap.Logger
	var err error

	if useProd {
		logger, err = zap.NewProduction()
		if err != nil {
			return err
		}
	} else {
		logger, err = zap.NewDevelopment()
		if err != nil {
			return err
		}
	}

	log = logger.Sugar()
	return nil
}
