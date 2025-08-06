import { makeAuthToken } from "@/utils/auth/tokens";

export function createActiveAgentToken(id: string): string {
  return makeAuthToken({
    t: "activeagent",
    id,
  });
}

export function createRegistrationToken(id: string): string {
  return makeAuthToken({
    t: "agentreg",
    id,
  });
}
