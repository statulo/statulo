package logger

import (
	"os"
	"strings"
	"time"

	charmlog "github.com/charmbracelet/log"
)

type LogFormat string

const (
	Invalid LogFormat = "invalid"
	Text    LogFormat = "text"
	Json    LogFormat = "json"
)

var Log *charmlog.Logger

func InitLogger(format LogFormat, debug bool) {
	logger := charmlog.New(os.Stdout)
	logger.SetTimeFormat(time.TimeOnly)
	logger.SetReportCaller(true)
	logger.SetReportTimestamp(true)
	logger.SetLevel(charmlog.InfoLevel)

	if debug {
		logger.SetLevel(charmlog.DebugLevel)
	}

	if format == Json {
		logger.SetFormatter(charmlog.JSONFormatter)
		logger.SetTimeFormat(time.RFC3339) // Structure time differently for JSON
	}

	Log = logger
}

func GetLogFormat(format string) LogFormat {
	normalized := strings.ToLower(format)
	if normalized == "text" {
		return Text
	}
	if normalized == "json" {
		return Json
	}
	return Invalid
}

func GetTempLogger() *charmlog.Logger {
	logger := charmlog.New(os.Stdout)
	logger.SetTimeFormat(time.TimeOnly)
	logger.SetReportCaller(true)
	logger.SetReportTimestamp(true)
	logger.SetLevel(charmlog.InfoLevel)

	return logger
}
