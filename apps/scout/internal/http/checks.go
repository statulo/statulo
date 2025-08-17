package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type ChecksResponse struct {
	Checks    []CheckResponse `json:"checks"`
	CheckHash string          `json:"checkHash"`
}

type CheckResponse struct {
	Id        string          `json:"id"`
	MonitorId string          `json:"monitorId"`
	Interval  int64           `json:"interval"`
	Version   int32           `json:"version"`
	Type      string          `json:"type"`
	StartAt   string          `json:"startAt"`
	EndAt     *string         `json:"endAt"` // Nullable
	Body      json.RawMessage `json:"body"`
}

type ChecksRequest struct {
	Timeout     time.Duration
	MaxAttempts int
}

func (c *OrchestratorClient) DoChecks(ops ChecksRequest) (*ChecksResponse, error) {
	req := OrchestratorRequest{
		Path:        "api/v1/orchestrator/agents/checks",
		Method:      http.MethodGet,
		Timeout:     ops.Timeout,
		MaxAttempts: ops.MaxAttempts,
		Token:       c.Token,
	}
	res, err := c.DoOrchestratorRequest(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %s", res.Status)
	}

	var out ChecksResponse
	jsonErr := json.NewDecoder(res.Body).Decode(&out)
	if jsonErr != nil {
		return nil, jsonErr
	}

	return &out, nil
}
