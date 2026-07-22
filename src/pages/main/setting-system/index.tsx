import BaseView from "@/components/layout/BaseView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, CreditCard, Globe, History, Mail, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function SettingsPage() {
  const navigate = useNavigate();

  const settingsList = [
    {
      title: "Lịch sử hoạt động (Audit Log)",
      description: "Xem chi tiết nhật ký thao tác của người dùng và quản trị viên",
      icon: History,
      path: "/settings/audit-log",
    },
    {
      title: "Cổng thanh toán",
      description: "Cấu hình tích hợp VNPAY, MoMo, ZaloPay và chuyển khoản",
      icon: CreditCard,
      path: "/settings/payment-gateway",
    },
    {
      title: "Tài khoản nhận tiền (Ngân hàng)",
      description: "Quản lý thông tin tài khoản ngân hàng và mã QR chuyển khoản",
      icon: Banknote,
      path: "/settings/bank-config",
    },
    {
      title: "Cấu hình Email & Thông báo",
      description: "Cấu hình dịch vụ gửi mail SMTP, mẫu tin nhắn SMS thông báo",
      icon: Mail,
      path: "/settings/notification-config",
    },
    {
      title: "Cấu hình Domain riêng",
      description: "Quản lý cài đặt DNS và tên miền tùy chỉnh cho khách hàng",
      icon: Globe,
      path: "/settings/domain-config",
    },
  ];

  return (
    <BaseView>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Settings className="size-6 text-primary" />
          <h1 className="text-2xl font-bold">Cài Đặt Hệ Thống</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {settingsList.map((item) => (
            <Card
              key={item.path}
              className="cursor-pointer hover:border-primary transition-colors"
              onClick={() => navigate(item.path)}
            >
              <CardHeader className="flex flex-row items-center gap-3 pb-2">
                <item.icon className="size-6 text-primary shrink-0" />
                <CardTitle className="text-base">{item.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseView>
  );
}
