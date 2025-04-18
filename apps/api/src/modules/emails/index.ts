import type { Transporter } from "nodemailer";
import { createTransport } from "nodemailer";
import { logger } from "../log";
import { conf } from "@/config";

const log = logger.child({ svc: "mailer" });
let transporter: Transporter | null = null;

export function setupMailer() {
  if (conf.mailer.enabled === "false") {
    log.warn("Mailer is disabled, no emails will be sent");
    return;
  }

  transporter = createTransport({
    host: conf.mailer.smtpHost,
    port: conf.mailer.smtpPort,
    secure: conf.mailer.secure,
    auth: conf.mailer.smtpUser
      ? {
          user: conf.mailer.smtpUser,
          pass: conf.mailer.smtpPassword ?? undefined,
        }
      : undefined,
  }, {
    from: conf.mailer.from,
  });
  log.info("Mailer enabled");
}

export function getMailer() {
  return transporter;
}
