export const enumData = {
  PAGE: {
    PAGEINDEX: 1,
    PAGESIZE: 10,
    PAGESIZE_MAX: 1000000,
    LST_PAGESIZE: [10, 20, 50, 100],
    TOTAL: 0,
  },
  maxSizeUpload: 5 * 1024 * 1024,

  GENDER: {
    MALE: { code: "MALE", name: "Nam" },
    FEMALE: { code: "FEMALE", name: "Nữ" },
    OTHER: { code: "OTHER", name: "Khác" },
  },

  ACTION_TYPE: {
    CREATE: { code: "CREATE", name: "Thêm mới", type: "ThemMoi" },
    DELETE: { code: "DELETE", name: "Xoá bỏ", type: "XoaBo" },
    UPDATE: { code: "UPDATE", name: "Cập nhật", type: "CapNhat" },
    SYNC: { code: "SYNC", name: "Đồng bộ", type: "DongBo" },
    EDIT: { code: "EDIT", name: "Chỉnh sửa", type: "ChinhSua" },
    APPROVE: { code: "APPROVE", name: "Duyệt", type: "Duyet" },
    SEND_APPROVE: { code: "SEND_APPROVE", name: "Gửi duyệt", type: "GuiDuyet" },
    REJECT: { code: "REJECT", name: "Từ chối", type: "TuChoi" },
    CANCEL: { code: "CANCEL", name: "Huỷ", type: "Huy" },
    IMPORT_EXCEL: {
      code: "IMPORT_EXCEL",
      name: "Nhập excel",
      type: "NhapExcel",
    },
    ACTIVATE: { code: "ACTIVATE", name: "Kích hoạt", type: "KichHoat" },
    DEACTIVATE: {
      code: "DEACTIVATE",
      name: "Ngưng hoạt động",
      type: "NgungHoatDong",
    },
    RESTORE: { code: "RESTORE", name: "Khôi phục", type: "KhoiPhuc" },
    LOGIN: { code: "LOGIN", name: "Đăng nhập", type: "DangNhap" },
    LOGOUT: { code: "LOGOUT", name: "Đăng xuất", type: "DangXuat" },
    REGISTER: { code: "REGISTER", name: "Đăng ký", type: "DangKy" },
    UPLOAD_FILE: {
      code: "UPLOAD_FILE",
      name: "Tải file lên",
      type: "TaiFileLen",
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
    DRAFT: {
      code: "DRAFT",
      name: "Nháp",
      className: "bg-yellow-100 text-yellow-800",
    },
    PUBLISHED: {
      code: "PUBLISHED",
      name: "Đã xuất bản",
      className: "bg-green-100 text-green-800",
    },
    ARCHIVED: {
      code: "ARCHIVED",
      name: "Đã lưu trữ",
      className: "bg-gray-100 text-gray-800",
    },
  },
};
