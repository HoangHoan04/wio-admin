import type { BaseDto } from "./common";
import type { InvitationDto } from "./invitation.dto";

export interface WishDto extends BaseDto {
  invitationId: string;
  invitation?: InvitationDto;
  guestName: string;
  content: string;
  status: string;
  isPinned: boolean;
}

export interface FilterWishDto {
  guestName?: string;
  status?: string;
}

export interface PhotoWallDto extends BaseDto {
  invitationId: string;
  invitation?: InvitationDto;
  guestName: string;
  photoUrl: string;
  message?: string;
  status: string;
}

export interface FilterPhotoWallDto {
  guestName?: string;
  status?: string;
}
