package scheduler

import (
	"sync"
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func (c *Scheduler) Start(initialCheckHash string, initialChecks []http.CheckResponse) {
	c.currentCheckHash = initialCheckHash
	c.currentChecks = initialChecks

	var wg sync.WaitGroup

	// Run in background
	wg.Add(1)
	go func() {
		c.startUpdateChecker()
		defer wg.Done()
	}()

	c.startScheduleLoop()
	wg.Wait()
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

	for {
		timer, nextCheck := c.getNextCheckTimer()

		select {
		case <-c.ctx.Done():
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
