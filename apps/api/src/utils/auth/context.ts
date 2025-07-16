import type { FastifyRequest } from "fastify";
import type { PopulatedSession } from "@/utils/auth/session";
import { fetchSessionAndUpdateExpiry } from "@/utils/auth/session";
import { parseAuthorizationToken, parseAuthToken } from "@/utils/auth/tokens";
import { ApiError, NotFoundError } from "@/utils/error";
import { checkPermission } from "@/utils/permissions/check";
import type { Permission } from "@/utils/permissions/permission-builder";
import { getPermissions } from "@/utils/permissions/resolve-roles";

export type AuthType = "session" | "agent-registration" | "active-agent";

export interface AuthChecks {
  isAuthenticated: () => boolean;
  isAuthType: (type: AuthType) => boolean;
  isUser: (userId: string) => boolean;
  isEmailVerified: () => boolean;
  can: (perm: Permission) => boolean;
}

export interface AuthContext {
  check: (cb: (checks: AuthChecks) => boolean) => void;
  can: (perm: Permission) => void;
  /**
   * For endpoints that reference a specific resource (DELETE, PATCH, GET on id, etc) we can to return 404 instead of 403.
   * Returning 404 for both non-existent and unauthorized resources prevents probing (i.e., attempts to infer valid entities by comparing 403 vs 404 responses).
  */
  can404: (perm: Permission) => void;
  checkAuthentication: () => void;
  checkEmailVerified: () => void;
  checkers: AuthChecks;
  data: {
    getSession: () => PopulatedSession;
    getUser: () => PopulatedSession["user"];
    getUserId: () => string;
    getUserIdOrDefault: () => string | null;
    getAgentRegistrationId: () => string;
    getActiveAgentId: () => string;
  };
}

export interface AuthContextData {
  session?: PopulatedSession;
  agentRegistration?: { id: string };
  activeAgent?: { id: string };
  type?: AuthType;
}

export async function fetchAuthContextData(
  req: FastifyRequest,
): Promise<AuthContextData> {
  const jwt = parseAuthorizationToken(req);
  if (!jwt) return {};
  const payload = parseAuthToken(jwt);
  if (!payload) throw ApiError.forCode("authInvalidToken", 401);

  if (payload.t === "session") {
    const session = await fetchSessionAndUpdateExpiry(payload.id);
    if (session) {
      return {
        session,
        type: "session",
      };
    }
  }

  if (payload.t === "agentreg") {
    return {
      agentRegistration: {
        id: payload.id,
      },
      type: "agent-registration",
    };
  }

  if (payload.t === "activeagent") {
    return {
      activeAgent: {
        id: payload.id,
      },
      type: "agent-registration",
    };
  }

  return {};
}

function makeAuthCheckers(data: AuthContextData): AuthChecks {
  const user = data.session?.user;
  const perms = getPermissions({
    user: data.session?.user,
  });

  return {
    isAuthenticated() {
      return data.type != null;
    },
    isAuthType(type) {
      return data.type === type;
    },
    isUser(checkedUserId) {
      if (user == null) return false;
      return user.id === checkedUserId;
    },
    isEmailVerified() {
      if (user == null) return false;
      return user.emailVerified;
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
      if (!result) throw ApiError.forCode("authMissingPermissions", 403);
    },
    can(perm) {
      const result = checkers.can(perm);
      if (!result) throw ApiError.forCode("authMissingPermissions", 403);
    },
    can404(perm) {
      const result = checkers.can(perm);
      if (!result) throw new NotFoundError();
    },
    checkAuthentication() {
      const result = checkers.isAuthenticated();
      if (!result) throw ApiError.forCode("requiresAuth", 401);
    },
    checkEmailVerified() {
      if (!checkers.isEmailVerified()) throw ApiError.forCode("authEmailNotVerified", 403);
    },
    checkers,
    data: {
      getSession() {
        if (!data.session) throw new Error("Session not set but is requested");
        return data.session;
      },
      getUser() {
        return this.getSession().user;
      },
      getUserId() {
        return this.getSession().userId;
      },
      getUserIdOrDefault() {
        if (!data.session) return null;
        return data.session.userId;
      },
      getAgentRegistrationId() {
        if (!data.agentRegistration) throw new Error("agentRegistration not set but is requested");
        return data.agentRegistration.id;
      },
      getActiveAgentId() {
        if (!data.activeAgent) throw new Error("activeAgent not set but is requested");
        return data.activeAgent.id;
      },
    },
  };
}
