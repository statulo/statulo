import { makeEmailRenderer } from '../builder';
import { EmailContainer } from '../components/container';
import { Txt } from '../components/text';

interface ResetPasswordEmailProps {
  resetLink: string;
}

export default function ResetPasswordEmail(props: ResetPasswordEmailProps) {
  return (
    <EmailContainer preview="Reset password for Statulo">
      <Txt.Heading>Password reset requested for Sstatulo</Txt.Heading>
      <Txt.Paragraph>
        This link and code will only be valid for the next 5 minutes. If the
        link does not work, you can use the login verification code directly:
      </Txt.Paragraph>
      <Txt.Paragraph>{props.resetLink}</Txt.Paragraph>
    </EmailContainer>
  );
}

ResetPasswordEmail.PreviewProps = {
  resetLink: 'https://example.com',
} satisfies ResetPasswordEmailProps;

export const resetPasswordEmail = makeEmailRenderer({
  template: ResetPasswordEmail,
  subject() {
    return 'Password reset requested for Statulo';
  },
});
