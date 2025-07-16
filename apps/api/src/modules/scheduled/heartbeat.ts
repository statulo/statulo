import { runOnceWithLock } from "@/modules/db/locks";
import { orchestrator } from "@/modules/orchestrator";

export async function executeOrchestratorHeartbeat() {
  await runOnceWithLock("orchestratorHeartbeat", async () => {
    await orchestrator.agents.processStale();
  });
}
