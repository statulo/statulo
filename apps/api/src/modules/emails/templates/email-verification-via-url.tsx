import { makeEmailRenderer } from '../builder';
import { EmailContainer } from '../components/container';
import { Txt } from '../components/text';

interface EmailVerificationUrlEmailProps {
  inviteLink: string;
}

export default function EmailVerificationUrlEmail(props: EmailVerificationUrlEmailProps) {
  return (
    <EmailContainer preview={`Please verify your Statulo email`}>
      <Txt.Heading>Please verify your Statulo email</Txt.Heading>
      <Txt.Paragraph>
        Click the link below to verify your email address:
      </Txt.Paragraph>
      <Txt.Paragraph>{props.inviteLink}</Txt.Paragraph>
    </EmailContainer>
  );
}

EmailVerificationUrlEmail.PreviewProps = {
  inviteLink: 'https://example.com',
} satisfies EmailVerificationUrlEmailProps;

export const emailVerificationUrlEmail = makeEmailRenderer({
  template: EmailVerificationUrlEmail,
  subject() {
    return `Please verify your Statulo email`;
  },
});
