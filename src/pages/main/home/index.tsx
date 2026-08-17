import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSystemStats } from "@/hooks/analytics";
import { useUser } from "@/store/authStore";
import {
  LayoutDashboard,
  Mail,
  MessageCircleHeart,
  RefreshCw,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  InvitationStatusChart,
  InvitationTypeChart,
} from "./components/dashboard-charts";
import {
  EngagementPanel,
  QuickActions,
  StatCard,
  StatusLegend,
  TypeBreakdown,
} from "./components/dashboard-widgets";

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4 md:p-6">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-12">
        <Skeleton className="h-80 rounded-xl lg:col-span-7" />
        <Skeleton className="h-80 rounded-xl lg:col-span-5" />
      </div>
    </div>
  );
}

export default function HomePage() {
  const user = useUser();
  const { data, isLoading, refetch, isFetching } = useSystemStats();

  if (isLoading) {
    return (
      <BaseView>
        <DashboardSkeleton />
      </BaseView>
    );
  }

  const invitations = data?.invitations;
  const byType = invitations?.byType ?? [];
  const publishedRate =
    invitations?.total && invitations.total > 0
      ? Math.round((invitations.published / invitations.total) * 100)
      : 0;

  const displayName =
    user?.fullName?.trim() ||
    user?.email?.split("@")[0] ||
    "Admin";

  return (
    <BaseView>
      <div className="space-y-6 p-4 md:p-6">
        {/* Hero header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 md:p-8">
          <div className="pointer-events-none absolute -right-8 -top-8 size-40 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-10 left-1/3 size-32 rounded-full bg-violet-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur-sm">
                <Sparkles className="size-3.5 text-primary" />
                Bảng điều khiển Wio Admin
              </div>
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Xin chào, {displayName}
              </h1>
              <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
                Tổng quan hoạt động thiệp mời, RSVP và người dùng mới.{" "}
                {publishedRate > 0 ? (
                  <>
                    <span className="font-medium text-foreground">
                      {publishedRate}%
                    </span>{" "}
                    thiệp đã được xuất bản.
                  </>
                ) : (
                  "Bắt đầu bằng cách tạo hoặc xuất bản thiệp đầu tiên."
                )}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-background/80"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCw
                  className={isFetching ? "size-4 animate-spin" : "size-4"}
                />
                Làm mới
              </Button>
              <Button size="sm" className="gap-1.5" asChild>
                <Link to="/analytics">
                  <LayoutDashboard className="size-4" />
                  Xem báo cáo
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* KPI cards */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Tổng thiệp"
            value={invitations?.total ?? 0}
            hint={`${invitations?.published ?? 0} đã xuất bản`}
            icon={Mail}
            tone="rose"
          />
          <StatCard
            label="RSVP tham dự"
            value={data?.guests?.attending ?? 0}
            hint={`/${(data?.guests?.total ?? 0).toLocaleString("vi-VN")} khách mời`}
            icon={Users}
            tone="emerald"
          />
          <StatCard
            label="Lời chúc chờ duyệt"
            value={data?.wishes?.pending ?? 0}
            hint="Cần xử lý sớm"
            icon={MessageCircleHeart}
            tone="amber"
          />
          <StatCard
            label="User mới (7 ngày)"
            value={data?.users?.newLast7Days ?? 0}
            hint="Đăng ký gần đây"
            icon={UserPlus}
            tone="violet"
          />
        </div>

        {/* Charts row */}
        <div className="grid gap-4 lg:grid-cols-12">
          <Card className="lg:col-span-7">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Thiệp theo loại sự kiện</CardTitle>
              <p className="text-xs text-muted-foreground">
                Phân bổ số lượng thiệp theo từng loại thiệp
              </p>
            </CardHeader>
            <CardContent>
              <InvitationTypeChart byType={byType} />
            </CardContent>
          </Card>

          <Card className="lg:col-span-5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Trạng thái thiệp</CardTitle>
              <p className="text-xs text-muted-foreground">
                Tỷ lệ xuất bản, nháp và lưu trữ
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <InvitationStatusChart invitations={invitations} />
              <StatusLegend invitations={invitations} />
            </CardContent>
          </Card>
        </div>

        {/* Engagement metrics */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Tương tác & tăng trưởng</CardTitle>
          </CardHeader>
          <CardContent>
            <EngagementPanel
              guests={data?.guests}
              wishes={data?.wishes}
              users={data?.users}
            />
          </CardContent>
        </Card>

        {/* Bottom row: breakdown + quick actions */}
        <div className="grid gap-4 xl:grid-cols-12">
          <Card className="xl:col-span-5">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Xếp hạng loại thiệp</CardTitle>
              <p className="text-xs text-muted-foreground">
                Top loại thiệp được sử dụng nhiều nhất
              </p>
            </CardHeader>
            <CardContent>
              {byType.length > 0 ? (
                <TypeBreakdown
                  byType={byType}
                  grandTotal={invitations?.total ?? 0}
                />
              ) : (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  Chưa có dữ liệu
                </p>
              )}
            </CardContent>
          </Card>

          <div className="xl:col-span-7">
            <QuickActions />
          </div>
        </div>
      </div>
    </BaseView>
  );
}
