export const API_ROUTES = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4300",
  TIMEOUT: 30000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/admin/auth/login",
    LOGOUT: "/api/admin/auth/logout",
    REFRESH_TOKEN: "/api/admin/auth/refresh-token",
    ME: "/api/admin/auth/me",
    UPDATE_PASSWORD: "/api/admin/auth/update-password",
    CHANGE_PASSWORD: "/api/admin/auth/change-password",
  },

  ACTION_LOG: "/api/admin/action-log/pagination",

  UPLOAD_FILE: {
    IMAGE: "/api/upload/upload-file/upload-image",
    AUDIO: "/api/upload/upload-file/upload-audio",
    DOCUMENT: "/api/upload/upload-file/upload-document",
    BULK_IMAGES: "/api/upload/upload-file/upload-multi",
  },

  WEDDING: {
    PAGINATION: "/api/admin/wedding/pagination",
    DELETE: "/api/admin/wedding/delete",
    FIND_BY_ID: "/api/admin/wedding/find-by-id",
    FORCE_RESET_SLUG: "/api/admin/wedding/force-reset-slug",
    SLUG_HISTORY: "/api/admin/wedding/slug-history",
    PUBLISH: "/api/admin/wedding/publish",
    UNPUBLISH: "/api/admin/wedding/unpublish",
  },

  TEMPLATE: {
    PAGINATION: "/api/admin/template/pagination",
    CREATE: "/api/admin/template/create",
    UPDATE: "/api/admin/template/update",
    DELETE: "/api/admin/template/delete",
    FIND_BY_ID: "/api/admin/template/find-by-id",
    ACTIVATE: "/api/admin/template/activate",
    DEACTIVATE: "/api/admin/template/deactivate",
    SET_PREMIUM: "/api/admin/template/set-premium",
  },

  WISH: {
    PAGINATION: "/api/admin/wish/pagination",
    DELETE: "/api/admin/wish/delete",
    APPROVE: "/api/admin/wish/approve",
    REJECT: "/api/admin/wish/reject",
    PIN: "/api/admin/wish/pin",
    UNPIN: "/api/admin/wish/unpin",
  },

  PHOTO_WALL: {
    PAGINATION: "/api/admin/photo-wall/pagination",
    DELETE: "/api/admin/photo-wall/delete",
    APPROVE: "/api/admin/photo-wall/approve",
    REJECT: "/api/admin/photo-wall/reject",
  },

  CUSTOMER: {
    PAGINATION: "/api/admin/customer/pagination",
    FIND_BY_ID: "/api/admin/customer/find-by-id",
    ACTIVATE: "/api/admin/customer/activate",
    DEACTIVATE: "/api/admin/customer/deactivate",
    SELECT_BOX: "/api/admin/customer/select-box",
    CHANGE_PASSWORD: "/api/admin/customer/change-password",
  },

  SUBSCRIPTION: {
    PAGINATION: "/api/admin/subscription/pagination",
    DELETE: "/api/admin/subscription/delete",
    FIND_BY_ID: "/api/admin/subscription/find-by-id",
    CHANGE_PLAN: "/api/admin/subscription/change-plan",
  },

  ANALYTICS: {
    SYSTEM_STATS: "/api/admin/analytics/system-stats",
  },

  MUSIC_BACKGROUND: {
    PAGINATION: "/api/admin/music-background/pagination",
    FIND_BY_ID: "/api/admin/music-background/find-by-id",
    CREATE: "/api/admin/music-background/create",
    IMPORT_YOUTUBE: "/api/admin/music-background/import-youtube",
    UPDATE: "/api/admin/music-background/update",
    DELETE: "/api/admin/music-background/delete",
  },
};
