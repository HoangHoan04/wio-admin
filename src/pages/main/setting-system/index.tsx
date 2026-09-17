import BaseView from "@/components/layout/BaseView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { History, Send, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const settingsList = [
    {
      title: "Lịch sử hoạt động (Audit Log)",
      description:
        "Xem chi tiết nhật ký thao tác và audit log của toàn bộ người dùng và quản trị viên",
      icon: History,
      path: "/settings/audit-log",
    },
    {
      title: "Lịch sử gửi thông báo",
      description:
        "Theo dõi toàn bộ nhật ký gửi thông báo, lời mời qua Email, SMS, Zalo của các đám cưới",
      icon: Send,
      path: "/settings/notification-log",
    },
  ];

  return (
    <BaseView>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Settings className="size-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Cài Đặt & Nhật Ký Hệ Thống</h1>
            <p className="text-sm text-muted-foreground">
              Tra cứu thông tin giám sát hoạt động và lịch sử gửi tin toàn hệ thống.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {settingsList.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:border-primary transition-all hover:shadow-md"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                  <item.icon className="size-5 shrink-0" />
                </div>
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseView>
  );
}
