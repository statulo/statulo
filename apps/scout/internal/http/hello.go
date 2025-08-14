package http

import (
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type HelloResponse struct {
	AgentId   string          `json:"agentId"`
	Token     string          `json:"token"`
	Heartbeat int             `json:"heartbeat"`
	CheckHash string          `json:"checkHash"`
	Checks    []CheckResponse `json:"checks"`
}

type HelloBody struct {
	Version string `json:"version"`
}

type HelloRequest struct {
	Timeout     time.Duration
	MaxAttempts int
	RegToken    string
}

func (c *OrchestratorClient) DoHello(ops HelloRequest) (*HelloResponse, error) {
	payloadData := HelloBody{
		Version: c.Version,
	}
	payload, err := json.Marshal(payloadData)
	if err != nil {
		return nil, err
	}

	req := OrchestratorRequest{
		Path:        "api/v1/orchestrator/agents/hello",
		Method:      http.MethodPost,
		Timeout:     ops.Timeout,
		MaxAttempts: ops.MaxAttempts,
		Body:        payload,
		Token:       ops.RegToken,
	}
	res, err := c.DoOrchestratorRequest(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("bad status: %s", res.Status)
	}

	var out HelloResponse
	jsonErr := json.NewDecoder(res.Body).Decode(&out)
	if jsonErr != nil {
		return nil, jsonErr
	}

	return &out, nil
}
