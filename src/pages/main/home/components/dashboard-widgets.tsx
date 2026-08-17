import { ROUTES } from "@/common/constants";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { OverviewStats } from "@/hooks/analytics";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  BarChart3,
  Heart,
  ImageIcon,
  Mail,
  MessageCircleHeart,
  Settings,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

type StatTone = "rose" | "emerald" | "sky" | "amber" | "violet";

const toneStyles: Record<
  StatTone,
  { icon: string; bg: string; ring: string }
> = {
  rose: {
    icon: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    ring: "ring-rose-500/20",
  },
  emerald: {
    icon: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    ring: "ring-emerald-500/20",
  },
  sky: {
    icon: "text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
    ring: "ring-sky-500/20",
  },
  amber: {
    icon: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    ring: "ring-amber-500/20",
  },
  violet: {
    icon: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    ring: "ring-violet-500/20",
  },
};

interface StatCardProps {
  label: string;
  value: number;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  tone: StatTone;
}

export function StatCard({ label, value, hint, icon: Icon, tone }: StatCardProps) {
  const style = toneStyles[tone];

  return (
    <Card className={cn("relative overflow-hidden ring-1", style.ring)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-2 min-w-0">
            <p className="text-sm font-medium text-muted-foreground truncate">
              {label}
            </p>
            <p className="text-3xl font-bold tracking-tight tabular-nums">
              {value.toLocaleString("vi-VN")}
            </p>
            {hint ? (
              <p className="text-xs text-muted-foreground">{hint}</p>
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

interface StatusLegendProps {
  invitations: OverviewStats["invitations"];
}

export function StatusLegend({ invitations }: StatusLegendProps) {
  const total = invitations?.total ?? 0;
  const items = [
    {
      label: "Đã xuất bản",
      value: invitations?.published ?? 0,
      color: "bg-emerald-500",
    },
    {
      label: "Bản nháp",
      value: invitations?.draft ?? 0,
      color: "bg-sky-500",
    },
    {
      label: "Lưu trữ",
      value: invitations?.archived ?? 0,
      color: "bg-slate-400",
    },
  ];

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const pct = total > 0 ? Math.round((item.value / total) * 100) : 0;
        return (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className={cn("size-2.5 rounded-full", item.color)} />
                <span>{item.label}</span>
              </div>
              <span className="font-medium tabular-nums">
                {item.value}{" "}
                <span className="text-muted-foreground font-normal">({pct}%)</span>
              </span>
            </div>
            <Progress value={pct} indicatorClassName={item.color} />
          </div>
        );
      })}
    </div>
  );
}

interface EngagementPanelProps {
  guests?: OverviewStats["guests"];
  wishes?: OverviewStats["wishes"];
  users?: OverviewStats["users"];
}

export function EngagementPanel({ guests, wishes, users }: EngagementPanelProps) {
  const guestTotal = guests?.total ?? 0;
  const attending = guests?.attending ?? 0;
  const rsvpRate =
    guestTotal > 0 ? Math.round((attending / guestTotal) * 100) : 0;

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <div className="rounded-xl border bg-muted/30 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Tỷ lệ RSVP</span>
          <Badge variant="secondary">{rsvpRate}%</Badge>
        </div>
        <Progress value={rsvpRate} indicatorClassName="bg-emerald-500" />
        <p className="text-xs text-muted-foreground">
          {attending.toLocaleString("vi-VN")} / {guestTotal.toLocaleString("vi-VN")}{" "}
          khách xác nhận tham dự
        </p>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircleHeart className="size-4 text-amber-500" />
          Lời chúc chờ duyệt
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {(wishes?.pending ?? 0).toLocaleString("vi-VN")}
        </p>
        <Button variant="link" className="h-auto p-0 text-xs" asChild>
          <Link to="/wish-manager">
            Xem danh sách <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserPlus className="size-4 text-violet-500" />
          User mới (7 ngày)
        </div>
        <p className="text-2xl font-bold tabular-nums">
          {(users?.newLast7Days ?? 0).toLocaleString("vi-VN")}
        </p>
        <Button variant="link" className="h-auto p-0 text-xs" asChild>
          <Link to={ROUTES.MAIN.CUSTOMER_MANAGER.path}>
            Quản lý khách hàng <ArrowRight className="size-3" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

const quickActions = [
  {
    label: "Danh sách thiệp",
    desc: "Theo dõi trạng thái xuất bản",
    path: "/invitation-list",
    icon: Mail,
    tone: "text-rose-500 bg-rose-500/10",
  },
  {
    label: "Mẫu thiệp",
    desc: "Quản lý template & theme",
    path: "/template-manager",
    icon: ImageIcon,
    tone: "text-violet-500 bg-violet-500/10",
  },
  {
    label: "Lời chúc",
    desc: "Duyệt lời chúc khách gửi",
    path: "/wish-manager",
    icon: Heart,
    tone: "text-amber-500 bg-amber-500/10",
  },
  {
    label: "Khách hàng",
    desc: "Tài khoản & gói dịch vụ",
    path: ROUTES.MAIN.CUSTOMER_MANAGER.path,
    icon: Users,
    tone: "text-sky-500 bg-sky-500/10",
  },
  {
    label: "Thống kê",
    desc: "Báo cáo chi tiết hệ thống",
    path: ROUTES.MAIN.ANALYTICS.path,
    icon: BarChart3,
    tone: "text-emerald-500 bg-emerald-500/10",
  },
  {
    label: "Cài đặt",
    desc: "Cấu hình hệ thống admin",
    path: ROUTES.MAIN.SETTINGS.path,
    icon: Settings,
    tone: "text-slate-500 bg-slate-500/10",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Truy cập nhanh</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2 sm:grid-cols-2">
        {quickActions.map((action) => (
          <Link
            key={action.path}
            to={action.path}
            className="group flex items-center gap-3 rounded-xl border p-3 transition-colors hover:bg-muted/50 hover:border-primary/30"
          >
            <div
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-lg",
                action.tone,
              )}
            >
              <action.icon className="size-4" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium group-hover:text-primary transition-colors">
                {action.label}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {action.desc}
              </p>
            </div>
            <ArrowRight className="size-4 shrink-0 text-muted-foreground opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}

interface TypeBreakdownProps {
  byType: Array<{ cardType: string; name: string; total: number }>;
  grandTotal: number;
}

export function TypeBreakdown({ byType, grandTotal }: TypeBreakdownProps) {
  const sorted = [...byType].sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-3">
      {sorted.map((item, index) => {
        const pct =
          grandTotal > 0 ? Math.round((item.total / grandTotal) * 100) : 0;
        return (
          <div key={item.cardType} className="flex items-center gap-3">
            <span className="w-5 text-xs text-muted-foreground tabular-nums">
              {index + 1}
            </span>
            <div className="min-w-0 flex-1 space-y-1">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate font-medium">{item.name}</span>
                <span className="shrink-0 tabular-nums text-muted-foreground">
                  {item.total}
                </span>
              </div>
              <Progress
                value={pct}
                indicatorClassName={cn(
                  index === 0 && "bg-rose-500",
                  index === 1 && "bg-violet-500",
                  index === 2 && "bg-sky-500",
                  index >= 3 && "bg-primary",
                )}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
