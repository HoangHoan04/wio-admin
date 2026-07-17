import type { BaseDto, FilterItemSelect, FilterItemText } from "./common";

export interface WeddingDto extends BaseDto {
  userId: string;
  templateId?: string;
  slug: string;
  groomName: string;
  groomDob?: string;
  groomFamilyTitle?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomShortName?: string;
  groomPhotoUrl?: string;
  brideName: string;
  brideDob?: string;
  brideFamilyTitle?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideShortName?: string;
  bridePhotoUrl?: string;
  engagementAt?: string;
  engagementVenue?: string;
  engagementAddress?: string;
  engagementMapsUrl?: string;
  ceremonyAt: string;
  ceremonyVenue: string;
  ceremonyAddress?: string;
  ceremonyMapsUrl?: string;
  ceremonyLat?: number;
  ceremonyLng?: number;
  receptionAt?: string;
  receptionVenue?: string;
  receptionAddress?: string;
  receptionMapsUrl?: string;
  receptionLat?: number;
  receptionLng?: number;
  invitationText?: string;
  loveStory?: string;
  hashtag?: string;
  musicUrl?: string;
  musicType?: string;
  musicAutoplay: boolean;
  groomBankAccount?: string;
  groomBankName?: string;
  groomBankOwner?: string;
  groomQrUrl?: string;
  brideBankAccount?: string;
  brideBankName?: string;
  brideBankOwner?: string;
  brideQrUrl?: string;
  publishedAt?: string;
  expiresAt?: string;
}

export interface AdminForceResetSlugDto {
  weddingId: string;
  newSlug: string;
  reason: string;
}

export interface FilterWeddingDto {
  userId?: FilterItemText;
  slug?: FilterItemText;
  groomName?: FilterItemText;
  brideName?: FilterItemText;
  status?: FilterItemSelect;
}
