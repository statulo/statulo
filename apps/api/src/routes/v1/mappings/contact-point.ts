import type { DiscordContactPoint, MemberContactPoint, OrgMember, Prisma, User } from "@prisma/client";
import type { ContactPointTypes } from "@/routes/v1/contact-points";
import { contactPointTypes } from "@/routes/v1/contact-points";
import { mapOrgMember, type OrgMemberDto } from "@/routes/v1/mappings/org-member";

export interface MemberContactPointDto {
  id: string;
  member: OrgMemberDto;
}

export interface DiscordContactPointDto {
  id: string;
  webhookUrl: string;
}

export interface ContactPointDto {
  id: string;
  type: ContactPointTypes;
  createdAt: string;
  member: MemberContactPointDto | null;
  discord: DiscordContactPointDto | null;
}

function mapMemberContactPoint(memberContactPoint: PopulatedMemberContactPoint): MemberContactPointDto {
  return {
    id: memberContactPoint.id,
    member: mapOrgMember(memberContactPoint.orgMember),
  };
}

function mapDiscordContactPoint(discordContactPoint: DiscordContactPoint): DiscordContactPointDto {
  return {
    id: discordContactPoint.id,
    webhookUrl: discordContactPoint.webhookUrl,
  };
}

export type PopulatedMemberContactPoint = (MemberContactPoint & { orgMember: OrgMember & { user: User } });

export type PopulatedContactPoint = Prisma.ContactPointGetPayload<{
  include: {
    member: {
      include: {
        orgMember: {
          include: {
            user: true;
          };
        };
      };
    };
    discord: true;
  };
}>;

export function mapContactPoint(contactPoint: PopulatedContactPoint): ContactPointDto {
  return {
    id: contactPoint.id,
    type: contactPoint.type as ContactPointTypes,
    createdAt: contactPoint.createdAt.toISOString(),
    member: contactPoint.type === contactPointTypes.member && contactPoint.member ? mapMemberContactPoint(contactPoint.member) : null,
    discord: contactPoint.type === contactPointTypes.discord && contactPoint.discord ? mapDiscordContactPoint(contactPoint.discord) : null,
  };
}
