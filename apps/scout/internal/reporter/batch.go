package reporter

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
	"github.com/statulo/scout/internal/util"
)

type Reporter struct {
	batchQueue   chan ReportRequest
	wg           util.WaitGroupWithCount
	client       *http.OrchestratorClient
	backlogLimit int
}

func NewReporter(client *http.OrchestratorClient, backlogLimit int) Reporter {
	return Reporter{
		batchQueue:   make(chan ReportRequest),
		client:       client,
		backlogLimit: backlogLimit,
	}
}

func (r *Reporter) Start(ctx context.Context) {
	for {
		timer := time.NewTimer(time.Minute)
		select {

		case <-ctx.Done():
			l.Log.Infof("Received shutdown signal, flushing remaining reports")
			batch := r.GetBatch()
			l.Log.Debugf("Flushing %d reports", len(batch))
			r.sendReport(batch)
			return
		case <-timer.C:
			batch := r.GetBatch()

			if len(batch) == 0 {
				l.Log.Debugf("No reports to send")
				continue
			}

			currentBacklog := r.wg.GetCount()
			if currentBacklog > r.backlogLimit {
				l.Log.Errorf("Backlog too high (%d / %d), dropping reports", currentBacklog, r.backlogLimit)
				continue
			}

			l.Log.Debugf("Sending batch of %d reports", len(batch))
			r.sendReport(batch)
		}
	}
}

func (r *Reporter) GetBatch() []ReportRequest {
	// Snapshot current length of the queue, so we don't process items added while processing
	currentLen := len(r.batchQueue)

	batch := make([]ReportRequest, 0, currentLen)

	for range currentLen {
		select {
		case item := <-r.batchQueue:
			batch = append(batch, item)
		default:
			// channel is empty
		}

		if len(r.batchQueue) == 0 {
			break
		}
	}
	return batch
}
