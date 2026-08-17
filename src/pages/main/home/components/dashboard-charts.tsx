import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { OverviewStats } from "@/hooks/analytics";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

const statusChartConfig = {
  published: {
    label: "Đã xuất bản",
    color: "hsl(142 76% 36%)",
  },
  draft: {
    label: "Bản nháp",
    color: "hsl(217 91% 60%)",
  },
  archived: {
    label: "Lưu trữ",
    color: "hsl(215 16% 47%)",
  },
} satisfies ChartConfig;

const typeChartConfig = {
  total: {
    label: "Số thiệp",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const TYPE_COLORS = [
  "hsl(346 77% 50%)",
  "hsl(262 83% 58%)",
  "hsl(199 89% 48%)",
  "hsl(38 92% 50%)",
  "hsl(142 71% 45%)",
  "hsl(280 65% 60%)",
  "hsl(12 76% 61%)",
  "hsl(173 58% 39%)",
];

interface InvitationStatusChartProps {
  invitations: OverviewStats["invitations"];
}

export function InvitationStatusChart({
  invitations,
}: InvitationStatusChartProps) {
  const data = useMemo(
    () =>
      [
        { key: "published", label: "Đã xuất bản", value: invitations?.published ?? 0 },
        { key: "draft", label: "Bản nháp", value: invitations?.draft ?? 0 },
        { key: "archived", label: "Lưu trữ", value: invitations?.archived ?? 0 },
      ].filter((item) => item.value > 0),
    [invitations],
  );

  const total = invitations?.total ?? 0;

  if (total === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chưa có dữ liệu thiệp
      </div>
    );
  }

  return (
    <ChartContainer
      config={statusChartConfig}
      className="mx-auto aspect-square max-h-[280px]"
    >
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent nameKey="label" />} />
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={72}
          outerRadius={110}
          strokeWidth={4}
          stroke="hsl(var(--background))"
        >
          {data.map((entry) => (
            <Cell key={entry.key} fill={`var(--color-${entry.key})`} />
          ))}
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
                      {total}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy ?? 0) + 22}
                      className="fill-muted-foreground text-xs"
                    >
                      Tổng thiệp
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}

interface InvitationTypeChartProps {
  byType?: Array<{ cardType: string; name: string; total: number }>;
}

export function InvitationTypeChart({ byType }: InvitationTypeChartProps) {
  const chartData = useMemo(() => {
    const items = (byType ?? []) as Array<{
      cardType: string;
      name: string;
      total: number;
    }>;
    return items
      .filter((item) => item.total > 0)
      .map((item, index) => ({
        ...item,
        shortName:
          item.name.length > 14 ? `${item.name.slice(0, 12)}…` : item.name,
        fill: TYPE_COLORS[index % TYPE_COLORS.length],
      }));
  }, [byType]);

  if (chartData.length === 0) {
    return (
      <div className="flex h-[280px] items-center justify-center text-sm text-muted-foreground">
        Chưa có thiệp theo loại
      </div>
    );
  }

  return (
    <ChartContainer config={typeChartConfig} className="h-[280px] w-full">
      <BarChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis
          dataKey="shortName"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          fontSize={11}
        />
        <YAxis tickLine={false} axisLine={false} allowDecimals={false} width={32} />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(_, payload) =>
                payload?.[0]?.payload?.name ?? ""
              }
            />
          }
        />
        <Bar dataKey="total" radius={[6, 6, 0, 0]} maxBarSize={48}>
          {chartData.map((entry) => (
            <Cell key={entry.cardType} fill={entry.fill} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
