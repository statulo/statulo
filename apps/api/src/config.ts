import { zodCoercedBoolean, createConfig, loaders } from "@neato/config";
import type { PartialDeep } from "type-fest";
import { z } from "zod";

const schema = z.object({
  server: z
    .object({
      port: z.coerce.number().default(8080),
      cors: z.string().default(""),
      basePath: z.string().default("/"),
      backendBaseUrl: z.string().url().endsWith("/"),
      frontendBaseUrl: z.string().url().endsWith("/"),
    }),
  logging: z
    .object({
      format: z.enum(["json", "pretty"]).default("pretty"),
      debug: zodCoercedBoolean().default(false),
      silenceNoisyLogs: zodCoercedBoolean().default(false),
    })
    .default({}),
  crypto: z.object({
    secret: z.string().min(32),
  }),
  db: z.object({
    connection: z.string(),
    ssl: zodCoercedBoolean().default(false),
  }),
  mailer: z
    .discriminatedUnion("enabled", [
      z.object({
        enabled: z.literal("false"),
      }),
      z.object({
        enabled: z.literal("true"),
        smtpHost: z.string().min(1),
        smtpPort: z.coerce.number().positive(),
        secure: zodCoercedBoolean().default(false),
        smtpUser: z.string().min(1).optional(),
        smtpPassword: z.string().min(1).optional(),
        from: z.string().min(1).optional(),
      }),
    ])
    .default({ enabled: "false" }),
});

export const presets: Record<string, PartialDeep<z.infer<typeof schema>>> = {
  docker: {
    server: {
      cors: "http://localhost:3000",
      frontendBaseUrl: "http://localhost:3000/",
      backendBaseUrl: "http://localhost:8080/",
    },
    db: {
      connection: "postgres://postgres:postgres@localhost:5432/postgres",
    },
    crypto: {
      secret: "12345678901234567890123456789012",
    },
    mailer: {
      enabled: "true",
      smtpHost: "localhost",
      smtpPort: 1025,
      secure: false,
      from: "Statulo <no-reply@example.com>",
    },
  },
};

// TODO get version not from env but from package.json file
export const version = process.env.npm_package_version ?? "unknown";

export const conf = createConfig({
  envPrefix: "STL_",
  loaders: [
    loaders.environment(),
    loaders.file(".env"),
  ],
  presetKey: "usePresets",
  presets,
  schema,
});
