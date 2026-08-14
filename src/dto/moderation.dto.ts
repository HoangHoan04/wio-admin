import type { BaseDto } from "./common";
import type { InvitationDto } from "./invitation.dto";

export interface WishDto extends BaseDto {
  invitationId: string;
  invitation?: InvitationDto;
  guestId?: string;
  guestName: string;
  content: string;
  isApproved: boolean;
  isPinned: boolean;
  approvedAt?: string;
  status?: string;
}

export interface FilterWishDto {
  invitationId?: string;
  guestId?: string;
  guestName?: string;
  content?: string;
  isApproved?: boolean;
  isPinned?: boolean;
  status?: string;
}

export interface PhotoWallDto extends BaseDto {
  invitationId: string;
  invitation?: InvitationDto;
  guestId?: string;
  uploaderName?: string;
  guestName?: string;
  url?: string;
  photoUrl?: string;
  caption?: string;
  message?: string;
  storageKey?: string;
  isApproved: boolean;
  approvedAt?: string;
  status?: string;
}

export interface FilterPhotoWallDto {
  invitationId?: string;
  guestId?: string;
  uploaderName?: string;
  guestName?: string;
  url?: string;
  caption?: string;
  isApproved?: boolean;
  status?: string;
}
