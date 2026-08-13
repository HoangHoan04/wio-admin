import BaseView from "@/components/layout/BaseView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useSystemStats } from "@/hooks/analytics";
import { CreditCard, Heart, Layout, Users } from "lucide-react";

export default function AnalyticsPage() {
  const { data, isLoading } = useSystemStats();

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  const stats = [
    {
      label: "Tổng số thiệp",
      value: data?.invitations?.total ?? 0,
      icon: Heart,
      color: "text-pink-500",
    },
    {
      label: "User 7 ngày",
      value: data?.users?.newLast7Days ?? 0,
      icon: Users,
      color: "text-blue-500",
    },
    {
      label: "RSVP tham dự",
      value: data?.guests?.attending ?? 0,
      icon: CreditCard,
      color: "text-green-500",
    },
    {
      label: "Lời chúc chờ duyệt",
      value: data?.wishes?.pending ?? 0,
      icon: Layout,
      color: "text-purple-500",
    },
  ];

  return (
    <BaseView>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Thống kê hệ thống</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`size-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseView>
  );
}
