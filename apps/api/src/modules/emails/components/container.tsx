import { Body, Container, Head, Html, Preview } from '@react-email/components';
import type { ReactNode } from 'react';

const bodyStyles = {
  backgroundColor: '#ffffff',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const styles = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '560px',
};

export function EmailContainer(props: {
  children?: ReactNode;
  preview: string;
}) {
  return (
    <Html>
      <Head />
      <Preview>{props.preview}</Preview>
      <Body style={bodyStyles}>
        <Container style={styles}>{props.children}</Container>
      </Body>
    </Html>
  );
}
