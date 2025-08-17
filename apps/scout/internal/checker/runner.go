package checker

import (
	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func startCheck(check http.CheckResponse) error {
	switch check.Type {
	case "http":
		err := CheckHTTP(check)
		return err
	default:
		l.Log.Errorf("unsupported check type: %s", check.Type)
		return nil
	}
}

func RunCheckInBg(check http.CheckResponse) {
	go func() {
		l.Log.Infof("Starting check %s (%s)", check.Id, check.Type)
		err := startCheck(check)
		if err != nil {
			l.Log.Debugf("Errored check %s: %s", check.Id, err)
		}
		// TODO handle errors (report to server)
		// TODO log start and end of checks
	}()
}
