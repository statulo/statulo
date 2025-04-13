import { makeEmailRenderer } from '../builder';
import { EmailContainer } from '../components/container';
import { Txt } from '../components/text';

interface EmailVerificationCodeEmailProps {
  verificationCode: string;
}

export default function EmailVerificationCodeEmail(props: EmailVerificationCodeEmailProps) {
  return (
    <EmailContainer preview={`Your code for verifying your Statulo email`}>
      <Txt.Heading>Your code for verifying your Statulo email</Txt.Heading>
      <Txt.Paragraph>
        Use the code below to verify your email address:
      </Txt.Paragraph>
      <Txt.Paragraph>{props.verificationCode}</Txt.Paragraph>
      <Txt.Paragraph>
        This code will expire in 5 minutes.
      </Txt.Paragraph>
      <Txt.Paragraph>
        If you didn't request this verification code, please ignore this email.
      </Txt.Paragraph>
    </EmailContainer>
  );
}

EmailVerificationCodeEmail.PreviewProps = {
  verificationCode: '042069',
} satisfies EmailVerificationCodeEmailProps;

export const emailVerificationCodeEmail = makeEmailRenderer({
  template: EmailVerificationCodeEmail,
  subject() {
    return `Please verify your email for Statulo`;
  },
});
