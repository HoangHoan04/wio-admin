import {
  CheckCircle,
  Copy,
  Eye,
  FileSpreadsheet,
  Filter,
  Pencil,
  PlusCircle,
  Printer,
  RefreshCw,
  Save,
  Settings,
  Trash2,
  Upload,
  Video,
  X,
  XCircle,
} from "lucide-react";

interface ActionItem {
  key: string;
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?:
  | "default"
  | "outline"
  | "secondary"
  | "ghost"
  | "destructive"
  | "link";
  size?:
  | "default"
  | "xs"
  | "sm"
  | "lg"
  | "icon"
  | "icon-xs"
  | "icon-sm"
  | "icon-lg";
  className?: string;
}

export const CommonActions = {
  create: (onClick?: () => void, label = "Thêm mới"): ActionItem => ({
    key: "create",
    label,
    icon: <PlusCircle className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-emerald-600 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700",
  }),

  update: (onClick?: () => void, label = "Cập nhật"): ActionItem => ({
    key: "update",
    label,
    icon: <Pencil className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-amber-500 text-amber-600 bg-amber-50 hover:bg-amber-100 hover:text-amber-700",
  }),

  delete: (onClick?: () => void, label = "Xóa"): ActionItem => ({
    key: "delete",
    label,
    icon: <Trash2 className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-red-500 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700",
  }),

  refresh: (onClick?: () => void, label = "Làm mới"): ActionItem => ({
    key: "refresh",
    label,
    icon: <RefreshCw className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-sky-500 text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700",
  }),

  uploadExcel: (
    onClick?: () => void,
    label = "Nhập Excel",
  ): ActionItem => ({
    key: "upload-excel",
    label,
    icon: <FileSpreadsheet className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700",
  }),

  exportExcel: (onClick?: () => void, label = "Xuất Excel"): ActionItem => ({
    key: "export-excel",
    label,
    icon: <FileSpreadsheet className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700",
  }),

  exportPdf: (onClick?: () => void, label = "Xuất PDF"): ActionItem => ({
    key: "export-pdf",
    label,
    icon: <FileSpreadsheet className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-red-500 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700",
  }),

  save: (
    onClick?: () => void,
    label = "Lưu",
    loading?: boolean,
  ): ActionItem => ({
    key: "save",
    label,
    icon: <Save className="size-3.5" />,
    onClick,
    loading,
    variant: "outline",
    size: "sm",
    className:
      "border-sky-600 text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700",
  }),

  cancel: (onClick?: () => void, label = "Hủy"): ActionItem => ({
    key: "cancel",
    label,
    icon: <X className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-gray-400 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700",
  }),

  view: (onClick?: () => void, label = "Xem chi tiết"): ActionItem => ({
    key: "view",
    label,
    icon: <Eye className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-sky-500 text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700",
  }),

  copy: (onClick?: () => void, label = "Sao chép"): ActionItem => ({
    key: "copy",
    label,
    icon: <Copy className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-purple-500 text-purple-600 bg-purple-50 hover:bg-purple-100 hover:text-purple-700",
  }),

  print: (onClick?: () => void, label = "In"): ActionItem => ({
    key: "print",
    label,
    icon: <Printer className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-gray-400 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700",
  }),

  filter: (onClick?: () => void, label = "Bộ lọc"): ActionItem => ({
    key: "filter",
    label,
    icon: <Filter className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-sky-500 text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700",
  }),

  settings: (onClick?: () => void, label = "Cài đặt"): ActionItem => ({
    key: "settings",
    label,
    icon: <Settings className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-gray-400 text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-gray-700",
  }),

  approve: (onClick?: () => void, label = "Phê duyệt"): ActionItem => ({
    key: "approve",
    label,
    icon: <CheckCircle className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-emerald-500 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 hover:text-emerald-700",
  }),

  reject: (onClick?: () => void, label = "Từ chối"): ActionItem => ({
    key: "reject",
    label,
    icon: <XCircle className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-red-500 text-red-600 bg-red-50 hover:bg-red-100 hover:text-red-700",
  }),

  upload: (onClick?: () => void, label = "Tải lên"): ActionItem => ({
    key: "upload",
    label,
    icon: <Upload className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-sky-500 text-sky-600 bg-sky-50 hover:bg-sky-100 hover:text-sky-700",
  }),

  importYoutube: (
    onClick?: () => void,
    label = "Nhập từ YouTube",
  ): ActionItem => ({
    key: "import-youtube",
    label,
    icon: <Video className="size-3.5" />,
    onClick,
    variant: "outline",
    size: "sm",
    className:
      "border-rose-500 text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700",
  }),
};
