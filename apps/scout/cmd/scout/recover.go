package scout

import (
	"context"
	"sync"
	"time"

	l "github.com/statulo/scout/internal/logger"
)

func RunWithRecovery(name string, ctx context.Context, wg *sync.WaitGroup, fun func()) {
	wg.Add(1)
	go func() {
		defer wg.Done()
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
