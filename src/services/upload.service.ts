import type { UploadSingleResponseDto } from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const uploadService = {
  uploadSingle: async (
    file: FormData,
    type: "image" | "audio" | "document",
  ): Promise<UploadSingleResponseDto> => {
    let url = API_ENDPOINTS.UPLOAD_FILE.IMAGE;
    if (type === "audio") {
      url = API_ENDPOINTS.UPLOAD_FILE.AUDIO;
    } else if (type === "document") {
      url = API_ENDPOINTS.UPLOAD_FILE.DOCUMENT;
    }

    const response = await rootApiService.post<UploadSingleResponseDto>(
      url,
      file,
    );
    return response;
  },
};
