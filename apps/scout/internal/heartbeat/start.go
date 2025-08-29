package heartbeat

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

func (c *Heartbeater) Start(ctx context.Context, interval time.Duration) {
	l.Log.Debug("Initialized heartbeat job")

	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ctx.Done():
			l.Log.Debug("Stopping heartbeat job")
			return
		case <-c.updateChan:
			l.Log.Debug("New heartbeat interval received, restarting heartbeat job")
			ticker.Stop()
			ticker = time.NewTicker(c.interval)
			defer ticker.Stop()
		case <-ticker.C:
			l.Log.Debug("Sending heartbeat")
			res, err := c.client.DoHeartbeat(http.HeartbeatRequest{
				Timeout:     time.Second * 15,
				MaxAttempts: 2,
				Context:     ctx,
			})
			if err != nil {
				l.Log.Errorf("Failed to heartbeat: %s", err)
				continue
			}
			l.Log.Debugf("Heartbeat returned OK")
			select {
			case c.checkUpdateChan <- res.CheckHash:
			default:
			}
		}
	}
}
