import { conf } from '@/config';
import { makeAuthToken } from '@/utils/auth/tokens';
import type { OrgInvite } from '@prisma/client';

const frontendBase = (path: string) => new URL(conf.server.frontendBaseUrl + path);

export function makePasswordResetUrl(token: string) {
  const url = frontendBase('auth/reset-password');
  url.searchParams.append('token', token);
  return url.toString();
}

export function makeInvitationUrl(invite: OrgInvite) {
  const url = frontendBase('invite');
  const token = makeAuthToken({
    t: 'invite',
    code: invite.code,
  });
  url.searchParams.append('token', token);
  return url.toString();
}
