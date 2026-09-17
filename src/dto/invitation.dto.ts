import type { BaseDto } from "./common";
import type { GuestGroupDto } from "./guest.dto";
import type { TemplateDto } from "./template.dto";

/* ============================================================
 * NESTED DTOs
 * ============================================================ */
import type { WeddingInfoDto } from "./wedding-info.dto";
export type { WeddingInfoDto };

export interface InvitationHostDto {
  id?: string;
  role: string; // enumData.HOST_ROLE
  fullName: string;
  shortName?: string | null;
  photoUrl?: string | null;
  social?: Record<string, string> | null;
  sortOrder?: number;
}

export interface InvitationEventDto {
  id?: string;
  eventKey: string; // enumData.EVENT_KEY
  title: string;
  startsAt?: string | null;
  endsAt?: string | null;
  venue?: string | null;
  address?: string | null;
  mapsUrl?: string | null;
  lat?: number | null;
  lng?: number | null;
  dressCode?: string | null;
  isPrimary?: boolean;
  sortOrder?: number;
}

export interface InvitationGiftDto {
  id?: string;
  label: string;
  bankName?: string | null;
  accountNumber?: string | null;
  accountOwner?: string | null;
  qrUrl?: string | null;
  side?: string | null;
  sortOrder?: number;
}

export interface InvitationTimelineDto {
  id?: string;
  eventId?: string | null;
  timeLabel?: string | null;
  title: string;
  description?: string | null;
  iconUrl?: string | null;
  sortOrder?: number;
}

export interface InvitationPhotoDto {
  id?: string;
  url: string;
  storageKey?: string | null;
  caption?: string | null;
  kind?: string;
  sortOrder?: number;
}

/* ============================================================
 * INVITATION
 * ============================================================ */
export interface InvitationDto extends BaseDto {
  userId: string;
  templateId?: string | null;
  designMode: string; // enumData.DESIGN_MODE
  weddingTheme: string; // enumData.WEDDING_THEME
  title: string;
  slug: string;
  status: string; // enumData.INVITATION_STATUS
  invitationText?: string | null;
  thankYouText?: string | null;
  heroImageUrl?: string | null;
  primaryEventAt?: string | null;
  sectionConfig?: Record<string, boolean> | null;
  musicId?: string | null;
  musicConfig?: {
    autoplay?: boolean;
    loop?: boolean;
    volume?: number;
  } | null;
  customDesign?: Record<string, unknown> | null;
  aiGeneratedMeta?: Record<string, unknown> | null;
  shareUrl?: string | null;
  shareQrUrl?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  viewCount: number;
  uniqueViewCount: number;
  publishedAt?: string | null;
  expiresAt?: string | null;

  // Compatibility fields for detail & views
  cardType?: string | null;
  extraContent?: string | null;
  hashtag?: string | null;
  music?: {
    id: string;
    title: string;
    artist?: string;
    audioUrl?: string;
  } | null;

  // Relations
  user?: {
    id: string;
    email: string;
    phone?: string | null;
    customer?: {
      fullName?: string;
    } | null;
  };
  template?: TemplateDto;
  weddingInfo?: WeddingInfoDto;
  hosts?: InvitationHostDto[];
  events?: InvitationEventDto[];
  gifts?: InvitationGiftDto[];
  timelines?: InvitationTimelineDto[];
  photos?: InvitationPhotoDto[];
  guestGroups?: GuestGroupDto[];
}

/* ============================================================
 * REQUEST DTOs
 * ============================================================ */
export interface CreateInvitationDto {
  userId?: string;
  templateId?: string;
  designMode: string;
  weddingTheme: string;
  title: string;
  slug: string;
  invitationText?: string;
  thankYouText?: string;
  heroImageUrl?: string;
  sectionConfig?: Record<string, boolean>;
  musicId?: string;
  musicConfig?: { autoplay?: boolean; loop?: boolean; volume?: number };
  customDesign?: Record<string, unknown>;
  aiGeneratedMeta?: Record<string, unknown>;
  seoTitle?: string;
  seoDescription?: string;
  weddingInfo?: WeddingInfoDto;
  hosts?: InvitationHostDto[];
  events?: InvitationEventDto[];
  gifts?: InvitationGiftDto[];
  timelines?: InvitationTimelineDto[];
  photos?: InvitationPhotoDto[];
  guestGroups?: GuestGroupDto[];
}

export interface UpdateInvitationDto extends Partial<CreateInvitationDto> {
  id: string;
  slugReason?: string;
}

export interface FilterInvitationDto {
  userId?: string;
  templateId?: string;
  designMode?: string;
  weddingTheme?: string;
  slug?: string;
  title?: string;
  status?: string;
}

export interface AdminForceResetSlugDto {
  invitationId: string;
  newSlug: string;
  reason: string;
}

export interface CheckSlugDto {
  slug: string;
}

export interface CheckSlugResponseDto {
  available: boolean;
}
