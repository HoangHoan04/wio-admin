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
  severity?: string;
  color?: string;
  colorClass?: string;
  value?: string;
  className?: string;
}

export function StatusTag({
  severity = "secondary",
  color,
  colorClass,
  value,
  className,
}: StatusTagProps) {
  const resolvedClass = colorClass
    ? colorClass
    : (severityStyles[severity] ?? severityStyles.secondary);

  const inlineStyle =
    !colorClass && color
      ? { color, borderColor: color, backgroundColor: `${color}1a` }
      : undefined;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border",
        resolvedClass,
        className,
      )}
      style={inlineStyle}
    >
      {value}
    </span>
  );
}
