/* ============================================================
 * BASE CONFIG
 * ============================================================ */
export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4300",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

/* ============================================================
 * HELPER
 * ============================================================ */
const ADMIN = "/api/admin";
const UPLOAD = "/api/upload";
const API = "/api";

/* ============================================================
 * API ENDPOINTS — CHỈ ADMIN SITE (Chuẩn theo wio-api)
 * ============================================================ */
export const API_ENDPOINTS = {
  /* --------------------------------------------------------
   * AUTH — /admin/auth/*
   * -------------------------------------------------------- */
  AUTH: {
    LOGIN: `${ADMIN}/auth/login`,
    LOGOUT: `${ADMIN}/auth/logout`,
    REFRESH_TOKEN: `${ADMIN}/auth/refresh-token`,
    ME: `${ADMIN}/auth/me`,
    UPDATE_PASSWORD: `${ADMIN}/auth/update-password`,
    CHANGE_PASSWORD: `${ADMIN}/auth/change-password`,
    UPDATE_PROFILE: `${ADMIN}/auth/update-profile`,
    CLEAN_TOKENS: `${ADMIN}/auth/clean-tokens`,
  },

  /* --------------------------------------------------------
   * UPLOAD FILE — /upload/upload-file/*
   * -------------------------------------------------------- */
  UPLOAD_FILE: {
    SINGLE: `${UPLOAD}/upload-file/upload-single`,
    MULTI: `${UPLOAD}/upload-file/upload-multi`,
    IMAGE: `${UPLOAD}/upload-file/upload-image`,
    AUDIO: `${UPLOAD}/upload-file/upload-audio`,
    DOCUMENT: `${UPLOAD}/upload-file/upload-document`,
    CATBOX: `${UPLOAD}/upload-file/upload-catbox`,
    CATBOX_URL: `${UPLOAD}/upload-file/upload-catbox-url`,
  },

  /* --------------------------------------------------------
   * TEMPLATE — /admin/template/*
   * -------------------------------------------------------- */
  TEMPLATE: {
    PAGINATION: `${ADMIN}/template/pagination`,
    FIND_BY_ID: `${ADMIN}/template/find-by-id`,
    CREATE: `${ADMIN}/template/create`,
    UPDATE: `${ADMIN}/template/update`,
    SET_PREMIUM: `${ADMIN}/template/set-premium`,
    SET_IS_SHOW: `${ADMIN}/template/set-is-show`,
    SET_IS_DELETED: `${ADMIN}/template/set-is-deleted`,
  },

  /* --------------------------------------------------------
   * TEMPLATE CATEGORY — /admin/template-category/*
   * -------------------------------------------------------- */
  TEMPLATE_CATEGORY: {
    PAGINATION: `${ADMIN}/template-category/pagination`,
    FIND_BY_ID: `${ADMIN}/template-category/find-by-id`,
    SYNC_ENUM: `${ADMIN}/template-category/sync-enum`,
  },

  /* --------------------------------------------------------
   * INVITATION — /admin/invitation/*
   * -------------------------------------------------------- */
  INVITATION: {
    PAGINATION: `${ADMIN}/invitation/pagination`,
    FIND_BY_ID: `${ADMIN}/invitation/find-by-id`,
    DELETE: `${ADMIN}/invitation/delete`,
    PUBLISH: `${ADMIN}/invitation/publish`,
    UNPUBLISH: `${ADMIN}/invitation/unpublish`,
    FORCE_RESET_SLUG: `${ADMIN}/invitation/force-reset-slug`,
    SLUG_HISTORY: `${ADMIN}/invitation/slug-history`,
    STATS: `${ADMIN}/invitation/stats`,
  },

  /* --------------------------------------------------------
   * WEDDING INFO — /admin/wedding-info/*
   * -------------------------------------------------------- */
  WEDDING_INFO: {
    PAGINATION: `${ADMIN}/wedding-info/pagination`,
    FIND_BY_ID: `${ADMIN}/wedding-info/find-by-id`,
    CREATE: `${ADMIN}/wedding-info/create`,
    UPDATE: `${ADMIN}/wedding-info/update`,
    DELETE: `${ADMIN}/wedding-info/delete`,
  },

  /* --------------------------------------------------------
   * GUEST — /admin/guest/*
   * -------------------------------------------------------- */
  GUEST: {
    PAGINATION: `${ADMIN}/guest/pagination`,
    FIND_BY_ID: `${ADMIN}/guest/find-by-id`,
    STATS: `${ADMIN}/guest/stats`,
    DELETE: `${ADMIN}/guest/delete`,
  },

  /* --------------------------------------------------------
   * WISH — /admin/wish/*
   * -------------------------------------------------------- */
  WISH: {
    PAGINATION: `${ADMIN}/wish/pagination`,
    FIND_BY_ID: `${ADMIN}/wish/find-by-id`,
    CREATE: `${ADMIN}/wish/create`,
    UPDATE: `${ADMIN}/wish/update`,
    DELETE: `${ADMIN}/wish/delete`,
    APPROVE: `${ADMIN}/wish/approve`,
    REJECT: `${ADMIN}/wish/reject`,
    PIN: `${ADMIN}/wish/pin`,
    UNPIN: `${ADMIN}/wish/unpin`,
  },

  /* --------------------------------------------------------
   * PHOTO WALL — /admin/photo-wall/*
   * -------------------------------------------------------- */
  PHOTO_WALL: {
    PAGINATION: `${ADMIN}/photo-wall/pagination`,
    FIND_BY_ID: `${ADMIN}/photo-wall/find-by-id`,
    CREATE: `${ADMIN}/photo-wall/create`,
    UPDATE: `${ADMIN}/photo-wall/update`,
    DELETE: `${ADMIN}/photo-wall/delete`,
    APPROVE: `${ADMIN}/photo-wall/approve`,
    REJECT: `${ADMIN}/photo-wall/reject`,
  },

  /* --------------------------------------------------------
   * TABLE — /table/*
   * -------------------------------------------------------- */
  TABLE: {
    PAGINATION: `${API}/table/pagination`,
    FIND_BY_ID: `${API}/table/find-by-id`,
    CREATE: `${API}/table/create`,
    UPDATE: `${API}/table/update`,
    DELETE: `${API}/table/delete`,
    ASSIGN_GUEST: `${API}/table/assign-guest`,
    UNASSIGN_GUEST: `${API}/table/unassign-guest`,
  },

  /* --------------------------------------------------------
   * CUSTOMER — /admin/customer/*
   * -------------------------------------------------------- */
  CUSTOMER: {
    PAGINATION: `${ADMIN}/customer/pagination`,
    FIND_BY_ID: `${ADMIN}/customer/find-by-id`,
    SELECT_BOX: `${ADMIN}/customer/select-box`,
    ACTIVATE: `${ADMIN}/customer/activate`,
    DEACTIVATE: `${ADMIN}/customer/deactivate`,
    CHANGE_PASSWORD: `${ADMIN}/customer/change-password`,
  },

  /* --------------------------------------------------------
   * SERVICE PLAN — /admin/service-plan/*
   * -------------------------------------------------------- */
  SERVICE_PLAN: {
    PAGINATION: `${ADMIN}/service-plan/pagination`,
    FIND_BY_ID: `${ADMIN}/service-plan/find-by-id`,
    CREATE: `${ADMIN}/service-plan/create`,
    UPDATE: `${ADMIN}/service-plan/update`,
    DELETE: `${ADMIN}/service-plan/delete`,
    SELECT_BOX: `${ADMIN}/service-plan/select-box`,
  },

  /* --------------------------------------------------------
   * SUBSCRIPTION — /admin/subscription/*
   * -------------------------------------------------------- */
  SUBSCRIPTION: {
    PAGINATION: `${ADMIN}/subscription/pagination`,
    FIND_BY_ID: `${ADMIN}/subscription/find-by-id`,
    CREATE: `${ADMIN}/subscription/create`,
    UPDATE: `${ADMIN}/subscription/update`,
    DELETE: `${ADMIN}/subscription/delete`,
    CHANGE_PLAN: `${ADMIN}/subscription/change-plan`,
  },

  /* --------------------------------------------------------
   * MUSIC BACKGROUND — /admin/music-background/*
   * -------------------------------------------------------- */
  MUSIC_BACKGROUND: {
    PAGINATION: `${ADMIN}/music-background/pagination`,
    FIND_BY_ID: `${ADMIN}/music-background/find-by-id`,
    CREATE: `${ADMIN}/music-background/create`,
    UPDATE: `${ADMIN}/music-background/update`,
    DELETE: `${ADMIN}/music-background/delete`,
    IMPORT_YOUTUBE: `${ADMIN}/music-background/import-youtube`,
    INFO: `${ADMIN}/music-background/info`,
  },

  /* --------------------------------------------------------
   * STOCK ASSET — /admin/stock-asset/*
   * -------------------------------------------------------- */
  STOCK_ASSET: {
    PAGINATION: `${ADMIN}/stock-asset/pagination`,
    FIND_BY_ID: `${ADMIN}/stock-asset/find-by-id`,
    CREATE: `${ADMIN}/stock-asset/create`,
    UPDATE: `${ADMIN}/stock-asset/update`,
    DELETE: `${ADMIN}/stock-asset/delete`,
  },

  /* --------------------------------------------------------
   * CONTACT — /admin/contact/*
   * -------------------------------------------------------- */
  CONTACT: {
    PAGINATION: `${ADMIN}/contact/pagination`,
    FIND_BY_ID: `${ADMIN}/contact/find-by-id`,
    UPDATE_STATUS: `${ADMIN}/contact/update-status`,
    DELETE: `${ADMIN}/contact/delete`,
  },

  /* --------------------------------------------------------
   * REVIEW — /admin/review/*
   * -------------------------------------------------------- */
  REVIEW: {
    PAGINATION: `${ADMIN}/review/pagination`,
    FIND_BY_ID: `${ADMIN}/review/find-by-id`,
    CREATE: `${ADMIN}/review/create`,
    UPDATE: `${ADMIN}/review/update`,
    DELETE: `${ADMIN}/review/delete`,
    APPROVE: `${ADMIN}/review/approve`,
    REJECT: `${ADMIN}/review/reject`,
    PIN: `${ADMIN}/review/pin`,
    UNPIN: `${ADMIN}/review/unpin`,
  },

  /* --------------------------------------------------------
   * NOTIFICATION — /admin/notification/*
   * -------------------------------------------------------- */
  NOTIFICATION: {
    PAGINATION: `${ADMIN}/notification/pagination`,
    FIND_BY_ID: `${ADMIN}/notification/find-by-id`,
  },

  /* --------------------------------------------------------
   * ACTION LOG — /admin/action-log/*
   * -------------------------------------------------------- */
  ACTION_LOG: {
    PAGINATION: `${ADMIN}/action-log/pagination`,
  },

  /* --------------------------------------------------------
   * ANALYTICS — /admin/analytics/*
   * -------------------------------------------------------- */
  ANALYTICS: {
    OVERVIEW: `${ADMIN}/analytics/overview`,
  },
};
