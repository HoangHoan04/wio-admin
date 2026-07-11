import { cn } from "@/lib/utils";

const severityStyles: Record<string, string> = {
  success:
    "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  info: "bg-sky-500/10 text-sky-600 border-sky-500/20 dark:text-sky-400",
  warning:
    "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  danger: "bg-red-500/10 text-red-600 border-red-500/20 dark:text-red-400",
  secondary: "bg-muted text-muted-foreground border-border",
};

interface StatusTagProps {
  severity?: "success" | "info" | "warning" | "danger" | "secondary";
  value: string;
  className?: string;
}

export function StatusTag({
  severity = "secondary",
  value,
  className,
}: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border",
        severityStyles[severity] || severityStyles.secondary,
        className,
      )}
    >
      {value}
    </span>
  );
}
