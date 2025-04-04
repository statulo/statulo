import type { PopulatedSession } from '@/utils/auth/session';
import { fetchSessionAndUpdateExpiry } from '@/utils/auth/session';
import { parseAuthorizationToken, parseAuthToken } from '@/utils/auth/tokens';
import { ApiError } from '@/utils/error';
import { checkPermission } from '@/utils/permissions/check';
import type { Permission } from '@/utils/permissions/permission-builder';
import { getPermissions } from '@/utils/permissions/resolve-roles';
import type { FastifyRequest } from 'fastify';

export type AuthType = 'session';

export interface AuthChecks {
  isAuthenticated: () => boolean;
  isAuthType: (type: AuthType) => boolean;
  isUser: (userId: string) => boolean;
  can: (perm: Permission) => boolean;
}

export interface AuthContext {
  check: (cb: (checks: AuthChecks) => boolean) => void;
  can: (perm: Permission) => void;
  checkers: AuthChecks;
  data: {
    getSession: () => PopulatedSession;
    getUserId: () => string;
    getUserIdOrDefault: () => string | null;
  };
}

export interface AuthContextData {
  session?: PopulatedSession;
  type?: AuthType;
}

export async function fetchAuthContextData(
  req: FastifyRequest,
): Promise<AuthContextData> {
  const jwt = parseAuthorizationToken(req);
  if (!jwt) return {};
  const payload = parseAuthToken(jwt);
  if (!payload) throw ApiError.forCode('authInvalidToken', 401);
  if (payload?.t === 'session') {
    const session = await fetchSessionAndUpdateExpiry(payload.id);
    if (session) {
      return {
        session,
        type: 'session',
      };
    }
  }
  return {};
}

function makeAuthCheckers(data: AuthContextData): AuthChecks {
  const userId = data.session?.userId;
  const perms = getPermissions({
    user: data.session?.user,
  });

  return {
    isAuthenticated() {
      return data.type !== null;
    },
    isAuthType(type) {
      return data.type === type;
    },
    isUser(checkedUserId) {
      return userId === checkedUserId;
    },
    can(perm) {
      const hasPerm = perms.some(userPerm =>
        checkPermission(perm, userPerm),
      );
      return hasPerm;
    },
  };
}

export async function makeAuthContext(
  req: FastifyRequest,
): Promise<AuthContext> {
  const data = await fetchAuthContextData(req);
  const checkers = makeAuthCheckers(data);

  return {
    check(cb) {
      const result = cb(checkers);
      if (!result) throw ApiError.forCode('authMissingPermissions', 403);
    },
    can(perm) {
      const result = checkers.can(perm);
      if (!result) throw ApiError.forCode('authMissingPermissions', 403);
    },
    checkers,
    data: {
      getSession() {
        if (!data.session) throw new Error('Session not set but is requested');
        return data.session;
      },
      getUserId() {
        return this.getSession().userId;
      },
      getUserIdOrDefault() {
        if (!data.session) return null;
        return data.session.userId;
      },
    },
  };
}
