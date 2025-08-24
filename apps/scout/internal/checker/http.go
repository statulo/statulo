package checker

import (
	"context"
	"time"

	scoutErrors "github.com/statulo/scout/internal/errors"
	"github.com/statulo/scout/internal/http"

	goHttp "net/http"
)

type HttpCheckResponse struct {
	Status int `json:"status"`
	// TODO: What else to return?
}

func (c *Checker) checkHTTP(check http.CheckResponse) (*HttpCheckResponse, time.Duration, scoutErrors.StatuloError) {
	if check.Type != "http" {
		return nil, 0, scoutErrors.New("", "invalid check type", scoutErrors.ReasonConfig)
	}

	checkBody, err := UnmarshalHttpCheckBody(check.Version, check.Body)
	if err != nil {
		return nil, 0, scoutErrors.New("http", "couldn't unmarshal HTTP check body", scoutErrors.ReasonConfig)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // TODO: Make timeout configurable
	defer cancel()

	httpRequest, err := checkBody.BuildHttpRequest(ctx, c.client.GetScoutHeaders())
	if err != nil {
		return nil, 0, scoutErrors.Wrap("http", err)
	}

	start := time.Now() // TODO: Use HTTP tracing rather than this primitive timing
	res, err := goHttp.DefaultClient.Do(httpRequest)
	elapsed := time.Since(start)
	if err != nil {
		return nil, elapsed, scoutErrors.WrapHTTP(httpRequest.Method, httpRequest.URL.String(), err)
	}
	defer res.Body.Close()

	err = checkBody.ValidateResponse(res)
	if err != nil {
		return nil, elapsed, scoutErrors.NewHTTP(httpRequest.Method, httpRequest.URL.String(), err.Error(), scoutErrors.ReasonResponse)
	}

	return &HttpCheckResponse{
		Status: res.StatusCode,
	}, elapsed, nil
}
