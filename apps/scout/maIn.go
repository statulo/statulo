package main

import (
	"github.com/statulo/scout/cmd/scout"
)

func main() {
	scout.Execute()
}

// TODO Exponential backof polishing
// TODO Graceful shutdown during retrying requests currently hangs completely
