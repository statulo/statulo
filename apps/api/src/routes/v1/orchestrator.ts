import { z } from "zod";
import { handle } from "@/utils/handle";
import { makeRouter } from "@/utils/router";

// TODO this entire file is temporary, endpoints are not implemented properly

function hashChecks(_checks: any[]): string {
  return "abcdef";
}

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
    handle(async () => {
      return {
        agentId: "123",
        token: "xyz",
        heartbeat: 42,
        checks: [],
        pubsub: null,
      };
    }),
  );

  app.get(
    "/api/v1/orchestrator/agents/heartbeat",
    {
      schema: {
        description: "Single heartbeat for an agent",
      },
    },
    handle(async () => {
      return {
        checkHash: hashChecks([]),
      };
    }),
  );

  app.post(
    "/api/v1/orchestrator/agents/goodbye",
    {
      schema: {
        description: "Offboard a running agent",
      },
    },
    handle(async () => {
      return {};
    }),
  );
});
