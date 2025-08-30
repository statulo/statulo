package checker

import (
	"fmt"
	"sync"
	"time"

	scoutHttp "github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
	"github.com/statulo/scout/internal/metrics"
	scoutReporter "github.com/statulo/scout/internal/reporter"
)

type Checker struct {
	client   *scoutHttp.OrchestratorClient
	reporter *scoutReporter.Reporter
	wg       sync.WaitGroup
}

func CreateChecker(client *scoutHttp.OrchestratorClient, reporter *scoutReporter.Reporter) Checker {
	return Checker{
		client:   client,
		reporter: reporter,
	}
}

func (c *Checker) Wait() {
	c.wg.Wait()
}

func (c *Checker) startCheck(check scoutHttp.CheckResponse) (any, time.Duration, scoutReporter.CheckError) {
	switch check.Type {
	case "http":
		res, duration, err := c.checkHTTP(check)

		return res, duration, err
	default:
		l.Log.Errorf("unsupported check type: %s", check.Type)
		return nil, 0, scoutReporter.NewError("", fmt.Sprintf("unsupported check type: %s", check.Type), scoutReporter.ReasonConfig)
	}
}

func (c *Checker) RunCheckInBg(check scoutHttp.CheckResponse) {
	c.wg.Add(1)
	go func() {
		defer c.wg.Done()
		l.Log.Debugf("Starting check %s (%s)", check.Id, check.Type)
		metrics.ChecksExecuted.Inc()
		res, duration, err := c.startCheck(check)
		l.Log.Debugf("Finished check %s (%s) in %s - success: %t, error: %v", check.Id, check.Type, duration, err == nil, err)

		checkResult := scoutReporter.ReportRequest{
			Success:    err == nil,
			DurationMs: duration.Milliseconds(),
			Error:      err,
			Result:     res,
		}

		c.reporter.Queue(checkResult)
		// TODO handle panics
		// TODO handle graceful exit (Waitgroups)
	}()
}
