package reporter

import (
	"fmt"
)

type CheckError interface {
	CheckError() error
}

type BaseCheckError struct {
	CheckType string `json:"checkType,omitempty"`
	Reason    Reason `json:"reason"`
	Message   string `json:"message"`
	cause     error  // not marshalled
}

type HTTPCheckError struct {
	*BaseCheckError
	Method     string `json:"method,omitempty"`
	URL        string `json:"url,omitempty"`
	StatusCode int    `json:"status_code,omitempty"`
}

func (e *BaseCheckError) CheckError() error {
	return e
}

func (e *BaseCheckError) Error() string {
	if e.cause != nil {
		return fmt.Sprintf("%s %s: %s", e.CheckType, e.Reason, e.cause)
	}
	return fmt.Sprintf("%s %s: %s", e.CheckType, e.Reason, e.Message)
}

func (e *BaseCheckError) Unwrap() error { return e.cause }

func (e *BaseCheckError) Is(target error) bool {
	t, ok := target.(*BaseCheckError)
	if !ok {
		return false
	}

	matchCheck := t.CheckType == e.CheckType
	matchReason := t.Reason == e.Reason
	return matchCheck && matchReason
}

func (e *HTTPCheckError) Error() string {
	if e.StatusCode != 0 {
		return fmt.Sprintf("HTTP %s %s -> %d (%v): %s", e.Method, e.URL, e.StatusCode, e.Reason, e.BaseCheckError.Error())
	}
	return fmt.Sprintf("HTTP %s %s (%v): %s", e.Method, e.URL, e.Reason, e.BaseCheckError.Error())
}

func New(checkType string, message string, reason Reason) *BaseCheckError {
	return &BaseCheckError{
		CheckType: checkType,
		Reason:    reason,
		Message:   message,
	}
}

func Wrap(checkType string, err error) *BaseCheckError {
	reason, message := Classify(err)
	return &BaseCheckError{
		CheckType: checkType,
		Reason:    reason,
		Message:   message,
		cause:     err,
	}
}

func WrapHTTP(method, url string, cause error) *HTTPCheckError {
	reason, message := Classify(cause)
	base := &BaseCheckError{
		CheckType: "http",
		Reason:    reason,
		Message:   message,
		cause:     cause,
	}
	return &HTTPCheckError{BaseCheckError: base, Method: method, URL: url}
}

func NewHTTP(method, url string, message string, reason Reason) *HTTPCheckError {
	base := &BaseCheckError{
		CheckType: "http",
		Reason:    reason,
		Message:   message,
	}
	return &HTTPCheckError{BaseCheckError: base, Method: method, URL: url}
}
