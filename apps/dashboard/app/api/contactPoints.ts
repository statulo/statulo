import type { EnumType } from "~/api/enums";
import type { OrgMemberResponse } from "~/api/members";

export const contactPointTypes = {
  member: "member",
  discord: "discord",
} as const;
export type ContactPointTypes = EnumType<typeof contactPointTypes>;

export interface MemberContactPointResponse {
  id: string;
  member: OrgMemberResponse;
}

export interface DiscordContactPointResponse {
  id: string;
  webhookUrl: string;
}

export interface ContactPointResponse {
  id: string;
  type: ContactPointTypes;
  createdAt: string;
  member: MemberContactPointResponse | null;
  discord: DiscordContactPointResponse | null;
}
