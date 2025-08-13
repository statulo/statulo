package scout

import (
	"fmt"

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
	// TODO handle errors in this method
	_ = godotenv.Load()

	_ = viper.BindEnv("url", "SCOUT_URL")
	_ = viper.BindEnv("metricsUrl", "SCOUT_METRICS_URL")
	_ = viper.BindEnv("logFormat", "SCOUT_LOG_FORMAT")
	_ = viper.BindEnv("debug", "SCOUT_DEBUG")
	_ = viper.BindEnv("token", "SCOUT_TOKEN")

	_ = viper.BindPFlag("url", rootCmd.PersistentFlags().Lookup("url"))
	_ = viper.BindPFlag("metricsUrl", rootCmd.PersistentFlags().Lookup("metrics"))
	_ = viper.BindPFlag("logFormat", rootCmd.PersistentFlags().Lookup("log"))
	_ = viper.BindPFlag("debug", rootCmd.PersistentFlags().Lookup("debug"))
	_ = viper.BindPFlag("token", rootCmd.PersistentFlags().Lookup("token"))

	_ = viper.Unmarshal(&conf)
}

func validateConfig() error {
	format := l.GetLogFormat(conf.LogFormat)
	if format == l.Invalid {
		return fmt.Errorf("invalid log format: %s", conf.LogFormat)
	}

	if conf.Token == "" {
		return fmt.Errorf("missing token, cannot start without an agent token")
	}

	// TODO validate metrics URL
	// TODO validate orchestrator URL

	return nil
}

func logConfig(conf Config) {
	l.Log.Infof("Configuration loaded, connecting to %s", conf.OrchestratorUrl)
}
