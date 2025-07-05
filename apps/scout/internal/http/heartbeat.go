package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type HeartbeatResponse struct {
	CheckHash string `json:"checkHash"`
}

type HeartbeatRequest struct {
	Timeout time.Duration
}

func (c *OrchestratorClient) DoHeartbeat(ops HeartbeatRequest) (*HeartbeatResponse, error) {
	req := OrchestratorRequest{
		Path:    "api/v1/orchestrator/agents/heartbeat",
		Method:  http.MethodGet,
		Timeout: ops.Timeout,
		Token:   c.Token,
	}
	res, err := c.DoOrchestratorRequest(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %s", res.Status)
	}

	var out HeartbeatResponse
	jsonErr := json.NewDecoder(res.Body).Decode(&out)
	if jsonErr != nil {
		return nil, jsonErr
	}

	return &out, nil
}
