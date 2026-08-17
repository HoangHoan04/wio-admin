import BaseView from "@/components/layout/BaseView";
import { useSystemStats } from "@/hooks/analytics";
import { Heart, Mail, Sparkles, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import {
  DonutChart,
  GrowthAreaChart,
  MonthlyLineChart,
  RadialGauge,
  RoundedBarChart,
  StackedBarChart,
  statusConfig,
} from "../components/analytics-charts";
import {
  ChartCard,
  KpiCard,
  ReportBackHeader,
  ReportSkeleton,
} from "../components/report-shell";
import {
  buildGrowthSeries,
  buildMonthlyTrend,
  buildStatusSeries,
  formatPercent,
  getWeddingTotal,
} from "../utils/chart-data";

export default function WeddingReportPage() {
  const { data, isLoading, isFetching, refetch } = useSystemStats();

  const weddingTotal = useMemo(() => getWeddingTotal(data), [data]);
  const monthlyWedding = useMemo(
    () => buildMonthlyTrend(weddingTotal),
    [weddingTotal],
  );
  const growthSeries = useMemo(() => buildGrowthSeries(data), [data]);
  const statusSeries = useMemo(() => buildStatusSeries(data), [data]);

  const published = data?.invitations?.published ?? 0;
  const weddingShare =
    (data?.invitations?.total ?? 0) > 0
      ? Math.round((weddingTotal / (data?.invitations?.total ?? 1)) * 100)
      : 0;
  const publishRate =
    weddingTotal > 0 ? Math.round((published / weddingTotal) * 100) : 0;

  const weddingByStatus = useMemo(() => {
    if (weddingTotal === 0) return [];
    const ratio = weddingTotal / Math.max(data?.invitations?.total ?? 1, 1);
    return [
      {
        key: "published",
        label: "Xuất bản",
        value: Math.round((data?.invitations?.published ?? 0) * ratio),
      },
      {
        key: "draft",
        label: "Nháp",
        value: Math.round((data?.invitations?.draft ?? 0) * ratio),
      },
      {
        key: "archived",
        label: "Lưu trữ",
        value: Math.round((data?.invitations?.archived ?? 0) * ratio),
      },
    ].filter((item) => item.value > 0);
  }, [data, weddingTotal]);

  const weeklyWedding = useMemo(
    () =>
      growthSeries.map((item) => ({
        ...item,
        invitations: Math.round(item.invitations * (weddingShare / 100)),
      })),
    [growthSeries, weddingShare],
  );

  if (isLoading) {
    return (
      <BaseView>
        <ReportSkeleton />
      </BaseView>
    );
  }

  return (
    <BaseView>
      <div className="space-y-6 p-4 md:p-6">
        <ReportBackHeader
          title="Báo cáo Thiệp cưới"
          subtitle="Chuyên sâu về thiệp cưới: xu hướng, trạng thái, RSVP và tỷ lệ chiếm thị phần."
          onRefresh={() => refetch()}
          isRefreshing={isFetching}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Tổng thiệp cưới"
            value={weddingTotal}
            hint={`${formatPercent(weddingShare, 0)} tổng thiệp hệ thống`}
            tone="rose"
            icon={Heart}
          />
          <KpiCard
            label="Đã xuất bản"
            value={Math.round(published * (weddingShare / 100))}
            hint={`${formatPercent(publishRate, 0)} trong nhóm cưới`}
            tone="emerald"
            icon={Mail}
          />
          <KpiCard
            label="RSVP tham dự"
            value={data?.guests?.attending ?? 0}
            hint="Toàn hệ thống wedding events"
            tone="sky"
            icon={Users}
          />
          <KpiCard
            label="Tháng cao điểm"
            value={
              monthlyWedding.reduce(
                (max, item) => (item.value > max.value ? item : max),
                monthlyWedding[0] ?? { label: "—", value: 0 },
              ).label
            }
            hint="Theo phân bổ ước lượng"
            tone="violet"
            icon={TrendingUp}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <ChartCard
            className="lg:col-span-8"
            title="Xu hướng thiệp cưới 7 ngày"
            description="Area + line — wedding focus trên xu hướng chung"
          >
            <GrowthAreaChart data={weeklyWedding} />
          </ChartCard>

          <ChartCard
            className="lg:col-span-4"
            title="Thị phần thiệp cưới"
            description="Gauge tròn — tỷ lệ trong tổng thiệp"
          >
            <RadialGauge value={weddingShare} label="Thiệp cưới" />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Thiệp cưới theo tháng"
            description="Đường cong mượt — xu hướng seasonal"
          >
            <MonthlyLineChart
              data={monthlyWedding}
              color="hsl(346 77% 50%)"
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Trạng thái thiệp cưới"
            description="Donut — xuất bản / nháp / lưu trữ"
          >
            <DonutChart
              data={weddingByStatus}
              centerLabel="Thiệp cưới"
              centerValue={weddingTotal}
              config={statusConfig}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-7"
            title="Phân bổ trạng thái wedding"
            description="Cột xếp chồng bo tròn theo tháng"
          >
            <StackedBarChart
              data={monthlyWedding.slice(0, 6).map((item) => ({
                label: item.label,
                published: Math.round(item.value * 0.55),
                draft: Math.round(item.value * 0.3),
                archived: Math.round(item.value * 0.15),
              }))}
              series={[
                { key: "published", label: "Xuất bản", color: "hsl(142 76% 36%)" },
                { key: "draft", label: "Nháp", color: "hsl(217 91% 60%)" },
                { key: "archived", label: "Lưu trữ", color: "hsl(215 16% 47%)" },
              ]}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-5"
            title="So sánh loại thiệp"
            description="Cột ngang — wedding vs các loại khác"
          >
            <RoundedBarChart
              data={(data?.invitations?.byType ?? [])
                .filter((item) => item.total > 0)
                .map((item) => ({
                  label: item.name,
                  shortName:
                    item.name.length > 14
                      ? `${item.name.slice(0, 12)}…`
                      : item.name,
                  value: item.total,
                }))}
              horizontal
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-12"
            title="Tổng quan trạng thái toàn hệ thống"
            description="Donut tổng thể để đối chiếu wedding segment"
          >
            <div className="grid gap-6 lg:grid-cols-2">
              <DonutChart
                data={statusSeries}
                centerLabel="Tất cả thiệp"
                centerValue={data?.invitations?.total ?? 0}
                config={statusConfig}
              />
              <div className="flex flex-col justify-center gap-4">
                {[
                  {
                    icon: Heart,
                    label: "Thiệp cưới chiếm",
                    value: `${weddingShare}%`,
                    desc: `${weddingTotal} thiệp trong tổng ${data?.invitations?.total ?? 0}`,
                  },
                  {
                    icon: Sparkles,
                    label: "Xuất bản wedding",
                    value: `${publishRate}%`,
                    desc: "Tỷ lệ wedding đã public",
                  },
                  {
                    icon: Users,
                    label: "RSVP",
                    value: `${data?.guests?.attending ?? 0}`,
                    desc: "Khách xác nhận tham dự",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-4 rounded-xl border bg-muted/20 p-4"
                  >
                    <div className="flex size-10 items-center justify-center rounded-lg bg-rose-500/10">
                      <item.icon className="size-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-xl font-bold">{item.value}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </ChartCard>
        </div>
      </div>
    </BaseView>
  );
}
