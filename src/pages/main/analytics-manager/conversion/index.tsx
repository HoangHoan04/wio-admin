import BaseView from "@/components/layout/BaseView";
import { Progress } from "@/components/ui/progress";
import { usePaginationSubscription } from "@/hooks/subscription";
import { BarChart2, Crown, Target, TrendingUp, Users } from "lucide-react";
import { useMemo } from "react";
import {
  DonutChart,
  MonthlyLineChart,
  RoundedBarChart,
  statusConfig,
} from "../components/analytics-charts";
import {
  ChartCard,
  KpiCard,
  ReportBackHeader,
  ReportSkeleton,
} from "../components/report-shell";
import {
  aggregateSubscriptionsByPlan,
  buildConversionFunnel,
  buildMonthlyTrend,
  calcConversionRate,
  formatPercent,
} from "../utils/chart-data";

export default function ConversionReportPage() {
  const subscriptions = usePaginationSubscription({
    skip: 0,
    take: 500,
    where: {},
  });

  const funnel = useMemo(
    () => buildConversionFunnel(subscriptions.data),
    [subscriptions.data],
  );
  const byPlan = useMemo(
    () => aggregateSubscriptionsByPlan(subscriptions.data),
    [subscriptions.data],
  );
  const conversionRate = useMemo(
    () => calcConversionRate(subscriptions.data),
    [subscriptions.data],
  );
  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(subscriptions.total),
    [subscriptions.total],
  );

  const activeRate =
    subscriptions.total > 0
      ? Math.round(
          (subscriptions.data.filter((item) => item.status?.toLowerCase() === "active")
            .length /
            subscriptions.total) *
            100,
        )
      : 0;

  if (subscriptions.isLoading) {
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
          title="Báo cáo Conversion"
          subtitle="Phễu chuyển đổi gói dịch vụ, tỷ lệ nâng cấp và hiệu suất subscription."
          onRefresh={() => subscriptions.refetch()}
          isRefreshing={subscriptions.isLoading}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Tỷ lệ conversion"
            value={formatPercent(conversionRate)}
            hint="Đã thanh toán / tổng gói"
            tone="violet"
            icon={Target}
          />
          <KpiCard
            label="Gói đang hoạt động"
            value={formatPercent(activeRate, 0)}
            hint={`${subscriptions.total} subscription`}
            tone="emerald"
            icon={TrendingUp}
          />
          <KpiCard
            label="Gói phổ biến nhất"
            value={byPlan[0]?.label ?? "—"}
            hint={byPlan[0] ? `${byPlan[0].count} lượt` : "Chưa có dữ liệu"}
            tone="sky"
            icon={Crown}
          />
          <KpiCard
            label="Tổng subscription"
            value={subscriptions.total}
            hint="Toàn hệ thống"
            tone="amber"
            icon={Users}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <ChartCard
            className="lg:col-span-5"
            title="Phễu chuyển đổi"
            description="Donut — đăng ký → hoạt động → thanh toán"
          >
            <DonutChart data={funnel} config={statusConfig} />
          </ChartCard>

          <ChartCard
            className="lg:col-span-7"
            title="Conversion theo gói"
            description="Cột bo tròn — số lượng subscription theo plan"
          >
            <RoundedBarChart
              data={byPlan.map((item) => ({
                label: item.label,
                value: item.count,
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Xu hướng subscription theo tháng"
            description="Đường cong mượt — ước lượng phân bổ"
          >
            <MonthlyLineChart data={monthlyTrend} color="hsl(262 83% 58%)" />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Doanh thu theo gói"
            description="Cột ngang — hiệu suất monetization"
          >
            <RoundedBarChart
              data={byPlan.map((item) => ({
                label: item.label,
                value: item.revenue,
              }))}
              horizontal
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-12"
            title="Chi tiết phễu conversion"
            description="Theo dõi từng bước trong hành trình nâng cấp gói"
          >
            <div className="grid gap-4 md:grid-cols-3">
              {funnel.map((step) => {
                const pct =
                  funnel[0]?.value && funnel[0].value > 0
                    ? Math.round((step.value / funnel[0].value) * 100)
                    : 0;
                return (
                  <div key={step.key} className="rounded-xl border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <BarChart2 className="size-4 text-violet-500" />
                        <span className="font-medium">{step.label}</span>
                      </div>
                      <span className="text-lg font-bold tabular-nums">
                        {step.value}
                      </span>
                    </div>
                    <Progress value={pct} indicatorClassName="bg-violet-500" />
                    <p className="text-xs text-muted-foreground">
                      {pct}% so với bước đầu phễu
                    </p>
                  </div>
                );
              })}
            </div>
          </ChartCard>
        </div>
      </div>
    </BaseView>
  );
}
