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
    APPROVE: {
      code: "APPROVE",
      name: "Duyệt",
      type: "Duyet",
      color: "emerald",
    },
    ACTIVATE: {
      code: "ACTIVATE",
      name: "Kích hoạt",
      type: "KichHoat",
      color: "teal",
    },
    LOGIN: {
      code: "LOGIN",
      name: "Đăng nhập",
      type: "DangNhap",
      color: "lime",
    },

    UPDATE: {
      code: "UPDATE",
      name: "Cập nhật",
      type: "CapNhat",
      color: "amber",
    },
    EDIT: {
      code: "EDIT",
      name: "Chỉnh sửa",
      type: "ChinhSua",
      color: "orange",
    },

    DELETE: {
      code: "DELETE",
      name: "Xoá bỏ",
      type: "XoaBo",
      color: "red",
    },
    REJECT: {
      code: "REJECT",
      name: "Từ chối",
      type: "TuChoi",
      color: "rose",
    },
    CANCEL: {
      code: "CANCEL",
      name: "Huỷ",
      type: "Huy",
      color: "slate",
    },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      type: "NgungHoatDong",
      color: "gray",
    },
    LOGOUT: {
      code: "LOGOUT",
      name: "Đăng xuất",
      type: "DangXuat",
      color: "zinc",
    },

    SYNC: {
      code: "SYNC",
      name: "Đồng bộ",
      type: "DongBo",
      color: "blue",
    },
    SEND_APPROVE: {
      code: "SEND_APPROVE",
      name: "Gửi duyệt",
      type: "GuiDuyet",
      color: "cyan",
    },
    RESTORE: {
      code: "RESTORE",
      name: "Khôi phục",
      type: "KhoiPhuc",
      color: "sky",
    },
    REGISTER: {
      code: "REGISTER",
      name: "Đăng ký",
      type: "DangKy",
      color: "indigo",
    },

    IMPORT_EXCEL: {
      code: "IMPORT_EXCEL",
      name: "Nhập excel",
      type: "NhapExcel",
      color: "purple",
    },
    UPLOAD_FILE: {
      code: "UPLOAD_FILE",
      name: "Tải file lên",
      type: "TaiFileLen",
      color: "violet",
    },
  },

  THEME_CODE: {
    BOHO_FLORAL_BROWN: {
      code: "BOHO_FLORAL_BROWN",
      name: "Hoa cỏ - Nâu",
      slug: "hoa-moc-lan-nau",
    },
    BOHO_FLORAL_GREEN: {
      code: "BOHO_FLORAL_GREEN",
      name: "Hoa cỏ - Xanh",
      slug: "hoa-moc-lan-xanh",
    },
    BOHO_FLORAL_PINK: {
      code: "BOHO_FLORAL_PINK",
      name: "Hoa cỏ - Hồng",
      slug: "hoa-moc-lan-hong",
    },
    DRAGON_PHOENIX_RED: {
      code: "DRAGON_PHOENIX_RED",
      name: "Long phụng - Đỏ",
      slug: "long-phung-do",
    },
    RED_DOUBLE_HAPPINESS: {
      code: "RED_DOUBLE_HAPPINESS",
      name: "Song hỷ - Đỏ truyền thống",
      slug: "song-hy-do-truyen-thong",
    },
    ROYAL_RED: {
      code: "ROYAL_RED",
      name: "Hoàng gia - Đỏ nhung",
      slug: "hoang-gia-do-nhung",
    },
    BIRTHDAY_CORAL: {
      code: "BIRTHDAY_CORAL",
      name: "Sinh nhật - Coral",
      slug: "sinh-nhat-coral",
    },
    CUSTOM_DESIGN: {
      code: "CUSTOM_DESIGN",
      name: "Tự thiết kế",
      slug: "tu-thiet-ke",
    },
  },

  CARD_TYPE: {
    WEDDING: { code: "WEDDING", name: "Thiệp cưới", color: "#8B2942" },
    BIRTHDAY: { code: "BIRTHDAY", name: "Thiệp sinh nhật", color: "#E25C3A" },
    GRADUATION: {
      code: "GRADUATION",
      name: "Thiệp tốt nghiệp",
      color: "#1E3A5F",
    },
    BABY: { code: "BABY", name: "Thôi nôi / đầy tháng", color: "#D4A0A7" },
    HOUSEWARMING: {
      code: "HOUSEWARMING",
      name: "Thiệp tân gia",
      color: "#C45C26",
    },
    ANNIVERSARY: {
      code: "ANNIVERSARY",
      name: "Thiệp kỷ niệm",
      color: "#B8860B",
    },
    CUSTOM: { code: "CUSTOM", name: "Sự kiện khác", color: "#C45C26" },
  },

  INVITATION_STATUS: {
    DRAFT: { code: "DRAFT", name: "Nháp", color: "gray" },
    PUBLISHED: { code: "PUBLISHED", name: "Đã xuất bản", color: "green" },
    ARCHIVED: { code: "ARCHIVED", name: "Đã lưu trữ", color: "blue" },
  },

  MUSIC_TYPE: {
    UPLOAD: { code: "UPLOAD", name: "Tải lên" },
    YOUTUBE: { code: "YOUTUBE", name: "YouTube" },
    SPOTIFY: { code: "SPOTIFY", name: "Spotify" },
  },

  GUEST_GROUP: {
    GROOM: { code: "GROOM", name: "Bên chú rể" },
    BRIDE: { code: "BRIDE", name: "Bên cô dâu" },
    BOTH: { code: "BOTH", name: "Cả hai bên" },
    FAMILY: { code: "FAMILY", name: "Gia đình" },
    FRIENDS: { code: "FRIENDS", name: "Bạn bè" },
    WORK: { code: "WORK", name: "Đồng nghiệp" },
    TEACHERS: { code: "TEACHERS", name: "Thầy cô" },
    PATERNAL: { code: "PATERNAL", name: "Bên nội" },
    MATERNAL: { code: "MATERNAL", name: "Bên ngoại" },
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
    PENDING: { code: "PENDING", name: "Chờ xử lý", color: "gray" },
    PROCESSING: { code: "PROCESSING", name: "Đang xử lý", color: "warning" },
    COMPLETED: { code: "COMPLETED", name: "Hoàn tất", color: "success" },
    FAILED: { code: "FAILED", name: "Thất bại", color: "danger" },
  },

  STOCK_ASSET_KIND: {
    STICKER: { code: "sticker", name: "Sticker" },
    EMOJI: { code: "emoji", name: "Emoji" },
    ORNAMENT: { code: "ornament", name: "Họa tiết" },
  },

  STOCK_ASSET_CATEGORY: {
    HEARTS: { code: "hearts", name: "Trái tim" },
    FLOWERS: { code: "flowers", name: "Hoa" },
    PARTY: { code: "party", name: "Tiệc" },
    WEDDING: { code: "wedding", name: "Cưới" },
    GRADUATION: { code: "graduation", name: "Tốt nghiệp" },
    BIRTHDAY: { code: "birthday", name: "Sinh nhật" },
    BABY: { code: "baby", name: "Baby" },
    NATURE: { code: "nature", name: "Thiên nhiên" },
    STARS: { code: "stars", name: "Sao & lấp lánh" },
    ORNAMENT: { code: "ornament", name: "Họa tiết" },
  },
};
