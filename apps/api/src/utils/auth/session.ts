import type {
  OrgMember,
  Organisation,
  User,
  UserSession,
} from '@prisma/client';
import { prisma } from '@/modules/db';
import { getId } from '@/utils/id';
import { makeAuthToken } from '@/utils/auth/tokens';

export const sessionExpiryInMs = 7 * 24 * 60 * 60 * 1000; // 7 days

export type PopulatedSession = UserSession & {
  user: User & {
    orgMembers: (OrgMember & { org: Organisation })[];
  };
};

export async function fetchSessionAndUpdateExpiry(
  id: string,
): Promise<PopulatedSession | null> {
  try {
    const session = await prisma.userSession.update({
      where: {
        id,
        expiresAt: {
          gte: new Date(), // only fetch if expiresAt is set in the future (greater than NOW)
        },
      },
      data: {
        expiresAt: new Date(Date.now() + sessionExpiryInMs), // new expiry date = NOW + expiry delay
      },
      include: {
        user: {
          include: {
            orgMembers: {
              include: {
                org: true,
              },
            },
          },
        },
      },
    });
    return session;
  } catch {
    return null;
  }
}

export async function createSession(user: User) {
  const session = await prisma.userSession.create({
    data: {
      expiresAt: new Date(Date.now() + sessionExpiryInMs), // new expiry date = NOW + expiry delay
      userId: user.id,
      id: getId('ses'),
    },
  });
  return session;
}

export function makeSessionToken(id: string): string {
  return makeAuthToken({
    t: 'session',
    id,
  });
}
