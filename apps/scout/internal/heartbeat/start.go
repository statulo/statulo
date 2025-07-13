package heartbeat

import (
	"fmt"
	"time"

	"github.com/statulo/scout/internal/http"
)

func (c *Heartbeater) Start(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			fmt.Println("Stopping heartbeat")
			return
		case <-c.updateChan:
			c.updateChan = make(chan struct{})
			ticker.Stop()
			ticker = time.NewTicker(c.interval)
			defer ticker.Stop()
		case t := <-ticker.C:
			fmt.Printf("Heartbeat at %s\n", t.Format(time.RFC3339))
			res, err := c.client.DoHeartbeat(http.HeartbeatRequest{
				Timeout: time.Second * 15,
			})
			if err != nil {
				fmt.Println("Failed to heartbeat")
				continue
			}
			fmt.Printf("Heartbeat hash: %s\n", res.CheckHash)
			// TODO If returned hash from heartbeat is different, refetch schedule and notify caller
		}
	}
}
