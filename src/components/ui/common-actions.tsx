import { PlusIcon } from "lucide-react";

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
  size?: "default" | "xs" | "sm" | "lg" | "icon" | "icon-xs" | "icon-sm" | "icon-lg";
  className?: string;
}

export const CommonActions = {
  create: (onClick: () => void, label = "Thêm mới"): ActionItem => ({
    key: "create",
    label,
    icon: <PlusIcon className="size-3.5" />,
    onClick,
    variant: "default" as const,
    size: "sm" as const,
  }),
};
