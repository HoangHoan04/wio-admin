import type { BaseDto } from "./common";
import type { TemplateDto } from "./template.dto";

export interface InvitationHostDto {
  id?: string;
  role: string;
  fullName: string;
  shortName?: string;
  honorific?: string;
  photoUrl?: string;
  family?: Record<string, any>;
}

export interface InvitationEventDto {
  id?: string;
  eventKey?: string;
  title?: string;
  startsAt?: string;
  venue?: string;
  address?: string;
  mapsUrl?: string;
  dressCode?: string;
  isPrimary?: boolean;
}

export interface InvitationGiftDto {
  id?: string;
  label?: string;
  bankName?: string;
  accountNumber?: string;
  accountOwner?: string;
  qrUrl?: string;
}

export interface InvitationDto extends BaseDto {
  userId: string;
  templateId?: string;
  cardType: string;
  title: string;
  slug: string;
  status: string;
  invitationText?: string;
  thankYouText?: string;
  hashtag?: string;
  heroImageUrl?: string;
  primaryEventAt?: string;
  publishedAt?: string;
  shareUrl?: string;
  shareQrUrl?: string;
  music?: { url?: string; type?: string; autoplay?: boolean; name?: string };
  extraContent?: Record<string, any>;
  hosts?: InvitationHostDto[];
  events?: InvitationEventDto[];
  gifts?: InvitationGiftDto[];
  user?: { id: string; email: string; fullName?: string; phone?: string };
  template?: TemplateDto;
}

export interface FilterInvitationDto {
  userId?: string;
  templateId?: string;
  cardType?: string;
  title?: string;
  slug?: string;
  status?: string;
}

export interface AdminForceResetSlugDto {
  invitationId: string;
  newSlug: string;
  reason: string;
}
