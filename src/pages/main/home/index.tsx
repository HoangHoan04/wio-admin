import BaseView from "@/components/layout/BaseView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useSystemStats } from "@/hooks/analytics";
import { Mail, MessageCircleHeart, UserPlus, Users } from "lucide-react";

export default function HomePage() {
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

  const invitations = data?.invitations;
  const stats = [
    {
      label: "Tổng thiệp",
      value: invitations?.total ?? 0,
      icon: Mail,
    },
    {
      label: "Đã xuất bản",
      value: invitations?.published ?? 0,
      icon: Mail,
    },
    {
      label: "RSVP tham dự",
      value: data?.guests?.attending ?? 0,
      icon: Users,
    },
    {
      label: "Lời chúc chờ duyệt",
      value: data?.wishes?.pending ?? 0,
      icon: MessageCircleHeart,
    },
    {
      label: "User 7 ngày",
      value: data?.users?.newLast7Days ?? 0,
      icon: UserPlus,
    },
  ];

  return (
    <BaseView>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Tổng quan Wio</h1>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className="size-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Thiệp theo loại</CardTitle>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {(invitations?.byType || []).map((item: any) => (
              <div
                key={item.cardType}
                className="rounded-lg border p-3 flex justify-between"
              >
                <span>{item.name}</span>
                <span className="font-semibold">{item.total}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </BaseView>
  );
}
