package scheduler

import (
	"context"

	"github.com/statulo/scout/internal/http"
)

type Scheduler struct {
	ctx              context.Context
	checkUpdateChan  chan string
	client           *http.OrchestratorClient
	currentCheckHash string
}

func CreateScheduler(ctx context.Context, client *http.OrchestratorClient) Scheduler {
	return Scheduler{
		client:          client,
		ctx:             ctx,
		checkUpdateChan: make(chan string),
	}
}

func (s *Scheduler) GetCheckUpdateChannel() chan string {
	return s.checkUpdateChan
}
