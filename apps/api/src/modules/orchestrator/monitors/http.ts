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
    const o = oldMonitor.http;
    const n = newMonitor.http;
    if (!o || !n) throw new Error("Monitors are not HTTP monitors");
    let isDiff = false;
    if (JSON.stringify(o.allowedStatusCodes) !== JSON.stringify(n.allowedStatusCodes))
      isDiff = true;
    if (JSON.stringify(o.expectedKeywords) !== JSON.stringify(n.expectedKeywords))
      isDiff = true;
    if (o.url !== n.url)
      isDiff = true;
    if (JSON.stringify(o.interval) !== JSON.stringify(n.interval))
      isDiff = true;
    return {
      removed: [],
      updatedOrNew: isDiff ? [buildHttpCheck(n)] : [],
    };
  },
};
