import type { BaseDto, FilterItemBoolean, FilterItemText } from "./common";

export interface IMusicBackground extends BaseDto {
  name: string;
  author?: string;
  duration?: string;
  audioUrl?: string;
  fileUrl?: string;
  isActive: boolean;
  status: "PENDING" | "PROCESSING" | "DONE" | "ERROR";
  youtubeUrl?: string;
  usageCount?: number;
}

export interface CreateMusicBackgroundDto {
  name: string;
  author?: string;
  duration?: string;
  audioUrl?: string;
  isActive?: boolean;
}

export interface UpdateMusicBackgroundDto extends Partial<CreateMusicBackgroundDto> {
  id: string;
  audioUrl?: string;
}

export interface ImportYoutubeDto {
  youtubeUrl: string;
}

export interface FilterMusicBackgroundDto {
  name?: string | FilterItemText;
  author?: string | FilterItemText;
  isActive?: boolean | FilterItemBoolean;
  status?: string | FilterItemText;
}
