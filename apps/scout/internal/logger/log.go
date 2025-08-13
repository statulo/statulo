package logger

import (
	"os"
	"time"

	charmlog "github.com/charmbracelet/log"
)

var Log *charmlog.Logger

func InitLogger(useProd bool) {
	logger := charmlog.New(os.Stdout)
	logger.SetTimeFormat(time.TimeOnly)
	logger.SetReportCaller(true)
	logger.SetReportTimestamp(true)
	logger.SetLevel(charmlog.DebugLevel)

	if useProd {
		logger.SetFormatter(charmlog.JSONFormatter)
		logger.SetTimeFormat(time.RFC3339)
		logger.SetLevel(charmlog.InfoLevel)
	}

	Log = logger
}
