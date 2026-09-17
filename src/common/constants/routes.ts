import {
  BarChart3,
  CreditCard,
  HeartHandshake,
  Home,
  Image as ImageIcon,
  Layers,
  LifeBuoy,
  Mail,
  Music,
  Package,
  Settings,
  ShieldAlert,
  Star,
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

    INVITATION_MANAGER: {
      key: "INVITATION_MANAGER",
      label: "Quản lý thiệp",
      icon: Mail,
      path: "/invitation-manager",
      children: {
        INVITATION_LIST: {
          key: "INVITATION_LIST",
          label: "Danh sách thiệp",
          path: "/invitation-list",
          icon: Mail,
          children: {
            DETAIL_INVITATION: {
              key: "DETAIL_INVITATION",
              label: "Chi tiết thiệp",
              path: "/invitation/detail/:id",
              isShow: false,
            },
          },
        },
        TEMPLATE_MANAGER: {
          key: "TEMPLATE_MANAGER",
          label: "Mẫu thiệp",
          path: "/template-manager",
          icon: Layers,
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
        TEMPLATE_CATEGORY_MANAGER: {
          key: "TEMPLATE_CATEGORY_MANAGER",
          label: "Phong cách cưới",
          icon: HeartHandshake,
          path: "/template-category-manager",
        },
        PHOTO_WALL_MANAGER: {
          key: "PHOTO_WALL_MANAGER",
          label: "Tường ảnh",
          icon: ImageIcon,
          path: "/photo-wall-manager",
        },
        MUSIC_BACKGROUND_MANAGER: {
          key: "MUSIC_BACKGROUND_MANAGER",
          label: "Âm nhạc nền",
          icon: Music,
          path: "/music-background-manager",
        },
        STOCK_ASSET_MANAGER: {
          key: "STOCK_ASSET_MANAGER",
          label: "Kho sticker & họa tiết",
          icon: ImageIcon,
          path: "/stock-asset-manager",
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
          path: "/wish-manager",
        },
      },
    },

    SUBSCRIPTION_MANAGER: {
      key: "SUBSCRIPTION_MANAGER",
      label: "Dịch vụ & Thuê bao",
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
          label: "Danh sách thuê bao",
          path: "/subscription-list",
          icon: CreditCard,
          children: {
            DETAIL_SUBSCRIPTION: {
              key: "DETAIL_SUBSCRIPTION",
              label: "Chi tiết thuê bao",
              path: "/subscription/detail/:id",
              isShow: false,
            },
          },
        },
      },
    },

    REVIEW_MANAGER: {
      key: "REVIEW_MANAGER",
      label: "Đánh giá khách hàng",
      icon: Star,
      path: "/review-manager",
    },

    CONTACT_MANAGER: {
      key: "CONTACT_MANAGER",
      label: "Yêu cầu liên hệ",
      icon: LifeBuoy,
      path: "/contact-manager",
      children: {
        DETAIL_CONTACT: {
          key: "DETAIL_CONTACT",
          label: "Chi tiết liên hệ",
          path: "/contact-manager/detail/:id",
          isShow: false,
        },
      },
    },

    ANALYTICS: {
      key: "ANALYTICS",
      label: "Thống kê hệ thống",
      icon: BarChart3,
      path: "/analytics",
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
        NOTIFICATION_LOG: {
          key: "NOTIFICATION_LOG",
          label: "Lịch sử gửi thông báo",
          path: "/settings/notification-log",
        },
      },
    },
  },
};
