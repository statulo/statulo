import type { FullCheckAssignment } from "@/modules/orchestrator/active-agents";

export type OrchestratorHelloDto = {
  agentId: string;
  token: string;
  heartbeat: number; // in seconds
  checkHash: string;
  checks: OrchestratorCheckDto[];
  pubsub: {
    type: "nats";
    url: string;
  } | null;
};

export type OrchestratorCheckDto = {
  id: string;
  type: string;
  // TODO fill with real data
};

export type OrchestratorHeartbeatDto = {
  checkHash: string;
};

export type OrchestratorChecksDto = {
  checkHash: string;
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

export function mapCheck(checkAssignment: FullCheckAssignment): OrchestratorCheckDto {
  return {
    id: checkAssignment.checkId,
    type: checkAssignment.check.type,
  };
}

export function mapOrchestratorChecks(hash: string, checks: FullCheckAssignment[]): OrchestratorChecksDto {
  return {
    checkHash: hash,
    checks: checks.map(v => mapCheck(v)),
  };
}

export function mapOrchestratorGoodbye(): OrchestratorGoodbyeDto {
  return {};
}
