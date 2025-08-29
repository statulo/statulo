package metrics

import "github.com/prometheus/client_golang/prometheus"

var (
	ChecksExecuted = prometheus.NewCounter(prometheus.CounterOpts{
		Name: "scout_executed_checks_total",
		Help: "The total number of executed checks",
	})
)

func createRegistry() *prometheus.Registry {
	registry := prometheus.NewRegistry()

	registry.Register(ChecksExecuted)

	return registry
}
