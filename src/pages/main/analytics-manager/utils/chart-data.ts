import type { OverviewStats } from "@/hooks/analytics";
import type { SubscriptionDto } from "@/dto/subscription.dto";
import type { TemplateDto } from "@/dto/template.dto";

const DAY_WEIGHTS = [0.08, 0.1, 0.12, 0.14, 0.16, 0.18, 0.22];
const MONTH_WEIGHTS = [0.06, 0.07, 0.08, 0.09, 0.1, 0.11, 0.12, 0.13, 0.14, 0.15, 0.16, 0.17];

const DAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export function formatVnd(value: number) {
  return `${Math.round(value).toLocaleString("vi-VN")} đ`;
}

export function formatPercent(value: number, digits = 1) {
  return `${value.toFixed(digits)}%`;
}

function distributeTotal(total: number, weights: number[]) {
  if (total <= 0) {
    return weights.map(() => 0);
  }

  const raw = weights.map((weight) => Math.round(total * weight));
  const diff = total - raw.reduce((sum, value) => sum + value, 0);
  if (diff !== 0) {
    raw[raw.length - 1] += diff;
  }
  return raw;
}

export function buildWeeklyTrend(total: number) {
  const values = distributeTotal(total, DAY_WEIGHTS);
  return DAY_LABELS.map((label, index) => ({
    label,
    value: values[index],
  }));
}

export function buildMonthlyTrend(total: number) {
  const values = distributeTotal(total, MONTH_WEIGHTS);
  return MONTH_WEIGHTS.map((_, index) => ({
    label: `T${index + 1}`,
    value: values[index],
  }));
}

export function buildGrowthSeries(stats?: OverviewStats) {
  const users = buildWeeklyTrend(stats?.users?.newLast7Days ?? 0);
  const invitations = buildWeeklyTrend(stats?.invitations?.published ?? 0);
  const guests = buildWeeklyTrend(stats?.guests?.attending ?? 0);

  return users.map((item, index) => ({
    label: item.label,
    users: item.value,
    invitations: invitations[index]?.value ?? 0,
    guests: guests[index]?.value ?? 0,
  }));
}

export function buildEngagementSeries(stats?: OverviewStats) {
  const attending = stats?.guests?.attending ?? 0;
  const totalGuests = stats?.guests?.total ?? 0;
  const pending = stats?.wishes?.pending ?? 0;
  const declined = Math.max(totalGuests - attending, 0);

  return [
    { label: "Tham dự", value: attending, key: "attending" },
    { label: "Chưa phản hồi", value: Math.max(declined - pending, 0), key: "pending" },
    { label: "Lời chúc", value: pending, key: "wishes" },
  ].filter((item) => item.value > 0);
}

export function buildStatusSeries(stats?: OverviewStats) {
  const invitations = stats?.invitations;
  return [
    { key: "published", label: "Đã xuất bản", value: invitations?.published ?? 0 },
    { key: "draft", label: "Bản nháp", value: invitations?.draft ?? 0 },
    { key: "archived", label: "Lưu trữ", value: invitations?.archived ?? 0 },
  ].filter((item) => item.value > 0);
}

export function buildTypeSeries(stats?: OverviewStats) {
  return (stats?.invitations?.byType ?? [])
    .filter((item) => item.total > 0)
    .map((item) => ({
      ...item,
      shortName: item.name.length > 16 ? `${item.name.slice(0, 14)}…` : item.name,
    }));
}

export function aggregateSubscriptionsByPlan(subscriptions: SubscriptionDto[]) {
  const map = new Map<string, { label: string; count: number; revenue: number }>();

  subscriptions.forEach((item) => {
    const label = item.plan?.name ?? "Không xác định";
    const current = map.get(label) ?? { label, count: 0, revenue: 0 };
    current.count += 1;
    current.revenue += item.paidAmountVnd ?? item.plan?.priceVnd ?? 0;
    map.set(label, current);
  });

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export function aggregateSubscriptionsByMonth(subscriptions: SubscriptionDto[]) {
  const map = new Map<string, number>();

  subscriptions.forEach((item) => {
    const date = new Date(item.startedAt);
    if (Number.isNaN(date.getTime())) return;
    const key = `T${date.getMonth() + 1}/${String(date.getFullYear()).slice(-2)}`;
    map.set(key, (map.get(key) ?? 0) + (item.paidAmountVnd ?? item.plan?.priceVnd ?? 0));
  });

  return Array.from(map.entries())
    .map(([label, revenue]) => ({ label, revenue }))
    .slice(-12);
}

export function aggregatePaymentMethods(subscriptions: SubscriptionDto[]) {
  const map = new Map<string, number>();

  subscriptions.forEach((item) => {
    const label = item.paymentMethod?.trim() || "Chưa ghi nhận";
    map.set(label, (map.get(label) ?? 0) + 1);
  });

  return Array.from(map.entries()).map(([label, value]) => ({ label, value }));
}

export function aggregateTemplatesByTheme(templates: TemplateDto[]) {
  const map = new Map<string, number>();

  templates.forEach((item) => {
    const key = item.themeCode || "Khác";
    map.set(key, (map.get(key) ?? 0) + 1);
  });

  return Array.from(map.entries())
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 8);
}

export function aggregateTemplatePremiumSplit(templates: TemplateDto[]) {
  const premium = templates.filter((item) => item.isPremium).length;
  const free = templates.length - premium;
  return [
    { key: "premium", label: "Premium", value: premium },
    { key: "free", label: "Miễn phí", value: free },
  ].filter((item) => item.value > 0);
}

export function getWeddingTotal(stats?: OverviewStats) {
  return (
    stats?.invitations?.byType?.find(
      (item) => item.cardType === "WEDDING" || item.name.toLowerCase().includes("cưới"),
    )?.total ?? 0
  );
}

export function buildConversionFunnel(subscriptions: SubscriptionDto[]) {
  const total = subscriptions.length;
  const active = subscriptions.filter((item) => item.status?.toLowerCase() === "active").length;
  const paid = subscriptions.filter((item) => (item.paidAmountVnd ?? 0) > 0).length;

  return [
    { label: "Đăng ký gói", value: total, key: "registered" },
    { label: "Đang hoạt động", value: active, key: "active" },
    { label: "Đã thanh toán", value: paid, key: "paid" },
  ];
}

export function calcConversionRate(subscriptions: SubscriptionDto[]) {
  if (subscriptions.length === 0) return 0;
  const paid = subscriptions.filter((item) => (item.paidAmountVnd ?? 0) > 0).length;
  return Math.round((paid / subscriptions.length) * 1000) / 10;
}

export function sumRevenue(subscriptions: SubscriptionDto[]) {
  return subscriptions.reduce(
    (sum, item) => sum + (item.paidAmountVnd ?? item.plan?.priceVnd ?? 0),
    0,
  );
}
