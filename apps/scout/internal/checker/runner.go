package checker

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	scoutErrors "github.com/statulo/scout/internal/errors"
	scoutHttp "github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
	"github.com/statulo/scout/internal/metrics"
)

type Checker struct {
	client *scoutHttp.OrchestratorClient
}

type CheckResult struct {
	Success    bool                     `json:"success"`
	DurationMs int64                    `json:"duration_ms,omitempty"`
	Error      scoutErrors.StatuloError `json:"error,omitempty"`
	Result     any                      `json:"result,omitempty"`
}

func CreateChecker(ctx context.Context, client *scoutHttp.OrchestratorClient) Checker {
	return Checker{
		client: client,
	}
}

func (c *Checker) startCheck(check scoutHttp.CheckResponse) (any, time.Duration, scoutErrors.StatuloError) {
	switch check.Type {
	case "http":
		res, duration, err := c.checkHTTP(check)

		return res, duration, err
	default:
		l.Log.Errorf("unsupported check type: %s", check.Type)
		return nil, 0, scoutErrors.New("", fmt.Sprintf("unsupported check type: %s", check.Type), scoutErrors.ReasonConfig)
	}
}

func (c *Checker) RunCheckInBg(check scoutHttp.CheckResponse) {
	go func() {
		defer l.Log.Infof("Starting check %s (%s)", check.Id, check.Type)
		metrics.ChecksExecuted.Inc()
		res, duration, err := c.startCheck(check)
		l.Log.Infof("Finished check %s (%s) in %s - success: %t, error: %v", check.Id, check.Type, duration, err == nil, err)

		checkResult := CheckResult{
			Success:    err == nil,
			DurationMs: duration.Milliseconds(),
			Error:      err,
			Result:     res,
		}

		jsonOut, _ := json.MarshalIndent(checkResult, "", "  ")

		fmt.Print(string(jsonOut))

		// TODO handle errors (report to server)
		// TODO log start and end of checks
		// TODO handle panics
		// TODO handle graceful exit
	}()
}
