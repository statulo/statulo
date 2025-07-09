package http

import (
	"fmt"
	"net/http"
	"time"
)

type GoodbyeRequest struct {
	Timeout time.Duration
}

func (c *OrchestratorClient) DoGoodbye(ops GoodbyeRequest) error {
	req := OrchestratorRequest{
		Path:    "api/v1/orchestrator/agents/goodbye",
		Method:  http.MethodPost,
		Timeout: ops.Timeout,
		Token:   c.Token,
	}
	res, err := c.DoOrchestratorRequest(req)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		return fmt.Errorf("bad status: %s", res.Status)
	}

	return nil
}
