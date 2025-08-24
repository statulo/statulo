import { z } from "zod";
import { handle } from "@/utils/handle";
import { makeRouter } from "@/utils/router";
import { orchestrator } from "@/modules/orchestrator";
import { permissions } from "@/utils/permissions/permissions";
import { mapCheck, mapOrchestratorChecks, mapOrchestratorGoodbye, mapOrchestratorHeartbeat, mapOrchestratorHello } from "@/routes/v1/mappings/orchestrator";
import { ApiError } from "@/utils/error";

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

      const agent = await orchestrator.agents.register(auth.data.getAgentRegistrationId());
      const checks = await orchestrator.checks.get(agent.id);

      return mapOrchestratorHello({
        agentId: agent.id,
        token: orchestrator.tokens.create(agent.id),
        heartbeat: orchestrator.heartbeat.get(),
        checkHash: orchestrator.checks.hash(checks),
        checks: checks.map(v => mapCheck(v)),
        pubsub: null, // TODO add pubsub for verifications
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

      const success = await orchestrator.agents.refresh(agentId);
      if (!success) throw ApiError.forCode("authInvalidToken", 401); // token expired

      const checks = await orchestrator.checks.get(agentId);
      return mapOrchestratorHeartbeat(orchestrator.checks.hash(checks));
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

      const agent = await orchestrator.agents.get(agentId);
      if (!agent) throw ApiError.forCode("authInvalidToken", 401); // token expired

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

      const agent = await orchestrator.agents.get(agentId);
      if (!agent) throw ApiError.forCode("authInvalidToken", 401); // token expired

      const checks = await orchestrator.checks.get(agentId);
      return mapOrchestratorChecks(orchestrator.checks.hash(checks), checks);
    }),
  );
});
