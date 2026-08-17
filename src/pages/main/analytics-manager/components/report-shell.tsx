import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ArrowLeft, RefreshCw, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

type KpiTone = "rose" | "emerald" | "sky" | "amber" | "violet" | "indigo";

const toneMap: Record<KpiTone, { ring: string; icon: string; bg: string }> = {
  rose: {
    ring: "ring-rose-500/20",
    icon: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  emerald: {
    ring: "ring-emerald-500/20",
    icon: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  sky: {
    ring: "ring-sky-500/20",
    icon: "text-sky-500",
    bg: "bg-sky-500/10",
  },
  amber: {
    ring: "ring-amber-500/20",
    icon: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  violet: {
    ring: "ring-violet-500/20",
    icon: "text-violet-500",
    bg: "bg-violet-500/10",
  },
  indigo: {
    ring: "ring-indigo-500/20",
    icon: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
};

interface ReportHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  actions?: ReactNode;
}

export function ReportHero({ title, subtitle, badge, actions }: ReportHeroProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-violet-500/5 p-6 md:p-8">
      <div className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-1/4 size-36 rounded-full bg-violet-500/10 blur-3xl" />
      <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2">
          {badge ? (
            <Badge variant="secondary" className="gap-1.5 rounded-full px-3 py-1">
              <Sparkles className="size-3.5 text-primary" />
              {badge}
            </Badge>
          ) : null}
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          <p className="max-w-3xl text-sm text-muted-foreground md:text-base">
            {subtitle}
          </p>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

interface ReportBackHeaderProps {
  title: string;
  subtitle?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function ReportBackHeader({
  title,
  subtitle,
  onRefresh,
  isRefreshing,
}: ReportBackHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <Button
          variant="outline"
          size="sm"
          className="mt-0.5 shrink-0 gap-1.5 bg-background/80"
          onClick={() => navigate("/analytics")}
        >
          <ArrowLeft className="size-4" />
          Báo cáo
        </Button>
        <div>
          <h1 className="text-xl font-bold md:text-2xl">{title}</h1>
          {subtitle ? (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          ) : null}
        </div>
      </div>
      {onRefresh ? (
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={onRefresh}
          disabled={isRefreshing}
        >
          <RefreshCw className={cn("size-4", isRefreshing && "animate-spin")} />
          Làm mới
        </Button>
      ) : null}
    </div>
  );
}

interface KpiCardProps {
  label: string;
  value: string | number;
  hint?: string;
  delta?: string;
  tone?: KpiTone;
  icon: React.ComponentType<{ className?: string }>;
}

export function KpiCard({
  label,
  value,
  hint,
  delta,
  tone = "sky",
  icon: Icon,
}: KpiCardProps) {
  const style = toneMap[tone];

  return (
    <Card className={cn("overflow-hidden ring-1", style.ring)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-2">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {label}
            </p>
            <p className="text-2xl font-bold tracking-tight tabular-nums md:text-3xl">
              {typeof value === "number" ? value.toLocaleString("vi-VN") : value}
            </p>
            {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
            {delta ? (
              <p className="text-xs font-medium text-emerald-600">{delta}</p>
            ) : null}
          </div>
          <div
            className={cn(
              "flex size-11 shrink-0 items-center justify-center rounded-xl",
              style.bg,
            )}
          >
            <Icon className={cn("size-5", style.icon)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export function ChartCard({
  title,
  description,
  children,
  className,
  action,
}: ChartCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-start justify-between gap-3 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-base">{title}</CardTitle>
          {description ? (
            <p className="text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {action}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

export function ReportSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-32 rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: cards }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-xl lg:col-span-8" />
        <Skeleton className="h-80 rounded-xl lg:col-span-4" />
        <Skeleton className="h-80 rounded-xl lg:col-span-6" />
        <Skeleton className="h-80 rounded-xl lg:col-span-6" />
      </div>
    </div>
  );
}

export function ChartEmpty({ message = "Chưa có dữ liệu" }: { message?: string }) {
  return (
    <div className="flex h-[280px] items-center justify-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground">
      {message}
    </div>
  );
}
