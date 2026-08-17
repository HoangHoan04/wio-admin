import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useSystemStats } from "@/hooks/analytics";
import {
  LayoutDashboard,
  Mail,
  MessageCircleHeart,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import { useMemo } from "react";
import {
  ComposedTrendChart,
  DonutChart,
  GrowthAreaChart,
  MonthlyLineChart,
  RadialGauge,
  RoundedBarChart,
  StackedBarChart,
  statusConfig,
} from "./components/analytics-charts";
import { ReportNavCards } from "./components/report-nav-cards";
import {
  ChartCard,
  KpiCard,
  ReportHero,
  ReportSkeleton,
} from "./components/report-shell";
import {
  buildEngagementSeries,
  buildGrowthSeries,
  buildMonthlyTrend,
  buildStatusSeries,
  buildTypeSeries,
  formatPercent,
} from "./utils/chart-data";

export default function AnalyticsPage() {
  const { data, isLoading, isFetching, refetch } = useSystemStats();

  const growthSeries = useMemo(() => buildGrowthSeries(data), [data]);
  const typeSeries = useMemo(() => buildTypeSeries(data), [data]);
  const statusSeries = useMemo(() => buildStatusSeries(data), [data]);
  const engagementSeries = useMemo(() => buildEngagementSeries(data), [data]);
  const monthlyInvitations = useMemo(
    () => buildMonthlyTrend(data?.invitations?.published ?? 0),
    [data],
  );

  const stackedByType = useMemo(() => {
    const total = data?.invitations?.total ?? 0;
    if (total === 0 || typeSeries.length === 0) return [];

    return typeSeries.slice(0, 5).map((item) => {
      const ratio = item.total / total;
      return {
        label: item.shortName ?? item.name,
        published: Math.round((data?.invitations?.published ?? 0) * ratio),
        draft: Math.round((data?.invitations?.draft ?? 0) * ratio),
        archived: Math.round((data?.invitations?.archived ?? 0) * ratio),
      };
    });
  }, [data, typeSeries]);

  const revenueProxy = useMemo(
    () =>
      monthlyInvitations.map((item) => ({
        label: item.label,
        revenue: item.value * 350000,
        orders: item.value,
      })),
    [monthlyInvitations],
  );

  const guestTotal = data?.guests?.total ?? 0;
  const attending = data?.guests?.attending ?? 0;
  const rsvpRate = guestTotal > 0 ? Math.round((attending / guestTotal) * 100) : 0;
  const publishRate =
    data?.invitations?.total && data.invitations.total > 0
      ? Math.round((data.invitations.published / data.invitations.total) * 100)
      : 0;

  if (isLoading) {
    return (
      <BaseView>
        <ReportSkeleton cards={6} />
      </BaseView>
    );
  }

  return (
    <BaseView>
      <div className="space-y-6 p-4 md:p-6">
        <ReportHero
          badge="Analytics Center"
          title="Trung tâm báo cáo Wio"
          subtitle="Theo dõi toàn diện thiệp mời, RSVP, người dùng và hiệu suất vận hành qua biểu đồ trực quan."
          actions={
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 bg-background/80"
              onClick={() => refetch()}
              disabled={isFetching}
            >
              <RefreshCw className={isFetching ? "size-4 animate-spin" : "size-4"} />
              Làm mới dữ liệu
            </Button>
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
          <KpiCard
            label="Tổng thiệp"
            value={data?.invitations?.total ?? 0}
            hint={`${publishRate}% đã xuất bản`}
            tone="rose"
            icon={Mail}
          />
          <KpiCard
            label="Đã xuất bản"
            value={data?.invitations?.published ?? 0}
            hint={`${data?.invitations?.draft ?? 0} bản nháp`}
            tone="emerald"
            icon={LayoutDashboard}
          />
          <KpiCard
            label="RSVP tham dự"
            value={attending}
            hint={`${formatPercent(rsvpRate, 0)} tỷ lệ`}
            tone="sky"
            icon={Users}
          />
          <KpiCard
            label="Khách mời"
            value={guestTotal}
            hint="Tổng danh sách"
            tone="indigo"
            icon={Users}
          />
          <KpiCard
            label="Lời chúc chờ duyệt"
            value={data?.wishes?.pending ?? 0}
            hint="Cần xử lý"
            tone="amber"
            icon={MessageCircleHeart}
          />
          <KpiCard
            label="User mới (7 ngày)"
            value={data?.users?.newLast7Days ?? 0}
            hint="Tăng trưởng gần đây"
            tone="violet"
            icon={UserPlus}
          />
        </div>

        <ReportNavCards />

        <div className="grid gap-4 lg:grid-cols-12">
          <ChartCard
            className="lg:col-span-8"
            title="Xu hướng tăng trưởng 7 ngày"
            description="Đường area + line: user mới, thiệp xuất bản và RSVP"
          >
            <GrowthAreaChart data={growthSeries} />
          </ChartCard>

          <ChartCard
            className="lg:col-span-4"
            title="Tỷ lệ RSVP"
            description="Gauge tròn — khách xác nhận tham dự"
          >
            <RadialGauge value={rsvpRate} label="Tham dự" />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Thiệp theo loại sự kiện"
            description="Cột bo tròn — phân bổ loại thiệp"
          >
            <RoundedBarChart
              data={typeSeries.map((item) => ({
                label: item.name,
                shortName: item.shortName,
                value: item.total,
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Trạng thái thiệp"
            description="Donut chart — xuất bản / nháp / lưu trữ"
          >
            <DonutChart
              data={statusSeries}
              centerLabel="Tổng thiệp"
              centerValue={data?.invitations?.total ?? 0}
              config={statusConfig}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-7"
            title="Phân bổ trạng thái theo loại thiệp"
            description="Cột xếp chồng bo tròn — top 5 loại thiệp"
          >
            <StackedBarChart
              data={stackedByType}
              series={[
                { key: "published", label: "Xuất bản", color: "hsl(142 76% 36%)" },
                { key: "draft", label: "Nháp", color: "hsl(217 91% 60%)" },
                { key: "archived", label: "Lưu trữ", color: "hsl(215 16% 47%)" },
              ]}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-5"
            title="Tương tác khách mời"
            description="Phân bổ RSVP và lời chúc"
          >
            <DonutChart data={engagementSeries} config={statusConfig} />
          </ChartCard>

          <ChartCard
            className="lg:col-span-8"
            title="Xu hướng thiệp xuất bản theo tháng"
            description="Đường cong mượt — 12 tháng (ước lượng từ tổng hiện tại)"
          >
            <MonthlyLineChart data={monthlyInvitations} color="hsl(346 77% 50%)" />
          </ChartCard>

          <ChartCard
            className="lg:col-span-4"
            title="Top loại thiệp"
            description="Thanh ngang bo tròn"
          >
            <RoundedBarChart
              data={typeSeries.slice(0, 6).map((item) => ({
                label: item.name,
                shortName: item.shortName,
                value: item.total,
              }))}
              horizontal
              height={280}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-12"
            title="Chỉ số vận hành tổng hợp"
            description="Cột doanh thu ước tính + đường số đơn (proxy từ thiệp xuất bản)"
          >
            <ComposedTrendChart data={revenueProxy} />
          </ChartCard>
        </div>

        <ChartCard title="Tóm tắt nhanh" description="Chỉ số then chốt cần theo dõi">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Tỷ lệ xuất bản", value: publishRate },
              { label: "Tỷ lệ RSVP", value: rsvpRate },
              {
                label: "Thiệp nháp",
                value:
                  data?.invitations?.total && data.invitations.total > 0
                    ? Math.round(
                        ((data.invitations.draft ?? 0) / data.invitations.total) * 100,
                      )
                    : 0,
              },
              {
                label: "Lưu trữ",
                value:
                  data?.invitations?.total && data.invitations.total > 0
                    ? Math.round(
                        ((data.invitations.archived ?? 0) / data.invitations.total) *
                          100,
                      )
                    : 0,
              },
            ].map((item) => (
              <div key={item.label} className="space-y-2 rounded-xl border p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-semibold tabular-nums">{item.value}%</span>
                </div>
                <Progress value={item.value} />
              </div>
            ))}
          </div>
        </ChartCard>
      </div>
    </BaseView>
  );
}
