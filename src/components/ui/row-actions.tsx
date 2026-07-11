import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

interface RowActionsProps {
  actions: ActionItem[];
  direction?: "horizontal" | "vertical";
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "end";
  wrap?: boolean;
  gap?: "none" | "small" | "medium" | "large";
  className?: string;
}

const gapMap: Record<string, string> = {
  none: "gap-0",
  small: "gap-1.5",
  medium: "gap-3",
  large: "gap-5",
};

const justifyMap: Record<string, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
};

const alignMap: Record<string, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

export function RowActions({
  actions,
  direction = "horizontal",
  align = "center",
  justify = "start",
  wrap = false,
  gap = "small",
  className,
}: RowActionsProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "vertical" ? "flex-col" : "flex-row",
        gapMap[gap],
        justifyMap[justify],
        alignMap[align],
        wrap && "flex-wrap",
        className,
      )}
    >
      {actions.map((action) => (
        <Button
          key={action.key}
          variant={action.variant || "outline"}
          size={action.size || "sm"}
          disabled={action.disabled || action.loading}
          onClick={action.onClick}
          className={cn("gap-1.5", action.className)}
        >
          {action.loading ? (
            <span className="size-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            action.icon
          )}
          {action.label && <span>{action.label}</span>}
        </Button>
      ))}
    </div>
  );
}
