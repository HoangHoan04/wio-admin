import BaseView from "@/components/layout/BaseView";
import { Badge } from "@/components/ui/badge";
import { usePaginationTemplate } from "@/hooks/template";
import { Eye, Layout, Sparkles, Star, Tags } from "lucide-react";
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
  aggregateTemplatePremiumSplit,
  aggregateTemplatesByTheme,
  buildMonthlyTrend,
} from "../utils/chart-data";

export default function TemplateReportPage() {
  const templates = usePaginationTemplate({
    skip: 0,
    take: 200,
    where: { isDeleted: false },
  });

  const premiumSplit = useMemo(
    () => aggregateTemplatePremiumSplit(templates.data),
    [templates.data],
  );
  const byTheme = useMemo(
    () => aggregateTemplatesByTheme(templates.data),
    [templates.data],
  );
  const monthlyTrend = useMemo(
    () => buildMonthlyTrend(templates.total),
    [templates.total],
  );

  const visibleCount = templates.data.filter((item) => item.isShow).length;
  const premiumCount = templates.data.filter((item) => item.isPremium).length;
  const topTemplates = useMemo(
    () =>
      [...templates.data]
        .sort((a, b) => Number(b.isPremium) - Number(a.isPremium))
        .slice(0, 8),
    [templates.data],
  );

  if (templates.isLoading) {
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
          title="Thống kê Template"
          subtitle="Phân tích template premium, theme code và xu hướng sử dụng trong hệ thống."
          onRefresh={() => templates.refetch()}
          isRefreshing={templates.isLoading}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Tổng template"
            value={templates.total}
            hint={`${visibleCount} đang hiển thị`}
            tone="indigo"
            icon={Layout}
          />
          <KpiCard
            label="Template Premium"
            value={premiumCount}
            hint={
              templates.total > 0
                ? `${Math.round((premiumCount / templates.total) * 100)}% tổng`
                : undefined
            }
            tone="violet"
            icon={Sparkles}
          />
          <KpiCard
            label="Theme code"
            value={byTheme.length}
            hint="Số theme khác nhau"
            tone="sky"
            icon={Tags}
          />
          <KpiCard
            label="Template nổi bật"
            value={topTemplates[0]?.name ?? "—"}
            hint={topTemplates[0]?.themeCode}
            tone="amber"
            icon={Star}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-12">
          <ChartCard
            className="lg:col-span-5"
            title="Premium vs Miễn phí"
            description="Donut — phân bổ loại template"
          >
            <DonutChart
              data={premiumSplit}
              centerLabel="Template"
              centerValue={templates.total}
              config={statusConfig}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-7"
            title="Template theo theme code"
            description="Cột bo tròn — top theme phổ biến"
          >
            <RoundedBarChart
              data={byTheme.map((item) => ({
                label: item.label,
                value: item.value,
              }))}
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Xu hướng template theo tháng"
            description="Đường cong — phân bổ ước lượng"
          >
            <MonthlyLineChart data={monthlyTrend} color="hsl(199 89% 48%)" />
          </ChartCard>

          <ChartCard
            className="lg:col-span-6"
            title="Top theme (ngang)"
            description="Cột ngang bo tròn"
          >
            <RoundedBarChart
              data={byTheme.slice(0, 6).map((item) => ({
                label: item.label,
                value: item.value,
              }))}
              horizontal
            />
          </ChartCard>

          <ChartCard
            className="lg:col-span-12"
            title="Danh sách template nổi bật"
            description="Template premium và theme đang vận hành"
          >
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {topTemplates.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border bg-muted/20 p-4 space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.themeCode}
                      </p>
                    </div>
                    {item.isPremium ? (
                      <Badge className="shrink-0">Premium</Badge>
                    ) : (
                      <Badge variant="secondary" className="shrink-0">
                        Free
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Eye className="size-3.5" />
                      {item.isShow ? "Đang hiện" : "Ẩn"}
                    </span>
                    <span>{item.trialDays} ngày trial</span>
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
