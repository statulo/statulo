import { z } from "zod";
import { handle } from "@/utils/handle";
import { makeRouter } from "@/utils/router";
import { orchestrator } from "@/modules/orchestrator";
import { permissions } from "@/utils/permissions/permissions";
import { mapOrchestratorChecks, mapOrchestratorGoodbye, mapOrchestratorHeartbeat, mapOrchestratorHello } from "@/routes/v1/mappings/orchestrator";

export const orchestratorRouter = makeRouter((app) => {
  app.post(
    "/api/v1/orchestrator/agents/hello",
    {
      schema: {
        description: "Onboard a new running agent",
        body: z.object({
          version: z.string().min(1),
        }),
      },
    },
    handle(async ({ auth }) => {
      auth.check(c => c.isAuthType("agent-registration"));
      auth.can(permissions.activeAgent.internal.register({}));

      await orchestrator.agents.register(auth.data.getAgentRegistrationId());

      // TODO return new active agent
      return mapOrchestratorHello({
        agentId: "123",
        token: "xyz",
        heartbeat: 10,
        checks: [],
        pubsub: null,
      });
    }),
  );

  app.get(
    "/api/v1/orchestrator/agents/heartbeat",
    {
      schema: {
        description: "Single heartbeat for an agent",
      },
    },
    handle(async ({ auth }) => {
      auth.check(c => c.isAuthType("active-agent"));
      const agentId = auth.data.getActiveAgentId();
      auth.can(permissions.activeAgent.internal.manage({ id: agentId }));

      await orchestrator.agents.refresh(agentId);

      // TODO hash the real checks
      return mapOrchestratorHeartbeat(orchestrator.checks.hash([]));
    }),
  );

  app.post(
    "/api/v1/orchestrator/agents/goodbye",
    {
      schema: {
        description: "Offboard a running agent",
      },
    },
    handle(async ({ auth }) => {
      auth.check(c => c.isAuthType("active-agent"));
      const agentId = auth.data.getActiveAgentId();
      auth.can(permissions.activeAgent.internal.manage({ id: agentId }));

      await orchestrator.agents.remove(agentId);

      // TODO add offboarding schedule
      return mapOrchestratorGoodbye();
    }),
  );

  app.get(
    "/api/v1/orchestrator/agents/checks",
    {
      schema: {
        description: "Get checks for an agent",
      },
    },
    handle(async ({ auth }) => {
      auth.check(c => c.isAuthType("active-agent"));
      const agentId = auth.data.getActiveAgentId();
      auth.can(permissions.activeAgent.internal.manage({ id: agentId }));

      // TODO get real checks
      return mapOrchestratorChecks([]);
    }),
  );
});
