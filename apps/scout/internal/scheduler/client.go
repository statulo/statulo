package scheduler

import (
	"context"

	"github.com/statulo/scout/internal/http"
)

type Scheduler struct {
	ctx                context.Context
	checkUpdateChan    chan string
	scheduleUpdateChan chan struct{}
	client             *http.OrchestratorClient
	currentCheckHash   string
	currentChecks      []http.CheckResponse
}

func CreateScheduler(ctx context.Context, client *http.OrchestratorClient) Scheduler {
	return Scheduler{
		client:             client,
		ctx:                ctx,
		checkUpdateChan:    make(chan string),
		scheduleUpdateChan: make(chan struct{}),
	}
}

func (s *Scheduler) GetCheckUpdateChannel() chan string {
	return s.checkUpdateChan
}
