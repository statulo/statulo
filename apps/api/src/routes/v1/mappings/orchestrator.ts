import type { FullCheckAssignment } from "@/modules/orchestrator/active-agents";
import type { HttpCheckBody } from "@/modules/orchestrator/checks/http";

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

export type OrchestratorCheckDto = OrchestratorCheckTypesDto & {
  id: string;
  monitorId: string;
  interval: number;
};

export type OrchestratorCheckTypesDto = {
  type: "http";
  version: 1;
  body: HttpCheckBody;
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
    interval: checkAssignment.check.interval,
    monitorId: checkAssignment.check.monitorId,
    version: checkAssignment.check.version as OrchestratorCheckTypesDto["version"],
    type: checkAssignment.check.type as OrchestratorCheckTypesDto["type"],
    body: checkAssignment.check.body as OrchestratorCheckTypesDto["body"],
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
