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
    CLEAN_TOKENS: "/api/admin/auth/clean-tokens",
  },

  ACTION_LOG: "/api/admin/action-log/pagination",

  UPLOAD_FILE: {
    IMAGE: "/api/upload/upload-file/upload-image",
    AUDIO: "/api/upload/upload-file/upload-audio",
    DOCUMENT: "/api/upload/upload-file/upload-document",
    SINGLE: "/api/upload/upload-file/upload-single",
    BULK_IMAGES: "/api/upload/upload-file/upload-multi",
  },

  INVITATION: {
    PAGINATION: "/api/admin/invitation/pagination",
    DELETE: "/api/admin/invitation/delete",
    FIND_BY_ID: "/api/admin/invitation/find-by-id",
    FORCE_RESET_SLUG: "/api/admin/invitation/force-reset-slug",
    SLUG_HISTORY: "/api/admin/invitation/slug-history",
    PUBLISH: "/api/admin/invitation/publish",
    UNPUBLISH: "/api/admin/invitation/unpublish",
    STATS: "/api/admin/invitation/stats",
  },

  CARD_TYPE: {
    PAGINATION: "/api/admin/card-type/pagination",
    FIND_BY_ID: "/api/admin/card-type/find-by-id",
    SYNC_ENUM: "/api/admin/card-type/sync-enum",
  },

  TEMPLATE: {
    PAGINATION: "/api/admin/template/pagination",
    CREATE: "/api/admin/template/create",
    UPDATE: "/api/admin/template/update",
    FIND_BY_ID: "/api/admin/template/find-by-id",
    SET_PREMIUM: "/api/admin/template/set-premium",
    SET_IS_SHOW: "/api/admin/template/set-is-show",
    SET_IS_DELETED: "/api/admin/template/set-is-deleted",
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

  GUEST: {
    PAGINATION: "/api/admin/guest/pagination",
    FIND_BY_ID: "/api/admin/guest/find-by-id",
    STATS: "/api/admin/guest/stats",
    DELETE: "/api/admin/guest/delete",
  },

  SERVICE_PLAN: {
    PAGINATION: "/api/admin/service-plan/pagination",
    FIND_BY_ID: "/api/admin/service-plan/find-by-id",
    CREATE: "/api/admin/service-plan/create",
    UPDATE: "/api/admin/service-plan/update",
    DELETE: "/api/admin/service-plan/delete",
    SELECT_BOX: "/api/admin/service-plan/select-box",
  },

  SUBSCRIPTION: {
    PAGINATION: "/api/admin/subscription/pagination",
    DELETE: "/api/admin/subscription/delete",
    FIND_BY_ID: "/api/admin/subscription/find-by-id",
    CHANGE_PLAN: "/api/admin/subscription/change-plan",
  },

  CONTACT: {
    PAGINATION: "/api/admin/contact/pagination",
    FIND_BY_ID: "/api/admin/contact/find-by-id",
    UPDATE_STATUS: "/api/admin/contact/update-status",
    DELETE: "/api/admin/contact/delete",
  },

  REVIEW: {
    PAGINATION: "/api/admin/review/pagination",
    FIND_BY_ID: "/api/admin/review/find-by-id",
    CREATE: "/api/admin/review/create",
    UPDATE: "/api/admin/review/update",
    DELETE: "/api/admin/review/delete",
    APPROVE: "/api/admin/review/approve",
    REJECT: "/api/admin/review/reject",
    PIN: "/api/admin/review/pin",
    UNPIN: "/api/admin/review/unpin",
  },

  TABLE: {
    PAGINATION: "/api/user/table/pagination",
    DELETE: "/api/user/table/delete",
  },

  ANALYTICS: {
    OVERVIEW: "/api/admin/analytics/overview",
    SYSTEM_STATS: "/api/admin/analytics/overview",
  },

  MUSIC_BACKGROUND: {
    PAGINATION: "/api/admin/music-background/pagination",
    FIND_BY_ID: "/api/admin/music-background/find-by-id",
    CREATE: "/api/admin/music-background/create",
    IMPORT_YOUTUBE: "/api/admin/music-background/import-youtube",
    UPDATE: "/api/admin/music-background/update",
    DELETE: "/api/admin/music-background/delete",
  },

  STOCK_ASSET: {
    PAGINATION: "/api/admin/stock-asset/pagination",
    FIND_BY_ID: "/api/admin/stock-asset/find-by-id",
    CREATE: "/api/admin/stock-asset/create",
    UPDATE: "/api/admin/stock-asset/update",
    DELETE: "/api/admin/stock-asset/delete",
  },

  ENV_MANAGER: {
    FILES: "/api/admin/env-manager/files",
    FILE: (project: string, environment: string) =>
      `/api/admin/env-manager/files/${project}/${environment}`,
  },
};
