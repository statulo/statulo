package metrics

import (
	"context"
	"fmt"
	"net"
	"net/http"
	"time"

	"github.com/prometheus/client_golang/prometheus/promhttp"
	l "github.com/statulo/scout/internal/logger"
)

type MetricsServer struct {
	srv *http.Server
}

func CreateMetricsServer() MetricsServer {
	return MetricsServer{
		srv: nil,
	}
}

func (m *MetricsServer) Start(bindAddr string) error {
	registry := createRegistry()

	mux := http.NewServeMux()
	mux.Handle("/metrics", promhttp.HandlerFor(registry, promhttp.HandlerOpts{}))
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "OK")
	})

	m.srv = &http.Server{
		Addr:    ":8080",
		Handler: mux,
	}

	l.Log.Debug("Initialized metrics server")

	ln, listenErr := net.Listen("tcp", bindAddr)
	if listenErr != nil {
		l.Log.Errorf("Failed to start metrics server: %s", listenErr)
		l.Log.Info("Skipping metrics server and resuming normal operation")
		return nil
	}

	l.Log.Infof("Metrics server listening on http://%s/metrics", bindAddr)

	err := m.srv.Serve(ln)
	if err != http.ErrServerClosed {
		l.Log.Errorf("Closing metrics server due to error: %s", err)
		return err
	}

	return nil
}

func (m *MetricsServer) Stop() {
	if m.srv == nil {
		return
	}

	l.Log.Debug("Stopping metrics server")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	m.srv.Shutdown(ctx)
}
