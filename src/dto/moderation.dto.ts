import type { BaseDto, FilterItemText, FilterItemSelect } from "./common";
import type { IWedding } from "./wedding.dto";

export interface IWish extends BaseDto {
  weddingId: string;
  wedding?: IWedding;
  guestName: string;
  content: string;
  status: string;
  isPinned: boolean;
}

export interface FilterWishDto {
  guestName?: FilterItemText;
  status?: FilterItemSelect;
}

export interface IPhotoWall extends BaseDto {
  weddingId: string;
  wedding?: IWedding;
  guestName: string;
  photoUrl: string;
  message?: string;
  status: string;
}

export interface FilterPhotoWallDto {
  guestName?: FilterItemText;
  status?: FilterItemSelect;
}
