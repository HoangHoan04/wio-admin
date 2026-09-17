import type { UploadResultDto } from "@/dto/upload.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation } from "@tanstack/react-query";

/* ============================================================
 * TYPES
 * ============================================================ */
export type UploadFileType = "image" | "audio" | "document" | "auto" | "all";

export interface UploadSingleVariables {
  file: File;
  type?: UploadFileType;
}

export interface UploadMultiVariables {
  files: File[];
}

/* ============================================================
 * ENDPOINT RESOLVER
 * ============================================================ */
const resolveEndpoint = (type: UploadFileType = "auto"): string => {
  switch (type) {
    case "document":
      return API_ENDPOINTS.UPLOAD_FILE.DOCUMENT;
    case "audio":
      return API_ENDPOINTS.UPLOAD_FILE.AUDIO;
    case "image":
      return API_ENDPOINTS.UPLOAD_FILE.IMAGE;
    case "all":
    case "auto":
    default:
      return API_ENDPOINTS.UPLOAD_FILE.SINGLE;
  }
};

/* ============================================================
 * API FUNCTIONS
 * ============================================================ */
async function uploadSingleApi({
  file,
  type = "auto",
}: UploadSingleVariables): Promise<UploadResultDto> {
  const formData = new FormData();
  formData.append("file", file);

  return rootApiService.post<UploadResultDto>(resolveEndpoint(type), formData);
}

async function uploadMultiApi({
  files,
}: UploadMultiVariables): Promise<UploadResultDto[]> {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  return rootApiService.post<UploadResultDto[]>(
    API_ENDPOINTS.UPLOAD_FILE.MULTI,
    formData,
  );
}

/* ============================================================
 * HOOKS
 * ============================================================ */
export const useUploadSingleFile = () => {
  return useMutation({
    mutationFn: uploadSingleApi,
  });
};

export const useUploadMultipleFiles = () => {
  return useMutation({
    mutationFn: uploadMultiApi,
  });
};

/* ============================================================
 * CONVENIENCE HOOK — gộp cả 2
 * ============================================================ */
export const useUploadFile = () => {
  const single = useUploadSingleFile();
  const multiple = useUploadMultipleFiles();

  return {
    /* Single */
    uploadFile: (
      fileOrVars: File | UploadSingleVariables,
      type?: UploadFileType,
    ) =>
      single.mutateAsync(
        fileOrVars instanceof File
          ? { file: fileOrVars, type }
          : fileOrVars,
      ),
    isLoading: single.isPending,
    isUploading: single.isPending,
    uploadError: single.error,

    /* Multiple */
    uploadFiles: (filesOrVars: File[] | UploadMultiVariables) =>
      multiple.mutateAsync(
        Array.isArray(filesOrVars) ? { files: filesOrVars } : filesOrVars,
      ),
    isLoadingMultiple: multiple.isPending,
    isUploadingMultiple: multiple.isPending,
    uploadMultipleError: multiple.error,

    /* Utilities */
    reset: () => {
      single.reset();
      multiple.reset();
    },
  };
};
