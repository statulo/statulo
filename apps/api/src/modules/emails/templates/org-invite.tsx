import { makeEmailRenderer } from '../builder';
import { EmailContainer } from '../components/container';
import { Txt } from '../components/text';

interface OrgInviteEmailProps {
  org: {
    name: string;
  }
  inviteLink: string;
}

export default function OrgInviteEmail(props: OrgInviteEmailProps) {
  return (
    <EmailContainer preview={`You have been invited to ${props.org.name}`}>
      <Txt.Heading>You have been invited to {props.org.name}</Txt.Heading>
      <Txt.Paragraph>
        Click the link below to accept the invitation:
      </Txt.Paragraph>
      <Txt.Paragraph>{props.inviteLink}</Txt.Paragraph>
    </EmailContainer>
  );
}

OrgInviteEmail.PreviewProps = {
  org: {
    name: 'Totally Legit'
  },
  inviteLink: 'https://example.com',
} satisfies OrgInviteEmailProps;

export const orgInviteEmail = makeEmailRenderer({
  template: OrgInviteEmail,
  subject(props) {
    return `You have been invited to ${props.org.name}`;
  },
});
