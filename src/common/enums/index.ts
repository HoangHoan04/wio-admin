export const enumData = {
  PAGE: {
    PAGEINDEX: 1,
    PAGESIZE: 10,
    PAGESIZE_MAX: 1000000,
    LST_PAGESIZE: [10, 20, 50, 100],
    TOTAL: 0,
  },
  maxSizeUpload: 5 * 1024 * 1024,

  STATUS_FILTER: {
    ACTIVE: { code: "ACTIVE", name: "Đang hoạt động", value: false },
    INACTIVE: { code: "INACTIVE", name: "Ngưng hoạt động", value: true },
    ALL: { code: "ALL", name: "Tất cả", value: null },
  },

  GENDER: {
    MALE: { code: "MALE", name: "Nam" },
    FEMALE: { code: "FEMALE", name: "Nữ" },
    OTHER: { code: "OTHER", name: "Khác" },
  },

  ACTION_TYPE: {
    CREATE: {
      code: "CREATE",
      name: "Thêm mới",
      type: "ThemMoi",
      color: "green",
    },
    DELETE: { code: "DELETE", name: "Xoá bỏ", type: "XoaBo", color: "red" },
    UPDATE: {
      code: "UPDATE",
      name: "Cập nhật",
      type: "CapNhat",
      color: "yellow",
    },
    SYNC: { code: "SYNC", name: "Đồng bộ", type: "DongBo", color: "blue" },
    EDIT: {
      code: "EDIT",
      name: "Chỉnh sửa",
      type: "ChinhSua",
      color: "orange",
    },
    APPROVE: { code: "APPROVE", name: "Duyệt", type: "Duyet", color: "green" },
    SEND_APPROVE: {
      code: "SEND_APPROVE",
      name: "Gửi duyệt",
      type: "GuiDuyet",
      color: "blue",
    },
    REJECT: { code: "REJECT", name: "Từ chối", type: "TuChoi", color: "red" },
    CANCEL: { code: "CANCEL", name: "Huỷ", type: "Huy", color: "gray" },
    IMPORT_EXCEL: {
      code: "IMPORT_EXCEL",
      name: "Nhập excel",
      type: "NhapExcel",
      color: "purple",
    },
    ACTIVATE: {
      code: "ACTIVATE",
      name: "Kích hoạt",
      type: "KichHoat",
      color: "green",
    },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      type: "NgungHoatDong",
      color: "gray",
    },
    RESTORE: {
      code: "RESTORE",
      name: "Khôi phục",
      type: "KhoiPhuc",
      color: "blue",
    },
    LOGIN: {
      code: "LOGIN",
      name: "Đăng nhập",
      type: "DangNhap",
      color: "green",
    },
    LOGOUT: {
      code: "LOGOUT",
      name: "Đăng xuất",
      type: "DangXuat",
      color: "red",
    },
    REGISTER: {
      code: "REGISTER",
      name: "Đăng ký",
      type: "DangKy",
      color: "blue",
    },
    UPLOAD_FILE: {
      code: "UPLOAD_FILE",
      name: "Tải file lên",
      type: "TaiFileLen",
      color: "purple",
    },
  },

  THEME_CODE: {
    BOHO_FLORAL_BROWN: {
      code: "BOHO_FLORAL_BROWN",
      name: "Hoa mộc Lan - Nâu",
      slug: "hoa-moc-lan-nau",
    },
    BOHO_FLORAL_GREEN: {
      code: "BOHO_FLORAL_GREEN",
      name: "Hoa mộc Lan - Xanh",
      slug: "hoa-moc-lan-xanh",
    },
    BOHO_FLORAL_PINK: {
      code: "BOHO_FLORAL_PINK",
      name: "Hoa mộc Lan - Hồng",
      slug: "hoa-moc-lan-hong",
    },
    DRAGON_PHOENIX_BLUE: {
      code: "DRAGON_PHOENIX_BLUE",
      name: "Long phụng - Xanh",
      slug: "long-phung-xanh",
    },
    DRAGON_PHOENIX_GREEN: {
      code: "DRAGON_PHOENIX_GREEN",
      name: "Long phụng - Xanh lá",
      slug: "long-phung-xanh-la",
    },
    DRAGON_PHOENIX_RED: {
      code: "DRAGON_PHOENIX_RED",
      name: "Long phụng - Đỏ",
      slug: "long-phung-do",
    },
    ROYAL_BLUE: {
      code: "ROYAL_BLUE",
      name: "Hoàng gia - Xanh",
      slug: "hoang-gia-xanh",
    },
    ROYAL_GREEN: {
      code: "ROYAL_GREEN",
      name: "Hoàng gia - Xanh lá",
      slug: "hoang-gia-xanh-la",
    },
    ROYAL_RED: {
      code: "ROYAL_RED",
      name: "Hoàng gia - Đỏ",
      slug: "hoang-gia-do",
    },
    RED_DOUBLE_HAPPINESS: {
      code: "RED_DOUBLE_HAPPINESS",
      name: "Song hỷ - Đỏ",
      slug: "song-hy-do",
    },
  },

  WEDDING_STATUS: {
    DRAFT: { code: "DRAFT", name: "Nháp", color: "gray" },
    PUBLISHED: { code: "PUBLISHED", name: "Đã xuất bản", color: "green" },
    ARCHIVED: { code: "ARCHIVED", name: "Đã lưu trữ", color: "blue" },
  },

  MUSIC_TYPE: {
    UPLOAD: { code: "UPLOAD", name: "Tải lên" },
    YOUTUBE: { code: "YOUTUBE", name: "YouTube" },
    SPOTIFY: { code: "SPOTIFY", name: "Spotify" },
  },

  GUEST_SIDE: {
    GROOM: { code: "GROOM", name: "Bên chú rể" },
    BRIDE: { code: "BRIDE", name: "Bên cô dâu" },
    BOTH: { code: "BOTH", name: "Cả hai bên" },
  },

  RSVP_STATUS: {
    PENDING: { code: "PENDING", name: "Chưa phản hồi" },
    ATTENDING: { code: "ATTENDING", name: "Tham dự" },
    DECLINED: { code: "DECLINED", name: "Từ chối" },
  },

  NOTIF_CHANNEL: {
    ZALO: { code: "ZALO", name: "Zalo" },
    SMS: { code: "SMS", name: "SMS" },
    EMAIL: { code: "EMAIL", name: "Email" },
  },

  NOTIF_TYPE: {
    INVITE: { code: "INVITE", name: "Lời mời" },
    REMINDER: { code: "REMINDER", name: "Nhắc nhở" },
    THANK_YOU: { code: "THANK_YOU", name: "Cảm ơn" },
    RSVP_CONFIRM: { code: "RSVP_CONFIRM", name: "Xác nhận RSVP" },
  },

  NOTIF_STATUS: {
    PENDING: { code: "PENDING", name: "Chờ gửi" },
    SENT: { code: "SENT", name: "Đã gửi" },
    FAILED: { code: "FAILED", name: "Gửi thất bại" },
    CANCELLED: { code: "CANCELLED", name: "Đã hủy" },
  },

  SUB_STATUS: {
    ACTIVE: { code: "ACTIVE", name: "Đang hoạt động" },
    EXPIRED: { code: "EXPIRED", name: "Hết hạn" },
    CANCELLED: { code: "CANCELLED", name: "Đã hủy" },
  },

  MUSIC_PROCESS_STATUS: {
    PENDING: { code: "PENDING", name: "Chờ xử lý" },
    PROCESSING: { code: "PROCESSING", name: "Đang xử lý" },
    COMPLETED: { code: "COMPLETED", name: "Hoàn tất" },
    FAILED: { code: "FAILED", name: "Thất bại" },
  },
};
