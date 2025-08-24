package checker

import (
	scoutHttp "github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
	"github.com/statulo/scout/internal/metrics"
)

type Checker struct {
	client *scoutHttp.OrchestratorClient
}

func CreateChecker(client *scoutHttp.OrchestratorClient) Checker {
	return Checker{
		client: client,
	}
}

func (c *Checker) startCheck(check scoutHttp.CheckResponse) error {
	switch check.Type {
	case "http":
		err := c.checkHTTP(check)
		return err
	default:
		l.Log.Errorf("unsupported check type: %s", check.Type)
		return nil
	}
}

func (c *Checker) RunCheckInBg(check scoutHttp.CheckResponse) {
	go func() {
		defer l.Log.Infof("Starting check %s (%s)", check.Id, check.Type)
		metrics.ChecksExecuted.Inc()
		err := c.startCheck(check)
		if err != nil {
			l.Log.Debugf("Errored check %s: %s", check.Id, err)
		}
		// TODO handle errors (report to server)
		// TODO log start and end of checks
	}()
}
