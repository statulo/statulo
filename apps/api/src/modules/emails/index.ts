import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';
import { conf } from '@/config';
import { logger } from '../log';

const log = logger.child({ svc: 'mailer' });
let transporter: Transporter | null = null;

export function setupMailer() {
  if (conf.mailer.enabled === 'false') {
    log.warn('Mailer is disabled, no emails will be sent');
    return;
  }

  transporter = createTransport({
    host: conf.mailer.smtpHost,
    port: conf.mailer.smtpPort,
    secure: conf.mailer.secure,
    from: conf.mailer.from,
    auth: conf.mailer.smtpUser
      ? {
          user: conf.mailer.smtpUser,
          pass: conf.mailer.smtpPassword ?? undefined,
        }
      : undefined,
  });
  log.info('Mailer enabled');
}

export function getMailer() {
  return transporter;
}
