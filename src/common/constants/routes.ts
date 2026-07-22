import {
  BarChart3,
  CreditCard,
  Heart,
  Home,
  Image as ImageIcon,
  LifeBuoy,
  Megaphone,
  Music,
  Package,
  Receipt,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Ticket,
  Users,
  UserSquare2,
} from "lucide-react";

export const ROUTES = {
  AUTH: {
    LOGIN: {
      key: "LOGIN",
      label: "Đăng nhập",
      path: "/login",
      isShow: false,
    },
  },

  MAIN: {
    HOME: {
      key: "HOME",
      label: "Trang chủ",
      path: "/",
      icon: Home,
    },

    CUSTOMER_MANAGER: {
      key: "CUSTOMER_MANAGER",
      label: "Quản lý khách hàng",
      icon: Users,
      path: "/customer-manager",
      children: {
        DETAIL_CUSTOMER: {
          key: "DETAIL_CUSTOMER",
          label: "Chi tiết khách hàng",
          path: "/customer-manager/detail/:id",
          isShow: false,
        },
      },
    },

    WEDDING_MANAGER: {
      key: "WEDDING_MANAGER",
      label: "Quản lý đám cưới",
      icon: Heart,
      path: "/wedding-manager",
      children: {
        WEDDING_LIST: {
          key: "WEDDING_LIST",
          label: "Danh sách cặp đôi",
          path: "/wedding-list",
          icon: Users,
          children: {
            DETAIL_WEDDING: {
              key: "DETAIL_WEDDING",
              label: "Chi tiết cặp đôi",
              path: "/wedding/detail/:id",
              isShow: false,
            },
          },
        },
        TEMPLATE_MANAGER: {
          key: "TEMPLATE_MANAGER",
          label: "Template thiệp cưới",
          path: "/template-manager",
          icon: ImageIcon,
          children: {
            ADD_TEMPLATE: {
              key: "ADD_TEMPLATE",
              label: "Thêm template",
              path: "/template/add",
              isShow: false,
            },
            EDIT_TEMPLATE: {
              key: "EDIT_TEMPLATE",
              label: "Chỉnh sửa template",
              path: "/template/edit/:id",
              isShow: false,
            },
            DETAIL_TEMPLATE: {
              key: "DETAIL_TEMPLATE",
              label: "Chi tiết template",
              path: "/template/detail/:id",
              isShow: false,
            },
          },
        },
        PHOTO_WALL_MANAGER: {
          key: "PHOTO_WALL_MANAGER",
          label: "Photo Wall",
          icon: ImageIcon,
          path: "/photo-wall-manager",
        },
        MUSIC_BACKGROUND_MANAGER: {
          key: "MUSIC_BACKGROUND_MANAGER",
          label: "Âm nhạc nền",
          icon: Music,
          path: "/music-background-manager",
        },
        GUEST_MANAGER: {
          key: "GUEST_MANAGER",
          label: "Quản lý khách mời",
          icon: UserSquare2,
          path: "/guest-manager",
        },
        MODERATION_QUEUE: {
          key: "MODERATION_QUEUE",
          label: "Kiểm duyệt lời chúc",
          icon: ShieldAlert,
          path: "/moderation-queue",
        },
      },
    },

    SUBSCRIPTION_MANAGER: {
      key: "SUBSCRIPTION_MANAGER",
      label: "Subscription",
      icon: CreditCard,
      path: "/subscription-manager",
      children: {
        PLAN_MANAGER: {
          key: "PLAN_MANAGER",
          label: "Gói dịch vụ",
          icon: Package,
          path: "/plan-manager",
          children: {
            ADD_PLAN: {
              key: "ADD_PLAN",
              label: "Thêm gói dịch vụ",
              path: "/plan/add",
              isShow: false,
            },
            EDIT_PLAN: {
              key: "EDIT_PLAN",
              label: "Chỉnh sửa gói dịch vụ",
              path: "/plan/edit/:id",
              isShow: false,
            },
            DETAIL_PLAN: {
              key: "DETAIL_PLAN",
              label: "Chi tiết gói dịch vụ",
              path: "/plan/detail/:id",
              isShow: false,
            },
          },
        },
        SUBSCRIPTION_LIST: {
          key: "SUBSCRIPTION_LIST",
          label: "Danh sách subscription",
          path: "/subscription-list",
          icon: CreditCard,
          children: {
            DETAIL_SUBSCRIPTION: {
              key: "DETAIL_SUBSCRIPTION",
              label: "Chi tiết subscription",
              path: "/subscription/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    TRANSACTION_MANAGER: {
      key: "TRANSACTION_MANAGER",
      label: "Giao dịch & Thanh toán",
      icon: Receipt,
      path: "/transaction-manager",
      children: {
        DETAIL_TRANSACTION: {
          key: "DETAIL_TRANSACTION",
          label: "Chi tiết giao dịch",
          path: "/transaction/detail/:id",
          isShow: false,
        },
        REFUND_REQUEST: {
          key: "REFUND_REQUEST",
          label: "Yêu cầu hoàn tiền",
          path: "/transaction/refund-request",
          isShow: false,
        },
      },
    },

    PROMOTION_MANAGER: {
      key: "PROMOTION_MANAGER",
      label: "Mã giảm giá",
      icon: Ticket,
      path: "/promotion-manager",
      children: {
        ADD_PROMOTION: {
          key: "ADD_PROMOTION",
          label: "Thêm mã giảm giá",
          path: "/promotion/add",
          isShow: false,
        },
        EDIT_PROMOTION: {
          key: "EDIT_PROMOTION",
          label: "Chỉnh sửa mã giảm giá",
          path: "/promotion/edit/:id",
          isShow: false,
        },
        DETAIL_PROMOTION: {
          key: "DETAIL_PROMOTION",
          label: "Chi tiết mã giảm giá",
          path: "/promotion/detail/:id",
          isShow: false,
        },
      },
    },

    STAFF_MANAGER: {
      key: "STAFF_MANAGER",
      label: "Nhân sự & Phân quyền",
      icon: ShieldCheck,
      path: "/staff-manager",
      children: {
        ADD_STAFF: {
          key: "ADD_STAFF",
          label: "Thêm nhân sự",
          path: "/staff/add",
          isShow: false,
        },
        DETAIL_STAFF: {
          key: "DETAIL_STAFF",
          label: "Chi tiết nhân sự",
          path: "/staff/detail/:id",
          isShow: false,
        },
        ROLE_PERMISSION: {
          key: "ROLE_PERMISSION",
          label: "Phân quyền vai trò",
          path: "/staff/role-permission",
          isShow: false,
        },
      },
    },

    SUPPORT_TICKET: {
      key: "SUPPORT_TICKET",
      label: "Hỗ trợ khách hàng",
      icon: LifeBuoy,
      path: "/support-ticket",
      children: {
        DETAIL_TICKET: {
          key: "DETAIL_TICKET",
          label: "Chi tiết yêu cầu hỗ trợ",
          path: "/support-ticket/detail/:id",
          isShow: false,
        },
      },
    },

    MARKETING_CMS: {
      key: "MARKETING_CMS",
      label: "Nội dung Marketing",
      icon: Megaphone,
      path: "/marketing-cms",
      children: {
        BANNER_MANAGER: {
          key: "BANNER_MANAGER",
          label: "Banner trang chủ",
          path: "/marketing-cms/banner",
          isShow: false,
        },
        BLOG_MANAGER: {
          key: "BLOG_MANAGER",
          label: "Bài viết / Blog",
          path: "/marketing-cms/blog",
          isShow: false,
        },
        FAQ_MANAGER: {
          key: "FAQ_MANAGER",
          label: "Câu hỏi thường gặp",
          path: "/marketing-cms/faq",
          isShow: false,
        },
        TESTIMONIAL_MANAGER: {
          key: "TESTIMONIAL_MANAGER",
          label: "Đánh giá khách hàng",
          path: "/marketing-cms/testimonial",
          isShow: false,
        },
      },
    },

    ANALYTICS: {
      key: "ANALYTICS",
      label: "Thống kê hệ thống",
      icon: BarChart3,
      path: "/analytics",
      children: {
        REVENUE_REPORT: {
          key: "REVENUE_REPORT",
          label: "Báo cáo doanh thu",
          path: "/analytics/revenue",
          isShow: false,
        },
        WEDDING_REPORT: {
          key: "WEDDING_REPORT",
          label: "Báo cáo đám cưới mới",
          path: "/analytics/wedding",
          isShow: false,
        },
        CONVERSION_REPORT: {
          key: "CONVERSION_REPORT",
          label: "Tỷ lệ nâng cấp gói",
          path: "/analytics/conversion",
          isShow: false,
        },
        TEMPLATE_REPORT: {
          key: "TEMPLATE_REPORT",
          label: "Template phổ biến",
          path: "/analytics/template",
          isShow: false,
        },
      },
    },

    SETTINGS: {
      key: "SETTINGS",
      label: "Cài đặt",
      icon: Settings,
      path: "/settings",
      children: {
        AUDIT_LOG: {
          key: "AUDIT_LOG",
          label: "Lịch sử hoạt động",
          path: "/settings/audit-log",
        },
        PAYMENT_GATEWAY: {
          key: "PAYMENT_GATEWAY",
          label: "Cấu hình cổng thanh toán",
          path: "/settings/payment-gateway",
        },
        NOTIFICATION_CONFIG: {
          key: "NOTIFICATION_CONFIG",
          label: "Cấu hình Email/SMS",
          path: "/settings/notification-config",
        },
        DOMAIN_CONFIG: {
          key: "DOMAIN_CONFIG",
          label: "Cấu hình domain riêng",
          path: "/settings/domain-config",
        },
        BANK_CONFIG: {
          key: "BANK_CONFIG",
          label: "Tài khoản nhận tiền",
          path: "/settings/bank-config",
        },
      },
    },
  },
};
