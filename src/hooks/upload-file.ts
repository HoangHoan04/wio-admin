import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useState } from "react";

export interface UploadFileResponse {
  fileName: string;
  fileUrl: string;
  storage: string;
}

export type UploadFileType = "image" | "document" | "audio" | "all";

const getUploadEndpoint = (type: UploadFileType): string => {
  switch (type) {
    case "document":
      return API_ENDPOINTS.UPLOAD_FILE.DOCUMENT;
    case "image":
      return API_ENDPOINTS.UPLOAD_FILE.IMAGE;
    case "audio":
      return API_ENDPOINTS.UPLOAD_FILE.AUDIO;
    default:
      return API_ENDPOINTS.UPLOAD_FILE.SINGLE;
  }
};

export const useUploadFile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const uploadFile = async (
    file: File,
    type: UploadFileType = "image",
  ): Promise<UploadFileResponse | null> => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await rootApiService.post<UploadFileResponse>(
        getUploadEndpoint(type),
        formData,
      );
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const uploadFiles = async (files: File[]): Promise<UploadFileResponse[]> => {
    if (files.length === 0) return [];

    setIsLoading(true);
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("files", file));

      const response = await rootApiService.post<UploadFileResponse[]>(
        API_ENDPOINTS.UPLOAD_FILE.BULK_IMAGES,
        formData,
      );
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    uploadFile,
    uploadFiles,
    isLoading,
  };
};
