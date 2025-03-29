import { render } from '@react-email/render';
import type { ReactNode } from 'react';
import { getMailer } from './index';

export type EmailSenderOptions = {
  to: string;
};

export type RenderedEmail = {
  html: string;
  text: string;
  subject: string;
};

export type EmailSender<T extends Record<any, any>> = {
  render: (options: { props: T }) => Promise<RenderedEmail>;
  send: (options: { props: T } & EmailSenderOptions) => Promise<void>;
};

export function makeEmailRenderer<T extends Record<any, any>>(ops: {
  template: (props: T) => ReactNode;
  subject: (props: T) => string;
}): EmailSender<T> {
  async function renderEmail(options: { props: T }) {
    const Template = ops.template;
    const emailJsx = <Template {...options.props} />;
    const html = await render(emailJsx);
    const text = await render(emailJsx, { plainText: true });
    const subject = ops.subject(options.props);
    return {
      html,
      text,
      subject,
    };
  }

  return {
    render: renderEmail,
    async send(options) {
      const renderedEmail = await renderEmail({ props: options.props });
      const mailer = getMailer();
      if (!mailer) return;
      await mailer.sendMail({
        to: options.to,
        html: renderedEmail.html,
        text: renderedEmail.text,
        subject: renderedEmail.subject,
      });
    },
  };
}
