package http

type OrchestratorClient struct {
	UserAgentName       string
	Version             string
	BaseUrl             string
	token               string
	invalidTokenChannel chan struct{}
}

func CreateClient(userAgentName string, version string, baseUrl string) OrchestratorClient {
	return OrchestratorClient{
		UserAgentName:       userAgentName,
		Version:             version,
		BaseUrl:             baseUrl,
		invalidTokenChannel: make(chan struct{}),
	}
}

func (c *OrchestratorClient) SetToken(token string) {
	c.token = token
}

func (c *OrchestratorClient) WaitTokenInvalidated() chan struct{} {
	return c.invalidTokenChannel
}
