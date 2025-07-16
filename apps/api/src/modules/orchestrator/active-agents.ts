export async function registerActiveAgent(_agentRegistrationId: string): Promise<void> {
  // create new active agent in db
}

export async function refreshActiveAgent(_id: string): Promise<void> {
  // update lastSeenAt field of agent
}

export async function removeActiveAgent(_id: string): Promise<void> {
  // delete active agent from db
}

export async function removeStaleActiveAgents(): Promise<void> {
  // 2 heartbeat failures makes the active agents as stale
  // this should log
}
