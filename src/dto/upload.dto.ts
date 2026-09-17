/* ============================================================
 * RESPONSE — Kết quả upload
 * ============================================================ */
export interface UploadResultDto {
  fileName: string;
  fileUrl: string;
  storage: "cloudinary" | "catbox";
}

/* ============================================================
 * REQUEST
 * ============================================================ */
export interface UploadCatboxFromUrlDto {
  url: string;
}
