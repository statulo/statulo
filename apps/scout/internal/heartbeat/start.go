package heartbeat

import (
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func (c *Heartbeater) Start(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			l.Log.Info("Stopping heartbeat")
			return
		case <-c.updateChan:
			c.updateChan = make(chan struct{})
			ticker.Stop()
			ticker = time.NewTicker(c.interval)
			defer ticker.Stop()
		case <-ticker.C:
			l.Log.Info("Heartbeat success")
			res, err := c.client.DoHeartbeat(http.HeartbeatRequest{
				Timeout: time.Second * 15,
			})
			if err != nil {
				l.Log.Errorf("Failed to heartbeat %s", err)
				continue
			}
			l.Log.Debugf("Heartbeat hash: %s", res.CheckHash)
			// TODO If returned hash from heartbeat is different, refetch schedule and notify caller
		}
	}
}
