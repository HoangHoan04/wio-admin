import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Label,
  Line,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from "recharts";
import { ChartEmpty } from "./report-shell";

const PALETTE = [
  "hsl(346 77% 50%)",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(142 71% 45%)",
  "hsl(280 65% 60%)",
  "hsl(12 76% 61%)",
  "hsl(173 58% 39%)",
];

const growthConfig = {
  users: { label: "User mới", color: "hsl(262 83% 58%)" },
  invitations: { label: "Thiệp xuất bản", color: "hsl(346 77% 50%)" },
  guests: { label: "RSVP", color: "hsl(142 71% 45%)" },
} satisfies ChartConfig;

const revenueConfig = {
  revenue: { label: "Doanh thu", color: "hsl(142 76% 36%)" },
  orders: { label: "Giao dịch", color: "hsl(217 91% 60%)" },
} satisfies ChartConfig;

const statusConfig = {
  published: { label: "Đã xuất bản", color: "hsl(142 76% 36%)" },
  draft: { label: "Bản nháp", color: "hsl(217 91% 60%)" },
  archived: { label: "Lưu trữ", color: "hsl(215 16% 47%)" },
  attending: { label: "Tham dự", color: "hsl(142 71% 45%)" },
  pending: { label: "Chưa phản hồi", color: "hsl(38 92% 50%)" },
  wishes: { label: "Lời chúc", color: "hsl(346 77% 50%)" },
  premium: { label: "Premium", color: "hsl(262 83% 58%)" },
  free: { label: "Miễn phí", color: "hsl(199 89% 48%)" },
  registered: { label: "Đăng ký", color: "hsl(217 91% 60%)" },
  active: { label: "Hoạt động", color: "hsl(142 71% 45%)" },
  paid: { label: "Thanh toán", color: "hsl(346 77% 50%)" },
} satisfies ChartConfig;

type SeriesItem = { label: string; value: number; key?: string; shortName?: string };

interface GrowthAreaChartProps {
  data: Array<{ label: string; users: number; invitations: number; guests: number }>;
}

export function GrowthAreaChart({ data }: GrowthAreaChartProps) {
  const hasData = data.some(
    (item) => item.users > 0 || item.invitations > 0 || item.guests > 0,
  );
  if (!hasData) return <ChartEmpty message="Chưa có xu hướng 7 ngày" />;

  return (
    <ChartContainer config={growthConfig} className="h-[320px] w-full">
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="fillUsers" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-users)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-users)" stopOpacity={0.02} />
          </linearGradient>
          <linearGradient id="fillInvitations" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-invitations)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-invitations)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Area
          type="monotone"
          dataKey="users"
          stroke="var(--color-users)"
          fill="url(#fillUsers)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2 }}
        />
        <Area
          type="monotone"
          dataKey="invitations"
          stroke="var(--color-invitations)"
          fill="url(#fillInvitations)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2 }}
        />
        <Line
          type="monotone"
          dataKey="guests"
          stroke="var(--color-guests)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

interface RoundedBarChartProps {
  data: SeriesItem[];
  dataKey?: string;
  height?: number;
  horizontal?: boolean;
}

