export interface FileArchivalDto {
  id: string;
  fileCode: string;
  fileName: string;
  fileUrl: string;
  fileType?: string;
  fileSize?: number;
  extension?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string | null;
  updatedBy?: string | null;
  isDeleted: boolean;
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
