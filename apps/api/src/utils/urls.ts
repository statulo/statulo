import type { OrgInvite, User } from "@prisma/client";
import { conf } from "@/config";
import { makeAuthToken } from "@/utils/auth/tokens";

const frontendBase = (path: string) => new URL(conf.server.frontendBaseUrl + path);

export function makePasswordResetUrl(token: string) {
  const url = frontendBase("password/reset");
  url.searchParams.append("token", token);
  return url.toString();
}

export function makeInvitationUrl(invite: OrgInvite) {
  const url = frontendBase("invite/accept");
  const token = makeAuthToken({
    t: "invite",
    code: invite.code,
  });
  url.searchParams.append("token", token);
  return url.toString();
}

export function makeEmailVerificationUrl(user: User) {
  const url = frontendBase("user/verify");
  const token = makeAuthToken({
    t: "emailverify",
    uid: user.id,
    stamp: user.securityStamp,
  });
  url.searchParams.append("token", token);
  return url.toString();
}
