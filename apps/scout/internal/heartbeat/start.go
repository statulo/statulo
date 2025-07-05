package heartbeat

import (
	"fmt"
	"time"
)

func (c *Heartbeater) Start(interval time.Duration) {
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-c.ctx.Done():
			return
		case <-c.updateChan:
			c.updateChan = make(chan struct{})
			ticker.Stop()
			ticker = time.NewTicker(c.interval)
			defer ticker.Stop()
		case t := <-ticker.C:
			// TODO actually send heartbeat
			// TODO If returned hash from heartbeat is different, refetch schedule and notify caller
			fmt.Printf("Heartbeat at %s\n", t.Format(time.RFC3339))
		}
	}
}
