import type { BaseDto } from "./common";

export interface MusicBackgroundDto extends BaseDto {
  name: string;
  author?: string | null;
  duration?: string | null;
  usageCount: number;
  isActive: boolean;
  status: string; // enumData.MUSIC_STATUS
  youtubeUrl?: string | null;
  audioUrl?: string | null;
  thumbnailUrl?: string | null;
  type: string; // enumData.MUSIC_TYPE
}

export interface CreateMusicBackgroundDto {
  name: string;
  author?: string;
  duration?: string;
  audioUrl?: string;
  youtubeUrl?: string;
  thumbnailUrl?: string;
  isActive?: boolean;
  type?: string;
}

export interface UpdateMusicBackgroundDto extends Partial<CreateMusicBackgroundDto> {
  id: string;
}

export interface ImportYoutubeDto {
  youtubeUrl: string;
  provider?: "youtube-dl-exec" | "public-api" | "python-yt-dlp";
  type?: string;
}

export interface GetYoutubeInfoDto {
  url: string;
  provider?: "youtube-dl-exec" | "public-api" | "python-yt-dlp";
}

export interface CancelImportDto {
  url: string;
}

export interface FilterMusicBackgroundDto {
  name?: string;
  author?: string;
  isActive?: boolean;
  status?: string;
  type?: string;
}

/* ============================================================
 * YOUTUBE INFO RESPONSE
 * ============================================================ */
export interface YoutubeInfoDto {
  id: string;
  title: string;
  author: string;
  durationSeconds: number;
  durationText: string;
  thumbnail: string;
  thumbnailUrl: string;
  youtubeUrl: string;
}
