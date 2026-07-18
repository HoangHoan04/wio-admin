import {
  BarChart3,
  CreditCard,
  Heart,
  Home,
  Settings,
  Users,
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
          label: "Danh sách cặp đôi ",
          path: "/wedding-list",
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
        WISH_MANAGER: {
          key: "WISH_MANAGER",
          label: "Lời chúc",
          path: "/wish-manager",
          children: {},
        },
        PHOTO_WALL_MANAGER: {
          key: "PHOTO_WALL_MANAGER",
          label: "Photo Wall",
          path: "/photo-wall-manager",
          children: {},
        },
        MUSIC_BACKGROUND_MANAGER: {
          key: "MUSIC_BACKGROUND_MANAGER",
          label: "Âm nhạc nền",
          path: "/music-background-manager",
          children: {},
        },
        GUEST_MANAGER: {
          key: "GUEST_MANAGER",
          label: "Quản lý khách mờ",
          path: "/guest-manager",
          children: {},
        },
      },
    },

    SUBSCRIPTION_MANAGER: {
      key: "SUBSCRIPTION_MANAGER",
      label: "Subscription",
      icon: CreditCard,
      path: "/subscription-manager",
      children: {
        SUBSCRIPTION_LIST: {
          key: "SUBSCRIPTION_LIST",
          label: "Danh sách subscription",
          path: "/subscription-list",
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

    ANALYTICS: {
      key: "ANALYTICS",
      label: "Thống kê hệ thống",
      icon: BarChart3,
      path: "/analytics",
      children: {},
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
      },
    },
  },
};
