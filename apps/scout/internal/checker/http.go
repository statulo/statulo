package checker

import (
	"context"
	"time"

	"github.com/statulo/scout/internal/http"
	"github.com/statulo/scout/internal/reporter"

	goHttp "net/http"
)

type HttpCheckResponse struct {
	Status int `json:"status"`
	// TODO: What else to return?
}

func (c *Checker) checkHTTP(check http.CheckResponse) (*HttpCheckResponse, time.Duration, reporter.CheckError) {
	if check.Type != "http" {
		return nil, 0, reporter.NewError("", "invalid check type", reporter.ReasonConfig)
	}

	checkBody, err := UnmarshalHttpCheckBody(check.Version, check.Body)
	if err != nil {
		return nil, 0, reporter.NewError("http", "couldn't unmarshal HTTP check body", reporter.ReasonConfig)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // TODO: Make timeout configurable
	defer cancel()

	httpRequest, err := checkBody.BuildHttpRequest(ctx, c.client.GetScoutHeaders())
	if err != nil {
		return nil, 0, reporter.WrapError("http", err)
	}

	start := time.Now() // TODO: Use HTTP tracing rather than this primitive timing
	res, err := goHttp.DefaultClient.Do(httpRequest)
	elapsed := time.Since(start)
	if err != nil {
		return nil, elapsed, reporter.WrapHTTPError(httpRequest.Method, httpRequest.URL.String(), err)
	}
	defer res.Body.Close()

	err = checkBody.ValidateResponse(res)
	if err != nil {
		return nil, elapsed, reporter.NewHTTPError(httpRequest.Method, httpRequest.URL.String(), err.Error(), reporter.ReasonResponse)
	}

	return &HttpCheckResponse{
		Status: res.StatusCode,
	}, elapsed, nil
}
