import type { FullCheckAssignment } from "@/modules/orchestrator/active-agents";
import type { HttpCheckBodyV1 } from "@/modules/orchestrator/checks/http";
import { maxDate, minDate } from "@/utils/date";

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
  monitorId: string;
  interval: number;
  startAt: string;
  endAt: string | null;
} & OrchestratorCheckTypesDto;

export type OrchestratorCheckTypesDto = {
  type: "http";
  version: 1;
  body: HttpCheckBodyV1;
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

export function mapOrchestratorCheckReport(): { success: boolean } {
  return {
    success: true,
  };
}

export function mapCheck(checkAssignment: FullCheckAssignment): OrchestratorCheckDto {
  const startAt = maxDate(checkAssignment.startAt, checkAssignment.check.startAt);
  const endAt = minDate(checkAssignment.check.endAt, checkAssignment.endAt);

  return {
    id: checkAssignment.checkId,
    interval: checkAssignment.check.interval,
    monitorId: checkAssignment.check.monitorId,
    startAt: startAt.toISOString(),
    endAt: endAt?.toISOString() ?? null,
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
