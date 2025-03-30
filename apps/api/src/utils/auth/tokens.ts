import jwtLib, { type SignOptions } from 'jsonwebtoken';
import type { FastifyRequest } from 'fastify';
import { conf } from '@/config';
import { logger } from '@/modules/log';
import { ApiError } from '../error';

const alg = 'HS256';

export type AuthToken = {
  t: 'session';
  id: string;
} | {
  t: 'passreset';
  stamp: string;
  uid: string;
};

export function parseAuthToken(input: string): null | AuthToken {
  try {
    const jwt = jwtLib.verify(input, conf.crypto.secret, {
      algorithms: [alg],
      complete: true,
    });
    if (typeof jwt.payload === 'string') return null;
    return jwt.payload as AuthToken;
  } catch (err) {
    logger.error(err);
    return null;
  }
}

export function makeAuthToken(payload: AuthToken): string {
  const ops: SignOptions = {
    algorithm: alg,
  };
  return jwtLib.sign(payload, conf.crypto.secret, ops);
}

export function parseAuthorizationToken(request: FastifyRequest) {
  const { authorization } = request.headers;
  if (!authorization) return null;
  const headerParts: string[] = authorization.split(' ', 2);
  if (headerParts.length === 0 || headerParts[0] !== 'Bearer')
    throw ApiError.forMessage('Wrong auth header type', 401);
  return headerParts[1];
}

export function getAuthorizationToken(request: FastifyRequest) {
  const token = parseAuthorizationToken(request);
  if (!token) throw ApiError.forMessage('Auth header missing', 401);
  return token;
}
