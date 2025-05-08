import { pino } from "pino";
import pretty from "pino-pretty";
import figlet from "figlet";
import { conf } from "@/config";

const prettyStream =
  conf.logging.format === "pretty"
    ? pretty({
        colorize: true,
        translateTime: true,
        ignore: "pid,hostname,reqId,response,svc,type",
        messageFormat: (log, messageKey, _, { colors }) => {
          let message = String(log[messageKey]);
          // If a service name is provided, prepend it to the message
          if (log.svc) message = `[${log.svc}] ${message}`;

          // If a response is present, format it
          if (log.response) {
            const res = log.response as any;
            // Colour error status codes red, success codes green
            const statusCode = res.statusCode >= 400 ? colors.red(res.statusCode) : colors.green(res.statusCode);

            // Colour elapsed time based on thresholds, green for < 500ms, yellow for 500ms-1s, red for > 1s
            const elapsedTime = res.elapsedTime >= 1000
              ? colors.red(res.elapsedTime + "ms")
              : res.elapsedTime >= 500
                ? colors.yellow(res.elapsedTime + "ms")
                : colors.green(res.elapsedTime + "ms");

            const responseSection = ` [${colors.white(res.method + " " + res.url)} - ${statusCode} - ${elapsedTime}]`;
            message += responseSection;
          }
          return `${message}`;
        },
      })
    : undefined;

const loggerInstance = pino(
  {
    level: conf.logging.debug ? "debug" : "info",
  },
  prettyStream,
);

export function logIntro(withDivide = false) {
  if (conf.logging.format === "pretty")
    console.log(figlet.textSync("Statulo", { font: "Small" }));
  if (withDivide)
    logDivide();
}

export function logDivide() {
  if (conf.logging.format === "pretty")
    loggerInstance.info(`--------------------------------------`);
}

export const logger = loggerInstance;
