package errors

import (
	"fmt"
)

type StatuloError interface {
	StatuloError() error
}

type ErrCheckFailed struct {
	CheckType string `json:"checkType,omitempty"`
	Reason    Reason `json:"reason"`
	Message   string `json:"message"`
	cause     error  // not marshalled
}

func (e *ErrCheckFailed) StatuloError() error {
	return e
}

func (e *ErrCheckFailed) Error() string {
	if e.cause != nil {
		return fmt.Sprintf("%s %s: %s", e.CheckType, e.Reason, e.cause)
	}
	return fmt.Sprintf("%s %s: %s", e.CheckType, e.Reason, e.Message)
}

func (e *ErrCheckFailed) Unwrap() error { return e.cause }

func (e *ErrCheckFailed) Is(target error) bool {
	t, ok := target.(*ErrCheckFailed)
	if !ok {
		return false
	}

	matchCheck := t.CheckType == e.CheckType
	matchReason := t.Reason == e.Reason
	return matchCheck && matchReason
}

type HTTPFailed struct {
	*ErrCheckFailed
	Method     string `json:"method,omitempty"`
	URL        string `json:"url,omitempty"`
	StatusCode int    `json:"status_code,omitempty"`
}

func (e *HTTPFailed) Error() string {
	if e.StatusCode != 0 {
		return fmt.Sprintf("HTTP %s %s -> %d (%v): %s", e.Method, e.URL, e.StatusCode, e.Reason, e.ErrCheckFailed.Error())
	}
	return fmt.Sprintf("HTTP %s %s (%v): %s", e.Method, e.URL, e.Reason, e.ErrCheckFailed.Error())
}

func New(checkType string, message string, reason Reason) *ErrCheckFailed {
	return &ErrCheckFailed{
		CheckType: checkType,
		Reason:    reason,
		Message:   message,
	}
}

func Wrap(checkType string, err error) *ErrCheckFailed {
	reason, message := Classify(err)
	return &ErrCheckFailed{
		CheckType: checkType,
		Reason:    reason,
		Message:   message,
		cause:     err,
	}
}

func WrapHTTP(method, rawURL string, cause error) *HTTPFailed {
	// u := sanitiseURL(rawURL)
	u := rawURL
	reason, message := Classify(cause)
	base := &ErrCheckFailed{
		CheckType: "http",
		Reason:    reason,
		Message:   message,
		cause:     cause,
	}
	return &HTTPFailed{ErrCheckFailed: base, Method: method, URL: u}
}

func NewHTTP(method, rawURL string, message string, reason Reason) *HTTPFailed {
	// u := sanitiseURL(rawURL)
	u := rawURL
	base := &ErrCheckFailed{
		CheckType: "http",
		Reason:    reason,
		Message:   message,
	}
	return &HTTPFailed{ErrCheckFailed: base, Method: method, URL: u}
}
