package errors

import (
	"context"
	"crypto/tls"
	"errors"
	"net"
	"net/url"
	"os"
)

type Reason string

const (
	ReasonUnknown   Reason = "unknown"
	ReasonCancelled Reason = "cancelled"
	ReasonTimeout   Reason = "timeout"
	ReasonConnect   Reason = "connect"
	ReasonDNS       Reason = "dns"
	ReasonTLS       Reason = "tls"
	ReasonNetwork   Reason = "network"
	ReasonConfig    Reason = "config"
	ReasonResponse  Reason = "response"
)

func (r Reason) String() string {
	if r == "" {
		return ReasonUnknown.String()
	}
	return string(r)
}

func Classify(err error) (Reason, string) {
	if err == nil {
		return ReasonUnknown, ""
	}

	switch {
	case errors.Is(err, context.Canceled):
		return ReasonCancelled, ""
	case errors.Is(err, context.DeadlineExceeded) || errors.Is(err, os.ErrDeadlineExceeded):
		return ReasonTimeout, ""
	}

	var uerr *url.Error
	if errors.As(err, &uerr) {
		return Classify(uerr.Err)
	}

	var opErr *net.OpError
	if errors.As(err, &opErr) {
		var dnse *net.DNSError
		if errors.As(opErr, &dnse) {
			return ReasonDNS, dnse.Err
		}

		switch opErr.Op {
		case "dial":
			return ReasonConnect, opErr.Err.Error()
		case "read", "accept", "write":
			return ReasonNetwork, opErr.Err.Error()
		}
	}

	var tlsErr *tls.CertificateVerificationError
	if errors.As(err, &tlsErr) {
		return ReasonTLS, tlsErr.Unwrap().Error()
	}

	var ne net.Error
	if errors.As(err, &ne) {
		if ne.Timeout() {
			return ReasonTimeout, ""
		}
		return ReasonNetwork, ne.Error()
	}

	return ReasonUnknown, ""
}
