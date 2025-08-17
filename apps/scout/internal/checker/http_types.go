package checker

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"regexp"
	"strconv"

	l "github.com/statulo/scout/internal/logger"
)

type HttpCheckBodyVersioned interface {
	Version() int32
	BuildHttpRequest(ctx context.Context) (*http.Request, error)
	ValidateResponse(resp *http.Response) error
}

type HttpCheckBodyV1 struct {
	Url                string                `json:"url"`
	ExpectedKeywords   []string              `json:"expectedKeywords"`
	AllowedStatusCodes []HttpStatusCodeRange `json:"allowedStatusCodes"`
}

type HttpStatusCodeRange struct {
	Min int
	Max int
}

func (h *HttpStatusCodeRange) UnmarshalJSON(data []byte) error {
	var rangeStr string
	if err := json.Unmarshal(data, &rangeStr); err != nil {
		return fmt.Errorf("failed to unmarshal HTTP status code range: %w", err)
	}
	re := regexp.MustCompile(`^(\d+)-(\d+)$`)
	matches := re.FindStringSubmatch(rangeStr)
	if len(matches) != 3 {
		return errors.New("invalid status code range format, expected 'min-max'")
	}

	min, _ := strconv.Atoi(matches[1])
	max, _ := strconv.Atoi(matches[2])
	if min < 100 || min > 599 {
		return errors.New("min status code must be between 100 and 599")
	}
	if max < 100 || max > 599 {
		return errors.New("max status code must be between 100 and 599")
	}
	if min > max {
		return errors.New("min status code cannot be greater than max status code")
	}

	h.Min = min
	h.Max = max

	return nil
}

func (h HttpStatusCodeRange) String() string {
	return fmt.Sprintf("%d-%d", h.Min, h.Max)
}

func (h HttpCheckBodyV1) Version() int32 {
	return 1
}

func (h HttpCheckBodyV1) BuildHttpRequest(ctx context.Context) (*http.Request, error) {
	req, err := http.NewRequestWithContext(ctx, "GET", h.Url, nil) // TODO: Have a way to set the method
	if err != nil {
		return nil, err
	}

	req.Header.Set("User-Agent", "Scout/1.0") // TODO: Get this from somewhere
	req.Header.Set("Accept", "*/*")
	req.Header.Set("Cache-Control", "no-cache")

	return req, nil
}

func (h HttpCheckBodyV1) ValidateResponse(resp *http.Response) error {
	l.Log.Debugf("Response: %v", resp)

	validStatusCode := false
	for _, codeRange := range h.AllowedStatusCodes {
		if resp.StatusCode >= codeRange.Min && resp.StatusCode <= codeRange.Max {
			l.Log.Debugf("Response status code %d is within allowed range %d-%d", resp.StatusCode, codeRange.Min, codeRange.Max)
			validStatusCode = true
		}
	}
	if !validStatusCode {
		return fmt.Errorf("response status code %d is not within allowed ranges %v", resp.StatusCode, h.AllowedStatusCodes)
	}

	// TODO: Validate keywords

	return nil
}

func UnmarshalHttpCheckBody(version int32, body json.RawMessage) (HttpCheckBodyVersioned, error) {
	switch version {
	case 1:
		var v1 HttpCheckBodyV1
		if err := json.Unmarshal(body, &v1); err != nil {
			return nil, err
		}
		return v1, nil
	default:
		return nil, fmt.Errorf("unsupported HTTP check body version: %d", version)
	}
}
