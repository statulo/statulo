package reporter

import "log"

type ReportRequest struct {
	Success    bool       `json:"success"`
	DurationMs int64      `json:"duration_ms,omitempty"`
	Error      CheckError `json:"error,omitempty"`
	Result     any        `json:"result,omitempty"`
}

func (r *Reporter) Queue(report ReportRequest) {
	if report.Success {
		r.batchQueue <- report
	} else {
		r.sendReport([]ReportRequest{report})
	}
}

func (r *Reporter) sendReport(reports []ReportRequest) {
	r.wg.Add(1)
	go func() {
		// TODO report it for real
		log.Printf("reporting: %v", reports)
		defer r.wg.Done()
	}()
}
