import type { BaseDto } from "./common";

/* ============================================================
 * WISH
 * ============================================================ */
export interface WishDto extends BaseDto {
  invitationId: string;
  guestId?: string | null;
  guestName: string;
  content: string;
  isApproved: boolean;
  isPinned: boolean;
  approvedAt?: string | null;
}

export interface CreateWishDto {
  invitationId: string;
  guestId?: string;
  guestName: string;
  content: string;
  isApproved?: boolean;
  isPinned?: boolean;
}

export interface UpdateWishDto {
  id: string;
  guestName?: string;
  content?: string;
  isApproved?: boolean;
  isPinned?: boolean;
}

export interface FilterWishDto {
  invitationId?: string;
  guestId?: string;
  guestName?: string;
  isApproved?: boolean;
  isPinned?: boolean;
}

export interface PublicCreateWishDto {
  invitationId: string;
  invitationCode?: string;
  guestName: string;
  content: string;
}

export interface PublicWishListDto {
  invitationId: string;
  skip?: number;
  take?: number;
}

/* ============================================================
 * PHOTO WALL
 * ============================================================ */
export interface PhotoWallDto extends BaseDto {
  invitationId: string;
  guestId?: string | null;
  uploaderName: string;
  url: string;
  storageKey?: string | null;
  caption?: string | null;
  isApproved: boolean;
  approvedAt?: string | null;
  // Aliases for legacy UI code
  photoUrl?: string;
  guestName?: string;
  message?: string;
}

export interface CreatePhotoWallDto {
  invitationId: string;
  guestId?: string;
  uploaderName: string;
  url: string;
  storageKey?: string;
  caption?: string;
  isApproved?: boolean;
}

export interface UpdatePhotoWallDto {
  id: string;
  uploaderName?: string;
  url?: string;
  storageKey?: string;
  caption?: string;
  isApproved?: boolean;
}

export interface FilterPhotoWallDto {
  invitationId?: string;
  guestId?: string;
  uploaderName?: string;
  isApproved?: boolean;
}

export interface PublicUploadPhotoWallDto {
  invitationId: string;
  invitationCode?: string;
  uploaderName: string;
  url: string;
  storageKey?: string;
  caption?: string;
}

/* ============================================================
 * REVIEW
 * ============================================================ */
import type {
  CreateReviewDto,
  FilterReviewDto,
  ReviewDto,
  UpdateReviewDto,
} from "./review.dto";

export type { ReviewDto, CreateReviewDto, UpdateReviewDto, FilterReviewDto };

export interface PublicCreateReviewDto {
  authorName: string;
  content: string;
  rating: number;
  eventLabel?: string;
  weddingTheme?: string;
  invitationId?: string;
}

export interface PublicReviewListDto {
  take?: number;
  weddingTheme?: string;
  ratingMin?: number;
}
