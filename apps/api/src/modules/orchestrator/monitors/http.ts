import _ from "lodash";
import type { HttpMonitor } from "@prisma/client";
import type { MonitorConverter } from "@/modules/orchestrator/monitors/types";
import { buildHttpCheck } from "@/modules/orchestrator/checks/http";

export const httpMonitorConverter: MonitorConverter = {
  type: "http",
  toChecks(monitor) {
    const m = monitor.http;
    if (!m) throw new Error("Monitor is not a HTTP monitor");
    return [buildHttpCheck(m)];
  },
  toUpdatedChecks(oldMonitor, newMonitor) {
    const fieldsToCheck: (keyof HttpMonitor)[] = [
      "expectedKeywords",
      "interval",
      "url",
    ];
    if (!oldMonitor.http || !newMonitor.http) throw new Error("Monitors are not HTTP monitors");
    const oldObj = _.pick(oldMonitor.http, fieldsToCheck);
    const newObj = _.pick(newMonitor.http, fieldsToCheck);
    const isEqual = _.isEqual(oldObj, newObj);
    return {
      removed: [],
      updatedOrNew: isEqual ? [] : [buildHttpCheck(newMonitor.http)],
    };
  },
};
