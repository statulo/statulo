import type { User } from '@prisma/client';

export type UserDto = {
  id: string;
  email: string;
  createdAt: string;
};

export function mapUser(user: User): UserDto {
  return {
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
