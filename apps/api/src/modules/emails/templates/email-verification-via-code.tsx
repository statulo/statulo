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
    </EmailContainer>
  );
}

EmailVerificationCodeEmail.PreviewProps = {
  verificationCode: '42069',
} satisfies EmailVerificationCodeEmailProps;

export const emailVerificationCodeEmail = makeEmailRenderer({
  template: EmailVerificationCodeEmail,
  subject() {
    return `Please verify your email for Statulo`;
  },
});
