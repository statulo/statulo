export type CheckDefinition = {
  type: string;
  version: number;
  monitorId: string;
  correlationId: string; // id that's unique per monitor and type of check, useful to find old versions of checks
  cost: number;
  interval: number;
  body: Record<string, any>;
};

export type Check = CheckDefinition & {
  id: string;
  startAt: Date;
  endAt?: Date;
};
