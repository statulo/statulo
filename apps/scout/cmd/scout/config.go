package scout

import (
	"fmt"
	"net"
	"net/url"
	"strconv"

	"github.com/joho/godotenv"
	"github.com/spf13/viper"
	l "github.com/statulo/scout/internal/logger"
)

var conf Config

const Version string = "1.0.0"

type Config struct {
	LogFormat       string `mapstructure:"logFormat"`
	ShouldDebug     bool   `mapstructure:"debug"`
	OrchestratorUrl string `mapstructure:"url"`
	MetricsUrl      string `mapstructure:"metricsUrl"`
	Token           string `mapstructure:"token"`
}

func configureConfigFlags() {
	rootCmd.PersistentFlags().BoolP("version", "v", false, "Display the version of Scout")
	rootCmd.PersistentFlags().String("url", "https://api.example.com", "Url of the statulo server")
	rootCmd.PersistentFlags().String("metrics", "", "Metrics endpoint as `IP:PORT`")
	rootCmd.PersistentFlags().String("log", string(l.Text), "Log output format")
	rootCmd.PersistentFlags().Bool("debug", false, "Log debug messages")
	rootCmd.PersistentFlags().String("token", "", "Agent registration token")
}

func loadConfig() {
	_ = godotenv.Load() // Not being able to load .env is fine, just ignore error

	confErr(viper.BindEnv("url", "SCOUT_URL"))
	confErr(viper.BindEnv("metricsUrl", "SCOUT_METRICS_URL"))
	confErr(viper.BindEnv("logFormat", "SCOUT_LOG_FORMAT"))
	confErr(viper.BindEnv("debug", "SCOUT_DEBUG"))
	confErr(viper.BindEnv("token", "SCOUT_TOKEN"))

	confErr(viper.BindPFlag("url", rootCmd.PersistentFlags().Lookup("url")))
	confErr(viper.BindPFlag("metricsUrl", rootCmd.PersistentFlags().Lookup("metrics")))
	confErr(viper.BindPFlag("logFormat", rootCmd.PersistentFlags().Lookup("log")))
	confErr(viper.BindPFlag("debug", rootCmd.PersistentFlags().Lookup("debug")))
	confErr(viper.BindPFlag("token", rootCmd.PersistentFlags().Lookup("token")))

	confErr(viper.Unmarshal(&conf))
}

func validateConfig() error {
	format := l.GetLogFormat(conf.LogFormat)
	if format == l.Invalid {
		return fmt.Errorf("invalid log format: %s", conf.LogFormat)
	}

	if conf.Token == "" {
		return fmt.Errorf("missing token, cannot start without an agent token")
	}

	u, err := url.ParseRequestURI(conf.OrchestratorUrl)
	if err != nil {
		return fmt.Errorf("invalid URL, URL cannot be parsed")
	}
	if (u.Scheme != "http" && u.Scheme != "https") || u.Host == "" {
		return fmt.Errorf("invalid URL, URL has invalid Host or Scheme")
	}

	if conf.MetricsUrl != "" {
		host, port, err := net.SplitHostPort(conf.MetricsUrl)
		if err != nil {
			return fmt.Errorf("invalid metrics URL, must be in syntax 'IP:PORT'")
		}
		ip := net.ParseIP(host)
		if ip == nil {
			return fmt.Errorf("invalid metrics URL, not a valid IP")
		}
		p, err := strconv.Atoi(port)
		if err != nil || p < 1 || p > 65535 {
			return fmt.Errorf("invalid metrics URL, invalid port")
		}
	}

	return nil
}

func logConfigDebug() {
	l.Log.Debug("Loaded configuration:")
	l.Log.Debugf("- Url: %s", conf.OrchestratorUrl)
	if conf.MetricsUrl == "" {
		l.Log.Debugf("- Metrics: Off")
	} else {
		l.Log.Debugf("- Metrics: %s", conf.MetricsUrl)
	}
	l.Log.Debugf("- Token: %s", truncateString(conf.Token, 4))
}

func truncateString(str string, s int) string {
	if len(str) <= s {
		return str
	}
	return str[:s] + "***"
}

func confErr(err error) {
	if err != nil {
		l.GetTempLogger().Fatalf("Failed to load configuration: %s", err)
	}
}
