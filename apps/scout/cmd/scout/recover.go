package scout

import (
	"context"
	"time"

	l "github.com/statulo/scout/internal/logger"
)

func RunWithRecovery(name string, ctx context.Context, fun func()) {
	go func() {
		for { // Restart automatically
			func() {
				defer func() {
					if r := recover(); r != nil {
						l.Log.Errorf("Panic recovered in %s, restarting component: %v", name, r)
					}
				}()
				fun()
			}()
			select {
			case <-time.After(1 * time.Second):
			case <-ctx.Done():
				return
			}
		}
	}()
}
