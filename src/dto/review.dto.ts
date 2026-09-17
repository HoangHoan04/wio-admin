import type { BaseDto } from "./common";

export interface ReviewDto extends BaseDto {
  authorName: string;
  content: string;
  rating: number;
  eventLabel?: string;
  avatarUrl?: string;
  weddingTheme?: string;
  invitationId?: string;
  userId?: string;
  status: string; // PENDING | APPROVED | REJECTED
  isPinned: boolean;
  sortOrder?: number;
}

export interface FilterReviewDto {
  authorName?: string;
  status?: string;
  isPinned?: boolean;
  weddingTheme?: string;
  rating?: number;
}

export interface CreateReviewDto {
  authorName: string;
  content: string;
  rating: number;
  eventLabel?: string;
  avatarUrl?: string;
  weddingTheme?: string;
  invitationId?: string;
  isPinned?: boolean;
  sortOrder?: number;
}

export interface UpdateReviewDto extends Partial<CreateReviewDto> {
  id: string;
  status?: string;
}
