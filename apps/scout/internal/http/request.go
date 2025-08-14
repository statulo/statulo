package http

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"math"
	"net/http"
	"net/url"
	"path"
	"time"

	l "github.com/statulo/scout/internal/logger"
)

type OrchestratorRequest struct {
	Path        string
	Method      string
	Timeout     time.Duration
	MaxAttempts int
	Body        []byte
	Token       string
}

func (c *OrchestratorClient) DoOrchestratorRequest(req OrchestratorRequest) (*http.Response, error) {
	baseDelay := time.Millisecond * 500
	attempts := req.MaxAttempts
	var lastError error = nil
	if attempts < 1 {
		attempts = math.MaxInt
	}
	for i := 0; i < attempts; i++ {
		if i > 0 {
			delay := baseDelay * time.Duration(math.Pow(1.5, float64(i)))
			if delay > time.Minute*3 {
				delay = time.Minute * 3
			}
			time.Sleep(delay)
			l.Log.Debugf("Retrying Request (%d / %d): %s", i, attempts, req.Path)
		}
		res, err := c.rawOrchestratorRequest(req)
		if err != nil {
			lastError = err
			continue
		}
		if res.StatusCode != http.StatusOK {
			lastError = fmt.Errorf("bad status: %s", res.Status)
			continue
		}
		return res, nil
	}

	return nil, lastError
}

func (c *OrchestratorClient) rawOrchestratorRequest(req OrchestratorRequest) (*http.Response, error) {
	ctx, cancel := context.WithTimeout(context.Background(), req.Timeout)
	defer cancel()

	url, err := url.Parse(c.BaseUrl)
	if err != nil {
		return nil, err
	}
	url.Path = path.Join(url.Path, req.Path)

	var payload io.Reader = nil
	hasBody := len(req.Body) > 0
	if hasBody {
		payload = bytes.NewBuffer(req.Body)
	}

	httpReq, err := http.NewRequestWithContext(ctx, req.Method, url.String(), payload)
	if err != nil {
		return nil, err
	}

	httpReq.Header.Set("User-Agent", c.UserAgentName+"/"+c.Version)

	if len(req.Token) > 0 {
		httpReq.Header.Set("Authorization", "Scout "+req.Token)
	}

	if hasBody {
		httpReq.Header.Set("Content-Type", "application/json")
	}

	res, err := http.DefaultClient.Do(httpReq)
	if err != nil {
		return nil, err
	}
	return res, nil
}
