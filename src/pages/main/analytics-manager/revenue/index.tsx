import BaseView from "@/components/layout/BaseView";
import { usePaginationSubscription } from "@/hooks/subscription";
import { useSystemStats } from "@/hooks/analytics";
import { CreditCard, DollarSign, Receipt, TrendingUp, Wallet } from "lucide-react";
import { useMemo } from "react";
import {
  ComposedTrendChart,
  DonutChart,
  RoundedBarChart,
} from "../components/analytics-charts";
import {
  ChartCard,
  KpiCard,
  ReportBackHeader,
  ReportSkeleton,
} from "../components/report-shell";
import {
  aggregatePaymentMethods,
  aggregateSubscriptionsByMonth,
  aggregateSubscriptionsByPlan,
  buildMonthlyTrend,
  formatPercent,
  formatVnd,
  sumRevenue,
} from "../utils/chart-data";

export default function RevenueReportPage() {
  const stats = useSystemStats();
  const subscriptions = usePaginationSubscription({
    skip: 0,
    take: 500,
    where: {},
  });

  const isLoading = stats.isLoading || subscriptions.isLoading;

  const revenueTotal = useMemo(
    () => sumRevenue(subscriptions.data),
    [subscriptions.data],
  );
  const byPlan = useMemo(
    () => aggregateSubscriptionsByPlan(subscriptions.data),
    [subscriptions.data],
  );
  const byMonth = useMemo(
    () => aggregateSubscriptionsByMonth(subscriptions.data),
    [subscriptions.data],
  );
  const paymentMethods = useMemo(
    () => aggregatePaymentMethods(subscriptions.data),
    [subscriptions.data],
  );
  const monthlyFallback = useMemo(
    () =>
      buildMonthlyTrend(stats.data?.invitations?.published ?? 0).map((item) => ({
        label: item.label,
        revenue: item.value * 350000,
        orders: item.value,
      })),
    [stats.data],
  );

  const chartMonthData =
    byMonth.length > 0
      ? byMonth.map((item) => ({
          label: item.label,
          revenue: item.revenue,
          orders: Math.max(Math.round(item.revenue / 350000), 1),
        }))
      : monthlyFallback;

  const monthRevenue = chartMonthData.at(-1)?.revenue ?? 0;
  const prevMonthRevenue = chartMonthData.at(-2)?.revenue ?? 0;
  const growth =
    prevMonthRevenue > 0
      ? ((monthRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
      : 0;

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
          title="Báo cáo Doanh thu"
          subtitle="Phân tích doanh thu theo gói, thời gian và phương thức thanh toán từ subscription thực tế."
          onRefresh={() => {
            stats.refetch();
            subscriptions.refetch();
          }}
          isRefreshing={stats.isFetching || subscriptions.isLoading}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Tổng doanh thu"
            value={formatVnd(revenueTotal)}
            hint={`${subscriptions.total} giao dịch gói`}
            tone="emerald"
            icon={DollarSign}
          />
          <KpiCard
            label="Doanh thu kỳ gần nhất"
            value={formatVnd(monthRevenue)}
            delta={
              growth !== 0
                ? `${growth > 0 ? "+" : ""}${formatPercent(growth)} so với kỳ trước`
                : undefined
            }
            tone="sky"
            icon={TrendingUp}
          />
          <KpiCard
            label="Gói doanh thu cao nhất"
            value={byPlan[0]?.label ?? "—"}
            hint={byPlan[0] ? formatVnd(byPlan[0].revenue) : "Chưa có dữ liệu"}
            tone="violet"
            icon={Wallet}
          />
          <KpiCard
            label="TB / giao dịch"
            value={formatVnd(
              subscriptions.data.length > 0
                ? revenueTotal / subscriptions.data.length
                : 0,
            )}
            tone="amber"
            icon={Receipt}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <ChartCard
            className="lg:col-span-8"
            title="Xu hướng doanh thu"
            description="Cột bo tròn + đường số giao dịch theo tháng"
          >
            <ComposedTrendChart data={chartMonthData} />
          </ChartCard>

          <ChartCard
            className="lg:col-span-4"
            title="Phương thức thanh toán"
            description="Donut — phân bổ payment method"
          >
            <DonutChart
              data={paymentMethods.map((item, index) => ({
                label: item.label,
                value: item.value,
                key: `method-${index}`,
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Doanh thu theo gói dịch vụ"
            description="Cột dọc bo tròn"
          >
            <RoundedBarChart
              data={byPlan.map((item) => ({
                label: item.label,
                value: item.revenue,
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Số lượng gói đã bán"
            description="Cột ngang bo tròn theo plan"
          >
            <RoundedBarChart
              data={byPlan.map((item) => ({
                label: item.label,
                value: item.count,
              }))}
              horizontal
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-12"
            title="Top gói theo doanh thu"
            description="So sánh trực quan các gói subscription"
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {byPlan.slice(0, 6).map((item, index) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between rounded-xl border bg-muted/20 p-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-sm font-bold text-emerald-600">
                      #{index + 1}
                    </div>
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.count} giao dịch
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold tabular-nums">{formatVnd(item.revenue)}</p>
                    <CreditCard className="ml-auto size-4 text-muted-foreground" />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
      </div>
    </BaseView>
  );
}
