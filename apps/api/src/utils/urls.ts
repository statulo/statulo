import { conf } from '@/config';

const frontendBase = (path: string) => new URL(conf.server.frontendBaseUrl + path);

export function makePasswordResetUrl(token: string) {
  const url = frontendBase('auth/reset-password');
  url.searchParams.append('token', token);
  return url.toString();
}
