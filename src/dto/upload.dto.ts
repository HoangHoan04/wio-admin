import type { BaseDto } from "./common";

export interface FileArchivalDto extends BaseDto {
  fileCode: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  extension?: string;
}

export interface UploadSingleResponseDto {
  id: string;
  fileCode: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  extension?: string;
}
