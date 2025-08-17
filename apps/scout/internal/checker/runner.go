package checker

import (
	"context"

	scoutHttp "github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

type Checker struct {
	ctx    context.Context
	client *scoutHttp.OrchestratorClient
}

func CreateChecker(ctx context.Context, client *scoutHttp.OrchestratorClient) Checker {
	return Checker{
		ctx:    ctx,
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
		l.Log.Infof("Starting check %s (%s)", check.Id, check.Type)
		err := c.startCheck(check)
		if err != nil {
			l.Log.Debugf("Errored check %s: %s", check.Id, err)
		}
		// TODO handle errors (report to server)
		// TODO log start and end of checks
	}()
}
