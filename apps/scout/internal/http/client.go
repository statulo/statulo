package http

type OrchestratorClient struct {
	UserAgentName string
	Version       string
	BaseUrl       string
	Token         string
}

func (c *OrchestratorClient) SetToken(token string) {
	c.Token = token
}
