package scheduler

import (
	"time"

	"github.com/statulo/scout/internal/http"
	l "github.com/statulo/scout/internal/logger"
)

type ParsedCheckDates struct {
	StartAtTime time.Time
	EndAtTime   *time.Time
	Check       http.CheckResponse
}

func (c *Scheduler) getNextTime() (time.Time, *http.CheckResponse) {
	var parsedDates []ParsedCheckDates = make([]ParsedCheckDates, 0)

	for _, c := range c.currentChecks {
		parsed := ParsedCheckDates{
			EndAtTime: nil,
			Check:     c,
		}
		startTime, err := time.Parse(time.RFC3339, c.StartAt)
		if err != nil {
			l.Log.Errorf("skipping after failing to parse date (%s): %s", c.StartAt, err)
			continue
		}
		parsed.StartAtTime = startTime

		if c.EndAt != nil {
			endTimeParsed, err := time.Parse(time.RFC3339, *c.EndAt)
			if err != nil {
				l.Log.Errorf("skipping after failing to parse date (%s): %s", *c.EndAt, err)
				continue
			}
			parsed.EndAtTime = &endTimeParsed
		}

		parsedDates = append(parsedDates, parsed)
	}

	var earliestCheck *http.CheckResponse = nil
	earliestTime := time.Time{}
	now := time.Now()
	for _, c := range parsedDates {
		if c.EndAtTime != nil && c.EndAtTime.Before(now) {
			// Check has already ended, skipping calculation
			continue
		}

		// TODO this is based on startAt, which means reassignments will change where the interval is based on
		// It should base it on monitor creation date (maybe)
		nowUnix := now.UnixMilli()
		startUnix := c.StartAtTime.UnixMilli()
		diffInMs := nowUnix - startUnix
		timesRan := diffInMs / int64(c.Check.Interval)

		// Get next start date: amount
		intervalDuration := time.Duration(c.Check.Interval) * time.Millisecond
		nextRun := c.StartAtTime.Add(intervalDuration * time.Duration(timesRan+1))

		// Only take the earliest time
		if earliestTime.IsZero() || nextRun.Before(earliestTime) {
			earliestCheck = &c.Check
			earliestTime = nextRun
		}
	}

	return earliestTime, earliestCheck
}

func (c *Scheduler) getNextCheckTimer() (*time.Timer, *http.CheckResponse) {
	nextTime, nextCheck := c.getNextTime()
	durationTilStartTime := time.Until(nextTime)
	timer := time.NewTimer(durationTilStartTime)
	if nextTime.IsZero() {
		timer.Stop() // Don't fire if there is no next time
	}

	return timer, nextCheck
}
