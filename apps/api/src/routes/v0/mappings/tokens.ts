import type { EnumType } from '@/utils/types';

export const tokenTypes = {
  session: 'session',
} as const;
export type TokenTypes = EnumType<typeof tokenTypes>;

export type TokenDto = {
  type: TokenTypes;
  token: string;
};

export function mapToken(type: TokenTypes, token: string): TokenDto {
  return {
    type,
    token,
  };
}
