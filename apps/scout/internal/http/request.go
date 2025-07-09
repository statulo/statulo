package http

import (
	"bytes"
	"context"
	"io"
	"net/http"
	"net/url"
	"path"
	"time"
)

type OrchestratorRequest struct {
	Path    string
	Method  string
	Timeout time.Duration
	Body    []byte
	Token   string
}

func (c *OrchestratorClient) DoOrchestratorRequest(req OrchestratorRequest) (*http.Response, error) {
	ctx, cancel := context.WithTimeout(context.Background(), req.Timeout)
	defer cancel()

	url, err := url.Parse(c.BaseUrl)
	url.Path = path.Join(url.Path, req.Path)
	if err != nil {
		return nil, err
	}

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
