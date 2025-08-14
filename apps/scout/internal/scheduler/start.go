package scheduler

import (
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func (c *Scheduler) Start(initialCheckHash string, initialChecks []http.CheckResponse) {
	c.currentCheckHash = initialCheckHash
	c.currentChecks = initialChecks
	go c.startUpdateChecker() // Run in background
	c.startScheduleLoop()
}

func (c *Scheduler) startUpdateChecker() {
	l.Log.Debug("Initialized scheduler update job")

	for {
		select {
		case <-c.ctx.Done():
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
			})
			if err != nil {
				l.Log.Errorf("Failed to load new checks: %s", err)
				continue
			}
			c.currentChecks = res.Checks
			c.currentCheckHash = res.CheckHash
			c.scheduleUpdateChan <- struct{}{}
			l.Log.Debugf("Received new schedule")
			l.Log.Info("Workload updated") // TODO improve log message
		}
	}
}

func (c *Scheduler) startScheduleLoop() {
	l.Log.Debug("Initialized scheduler job")

	// TODO add real scheduler workload
	l.Log.Debugf("Check schedule: %+v", c.currentChecks)

	for {
		select {
		case <-c.ctx.Done():
			l.Log.Debug("Stopping scheduler job")
			return
		case <-c.scheduleUpdateChan:
			l.Log.Debugf("Check schedule: %+v", c.currentChecks)
		}
	}
}
