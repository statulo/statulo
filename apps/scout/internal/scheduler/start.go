package scheduler

import (
	"time"

	l "github.com/statulo/scout/internal/logger"
)

func (c *Scheduler) Start(initialCheckHash string) {
	c.currentCheckHash = initialCheckHash
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
			c.currentCheckHash = newCheckHash
			// TODO fetch new schedule + message the scheduler loop to use it
			l.Log.Debugf("Received new schedule")
			l.Log.Info("Workload updated") // TODO improve log message
		}
	}
}

func (c *Scheduler) startScheduleLoop() {
	l.Log.Debug("Initialized scheduler job")

	// TODO add real scheduler workload
	ticker := time.NewTicker(time.Hour)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			l.Log.Debug("Stopping scheduler job")
			return
		case <-ticker.C:
			l.Log.Debug("Ticking...")
		}
	}
}
