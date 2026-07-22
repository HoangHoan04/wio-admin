import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RolePermissionPage() {
  const navigate = useNavigate();

  const roles = [
    {
      name: "SUPER_ADMIN",
      title: "Super Admin (Quản trị tối cao)",
      description: "Có toàn quyền truy cập, cấu hình hệ thống, quản lý tài chính và nhân sự.",
      permissions: ["Tất cả quyền hệ thống"],
    },
    {
      name: "SUPPORT_STAFF",
      title: "Nhân viên hỗ trợ khách hàng",
      description: "Quản lý khách hàng, kiểm duyệt lời chúc, xử lý ticket hỗ trợ.",
      permissions: [
        "Xem & Quản lý Khách hàng",
        "Kiểm duyệt Lời chúc",
        "Xử lý Ticket hỗ trợ",
        "Xem danh sách Đám cưới",
      ],
    },
    {
      name: "CONTENT_EDITOR",
      title: "Biên tập viên Marketing",
      description: "Quản lý banner, viết blog tin tức, cập nhật câu hỏi thường gặp.",
      permissions: [
        "Quản lý Marketing CMS (Banner, Blog, FAQ)",
        "Quản lý Template thiệp cưới",
      ],
    },
  ];

  return (
    <BaseView>
      <div className="p-6 flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1.5"
          >
            <ArrowLeft className="size-4" />
            Quay lại
          </Button>
          <h2 className="text-xl font-bold">Ma trận Phân quyền & Vai trò</h2>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {roles.map((role) => (
            <Card key={role.name}>
              <CardHeader className="flex flex-row items-center gap-3">
                <ShieldCheck className="size-6 text-primary shrink-0" />
                <div>
                  <CardTitle className="text-base">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">{role.description}</p>
                <div>
                  <span className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                    Quyền hạn áp dụng:
                  </span>
                  <ul className="mt-2 space-y-1">
                    {role.permissions.map((perm, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-center gap-2">
                        <span className="size-1.5 rounded-full bg-primary inline-block" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </BaseView>
  );
}
