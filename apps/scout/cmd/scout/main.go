package scout

import (
	"os"

	"github.com/spf13/cobra"
	l "github.com/statulo/scout/internal/logger"
)

var versionCmd = &cobra.Command{
	Use:   "version",
	Short: "Displays the version of Scout",
	Run: func(cmd *cobra.Command, args []string) {
		root := cmd.Root()
		root.SetArgs([]string{"--version"})
		root.Execute()
	},
}

var rootCmd = &cobra.Command{
	Use:     "scout",
	Short:   "The agent that runs checks for Statulo",
	Version: Version,
	Run: func(cmd *cobra.Command, args []string) {
		err := validateConfig()
		if err != nil {
			l.GetTempLogger().Errorf("Failed to validate configuration: %s", err)
			os.Exit(1)
		}

		startScout()
	},
}

func Execute() {
	cobra.OnInitialize(loadConfig)
	configureConfigFlags()
	rootCmd.AddCommand(versionCmd)

	err := rootCmd.Execute()
	if err != nil {
		l.GetTempLogger().Errorf("Failed to execute command: %s", err)
		os.Exit(1)
	}
}
