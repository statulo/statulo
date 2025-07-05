package heartbeat

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
)

type Heartbeater struct {
	ctx        context.Context
	updateChan chan struct{}
	client     *http.OrchestratorClient
	interval   time.Duration
}

func (c *Heartbeater) UpdateInterval(interval time.Duration) {
	c.interval = interval
	close(c.updateChan)
}

func CreateHeartbeater(ctx context.Context, client *http.OrchestratorClient) Heartbeater {
	return Heartbeater{
		client:     client,
		ctx:        ctx,
		updateChan: make(chan struct{}),
	}
}
