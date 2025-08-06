export type OrchestratorHelloDto = {
  agentId: string;
  token: string;
  heartbeat: number; // in seconds
  checks: OrchestratorCheckDto[];
  pubsub: {
    type: "nats";
    url: string;
  } | null;
};

export type OrchestratorCheckDto = {
  id: string;
  type: "http";
  url: string;
  intervalMs: number;
};

export type OrchestratorHeartbeatDto = {
  checkHash: string;
};

export type OrchestratorChecksDto = {
  checks: OrchestratorCheckDto[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type -- for the TODO
export type OrchestratorGoodbyeDto = {
  // TODO add offboarding schedule
};

export function mapOrchestratorHello(obj: OrchestratorHelloDto): OrchestratorHelloDto {
  return obj;
}

export function mapOrchestratorHeartbeat(hash: string): OrchestratorHeartbeatDto {
  return {
    checkHash: hash,
  };
}

export function mapOrchestratorChecks(checks: OrchestratorCheckDto[]): OrchestratorChecksDto {
  return {
    checks,
  };
}

export function mapOrchestratorGoodbye(): OrchestratorGoodbyeDto {
  return {};
}
