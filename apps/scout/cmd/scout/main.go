package scout

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
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
			fmt.Println(err) // TODO pretty errors
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
		fmt.Println(err)
		os.Exit(1)
	}
}