export function RoundedBarChart({
  data,
  dataKey = "value",
  height = 300,
  horizontal = false,
}: RoundedBarChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  const chartData = data.map((item, index) => ({
    ...item,
    fill: PALETTE[index % PALETTE.length],
    displayLabel: item.shortName ?? item.label,
  }));

  return (
    <ChartContainer
      config={{ value: { label: "Giá trị", color: "hsl(var(--primary))" } }}
      className="w-full"
      style={{ height }}
    >
      <BarChart
        data={chartData}
        layout={horizontal ? "vertical" : "horizontal"}
        margin={{ top: 8, right: 8, left: horizontal ? 8 : -12, bottom: 0 }}
      >
        <CartesianGrid vertical={!horizontal} horizontal={horizontal} strokeDasharray="3 3" />
        {horizontal ? (
          <>
            <XAxis type="number" tickLine={false} axisLine={false} allowDecimals={false} />
            <YAxis
              type="category"
              dataKey="displayLabel"
              tickLine={false}
              axisLine={false}
              width={88}
              fontSize={11}
            />
          </>
        ) : (
          <>
            <XAxis
              dataKey="displayLabel"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              fontSize={11}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
          </>
        )}
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) => payload?.[0]?.payload?.label ?? ""}
            />
          }
        />
        <Bar
          dataKey={dataKey}
          radius={horizontal ? [0, 8, 8, 0] : [8, 8, 0, 0]}
          maxBarSize={horizontal ? 28 : 52}
        >
          {chartData.map((entry) => (
            <Cell key={entry.label} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

interface DonutChartProps {
  data: SeriesItem[];
  centerLabel?: string;
  centerValue?: string | number;
  config?: ChartConfig;
}

export function DonutChart({
  data,
  centerLabel,
  centerValue,
  config = statusConfig,
}: DonutChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  return (
    <ChartContainer config={config} className="mx-auto aspect-square max-h-[300px]">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
        <ChartLegend content={<ChartLegendContent nameKey="label" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={68}
          outerRadius={104}
          strokeWidth={4}
          stroke="hsl(var(--background))"
          paddingAngle={2}
        >
          {data.map((entry, index) => (
            <Cell
              key={entry.key ?? entry.label}
              fill={
                entry.key && config[entry.key]
                  ? `var(--color-${entry.key})`
                  : PALETTE[index % PALETTE.length]
              }
            />
          ))}
          {centerLabel ? (
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      <tspan
                        x={viewBox.cx}
                        y={viewBox.cy}
                        className="fill-foreground text-2xl font-bold"
                      >
                        {centerValue}
                      </tspan>
                      <tspan
                        x={viewBox.cx}
                        y={(viewBox.cy ?? 0) + 20}
                        className="fill-muted-foreground text-xs"
                      >
                        {centerLabel}
                      </tspan>
                    </text>
                  );
                }
              }}
            />
          ) : null}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

interface RadialGaugeProps {
  value: number;
  label: string;
}

export function RadialGauge({ value, label }: RadialGaugeProps) {
  const chartData = useMemo(
    () => [{ name: label, value, fill: "hsl(142 71% 45%)" }],
    [label, value],
  );

  return (
    <ChartContainer
      config={{ value: { label, color: "hsl(142 71% 45%)" } }}
      className="mx-auto aspect-square max-h-[280px]"
    >
      <RadialBarChart
        data={chartData}
        startAngle={90}
        endAngle={-270}
        innerRadius={78}
        outerRadius={118}
      >
        <RadialBar
          dataKey="value"
          cornerRadius={12}
          background={{ fill: "hsl(var(--muted))" }}
        />
        <Label
          content={({ viewBox }) => {
            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
              return (
                <text
                  x={viewBox.cx}
                  y={viewBox.cy}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  <tspan
                    x={viewBox.cx}
                    y={viewBox.cy}
                    className="fill-foreground text-3xl font-bold"
                  >
                    {value}%
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy ?? 0) + 22}
                    className="fill-muted-foreground text-xs"
                  >
                    {label}
                  </tspan>
                </text>
              );
            }
          }}
        />
      </RadialBarChart>
    </ChartContainer>
  );
}

interface ComposedTrendChartProps {
  data: Array<{ label: string; revenue: number; orders?: number }>;
}

export function ComposedTrendChart({ data }: ComposedTrendChartProps) {
  if (data.length === 0) return <ChartEmpty message="Chưa có dữ liệu doanh thu" />;

  return (
    <ChartContainer config={revenueConfig} className="h-[320px] w-full">
      <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={36} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[8, 8, 0, 0]} maxBarSize={42} />
        <Line
          type="monotone"
          dataKey="orders"
          stroke="var(--color-orders)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2 }}
        />
      </ComposedChart>
    </ChartContainer>
  );
}

interface StackedBarChartProps {
  data: Array<Record<string, string | number>>;
  series: Array<{ key: string; label: string; color: string }>;
}

export function StackedBarChart({ data, series }: StackedBarChartProps) {
  if (data.length === 0) return <ChartEmpty />;

  const config = series.reduce<ChartConfig>((acc, item) => {
    acc[item.key] = { label: item.label, color: item.color };
    return acc;
  }, {});

  return (
    <ChartContainer config={config} className="h-[300px] w-full">
      <BarChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} fontSize={11} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        {series.map((item, index) => (
          <Bar
            key={item.key}
            dataKey={item.key}
            stackId="stack"
            fill={item.color}
            radius={
              index === series.length - 1 ? [8, 8, 0, 0] : [0, 0, 0, 0]
            }
            maxBarSize={48}
          />
        ))}
      </BarChart>
    </ChartContainer>
  );
}

interface MonthlyLineChartProps {
  data: Array<{ label: string; value: number }>;
  color?: string;
}

export function MonthlyLineChart({
  data,
  color = "hsl(262 83% 58%)",
}: MonthlyLineChartProps) {
  if (data.every((item) => item.value === 0)) {
    return <ChartEmpty message="Chưa có dữ liệu theo tháng" />;
  }

  return (
    <ChartContainer
      config={{ value: { label: "Số lượng", color } }}
      className="h-[280px] w-full"
    >
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="monthlyFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={28} />
        <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
        <Area
          type="monotone"
          dataKey="value"
          stroke={color}
          fill="url(#monthlyFill)"
          strokeWidth={2.5}
          dot={{ r: 3, strokeWidth: 2 }}
        />
      </AreaChart>
    </ChartContainer>
  );
}

export { statusConfig, revenueConfig, growthConfig, PALETTE };
