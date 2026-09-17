import type { BaseDto } from "./common";

export interface WeddingInfoDto extends BaseDto {
  invitationId: string;
  brideName: string;
  brideShortName?: string;
  bridePhotoUrl?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideBio?: string;
  brideSocial?: Record<string, string>;

  groomName: string;
  groomShortName?: string;
  groomPhotoUrl?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomBio?: string;
  groomSocial?: Record<string, string>;

  storyTitle?: string;
  storyContent?: string;

  weddingDate?: string;
  weddingLocation?: string;
  weddingAddress?: string;
  weddingMapUrl?: string;
}

export interface FilterWeddingInfoDto {
  invitationId?: string;
  brideName?: string;
  groomName?: string;
}

export interface CreateWeddingInfoDto {
  invitationId: string;
  brideName: string;
  brideShortName?: string;
  bridePhotoUrl?: string;
  brideFatherName?: string;
  brideMotherName?: string;
  brideBio?: string;
  brideSocial?: Record<string, string>;
  groomName: string;
  groomShortName?: string;
  groomPhotoUrl?: string;
  groomFatherName?: string;
  groomMotherName?: string;
  groomBio?: string;
  groomSocial?: Record<string, string>;
}

export interface UpdateWeddingInfoDto extends Partial<CreateWeddingInfoDto> {
  id: string;
}
