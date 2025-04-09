import { makeEmailRenderer } from '../builder';
import { EmailContainer } from '../components/container';
import { Txt } from '../components/text';

interface ResetPasswordEmailProps {
  resetLink: string;
}

export default function ResetPasswordEmail(props: ResetPasswordEmailProps) {
  return (
    <EmailContainer preview="Reset password for Statulo">
      <Txt.Heading>Password reset requested for Statulo</Txt.Heading>
      <Txt.Paragraph>
        Reset your password with the link below:
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
