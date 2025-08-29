package scheduler

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func (c *Scheduler) Start(ctx context.Context, initialCheckHash string, initialChecks []http.CheckResponse) {
	c.currentCheckHash = initialCheckHash
	c.currentChecks = initialChecks

	c.startScheduleLoop(ctx)
}

func (c *Scheduler) StartUpdateChecker(ctx context.Context) {
	l.Log.Debug("Initialized scheduler update job")

	for {
		select {
		case <-ctx.Done():
			l.Log.Debug("Stopping scheduler update job")
			return
		case newCheckHash := <-c.checkUpdateChan:
			if c.currentCheckHash == newCheckHash {
				continue
			}

			l.Log.Debugf("New workload discovered, fetching new schedule")
			res, err := c.client.DoChecks(http.ChecksRequest{
				Timeout:     30 * time.Second,
				MaxAttempts: 15,
				Context:     ctx,
			})
			if err != nil {
				l.Log.Errorf("Failed to load new checks: %s", err)
				continue
			}
			c.currentChecks = res.Checks
			c.currentCheckHash = res.CheckHash
			select {
			case c.scheduleUpdateChan <- struct{}{}:
			default:
			}
			l.Log.Debugf("Received new schedule")
			l.Log.Info("Workload updated") // TODO improve log message
		}
	}
}

func (c *Scheduler) startScheduleLoop(ctx context.Context) {
	l.Log.Debug("Initialized scheduler job")

	for {
		timer, nextCheck := c.getNextCheckTimer()

		select {
		case <-ctx.Done():
			l.Log.Debug("Stopping scheduler job")
			return
		case <-c.scheduleUpdateChan:
			continue
		case <-timer.C:
			if nextCheck == nil {
				l.Log.Error("Check is not passed in on a fired timer!")
				continue
			}
			c.checker.RunCheckInBg(*nextCheck)
			continue
		}
	}
}
