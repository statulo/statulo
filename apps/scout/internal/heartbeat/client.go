package heartbeat

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
)

type Heartbeater struct {
	ctx             context.Context
	updateChan      chan struct{}
	checkUpdateChan chan string
	client          *http.OrchestratorClient
	interval        time.Duration
}

func (c *Heartbeater) UpdateInterval(interval time.Duration) {
	c.interval = interval
	c.updateChan <- struct{}{}
}

func CreateHeartbeater(ctx context.Context, checkUpdateChan chan string, client *http.OrchestratorClient) Heartbeater {
	return Heartbeater{
		client:          client,
		ctx:             ctx,
		checkUpdateChan: checkUpdateChan,
		updateChan:      make(chan struct{}),
	}
}
