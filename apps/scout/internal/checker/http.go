package checker

import (
	"context"
	"errors"
	"time"

	"github.com/statulo/scout/internal/http"

	goHttp "net/http"
)

func (c *Checker) checkHTTP(check http.CheckResponse) error {
	if check.Type != "http" {
		return errors.New("invalid check type")
	}

	checkBody, err := UnmarshalHttpCheckBody(check.Version, check.Body)
	if err != nil {
		return err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second) // TODO: Make timeout configurable
	defer cancel()

	httpRequest, err := checkBody.BuildHttpRequest(ctx, c.client.GetScoutHeaders())
	if err != nil {
		return err
	}

	res, err := goHttp.DefaultClient.Do(httpRequest)
	if err != nil {
		return err
	}
	defer res.Body.Close()

	err = checkBody.ValidateResponse(res)
	if err != nil {
		return err
	}

	return nil
}
