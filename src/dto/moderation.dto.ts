import type { BaseDto } from "./common";
import type { WeddingDto } from "./wedding.dto";

export interface WishDto extends BaseDto {
  weddingId: string;
  wedding?: WeddingDto;
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
  weddingId: string;
  wedding?: WeddingDto;
  guestName: string;
  photoUrl: string;
  message?: string;
  status: string;
}

export interface FilterPhotoWallDto {
  guestName?: string;
  status?: string;
}
