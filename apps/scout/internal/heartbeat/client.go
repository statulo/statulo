package heartbeat

import (
	"time"

	"github.com/statulo/scout/internal/http"
)

type Heartbeater struct {
	updateChan      chan struct{}
	checkUpdateChan chan string
	client          *http.OrchestratorClient
	interval        time.Duration
}

func (c *Heartbeater) UpdateInterval(interval time.Duration) {
	c.interval = interval
	c.updateChan <- struct{}{}
}

func CreateHeartbeater(checkUpdateChan chan string, client *http.OrchestratorClient) Heartbeater {
	return Heartbeater{
		client:          client,
		checkUpdateChan: checkUpdateChan,
		updateChan:      make(chan struct{}),
	}
}
