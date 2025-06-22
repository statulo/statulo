import type { TokenTypes } from "./enums";
import type { ExpandedUserResponse } from "./users";

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  email: string;
  password: string;
};

export type PasswordResetRequest = {
  email: string;
};

export type SubmitPasswordResetRequest = {
  token: string;
  newPassword: string;
};

export type TokenResponse = {
  type: TokenTypes;
  token: string;
};

export type LoginResponse = {
  user: ExpandedUserResponse;
  token: TokenResponse;
};

export function login(body: LoginRequest) {
  return httpRequest<LoginResponse>("post", "/api/auth/login", {
    body,
  });
}

export function logout() {
  return httpRequest<void>("post", "/api/auth/logout");
}

export function register(body: RegisterRequest) {
  return httpRequest<LoginResponse>("post", "/api/auth/register", {
    body,
  });
}

export function requestPasswordReset(body: PasswordResetRequest) {
  return httpRequest<void>("post", "/api/auth/password-reset", {
    body,
  });
}

export function submitPasswordReset(body: SubmitPasswordResetRequest) {
  return httpRequest<LoginResponse>("post", "/api/auth/password-reset/submit", {
    body,
  });
}
