import { FilterItemSelect, FilterItemText, type BaseDto } from "./common";

export interface IWedding extends BaseDto {
  userId: string;
  templateId?: string;
  slug: string;
  groomName: string;
  groomDob?: string;
  groomFamilyTitle?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomPhotoUrl?: string;
  brideName: string;
  brideDob?: string;
  brideFamilyTitle?: string;
  brideFatherName?: string;
  brideMotherName?: string;
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
  bankAccountNumber?: string;
  bankName?: string;
  bankAccountName?: string;
  bankTransferNote?: string;
  vietqrUrl?: string;
  status: string;
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
