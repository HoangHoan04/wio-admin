import { ROUTES } from "@/common/constants";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  ArrowUpRight,
  BarChart2,
  DollarSign,
  Heart,
  Layout,
} from "lucide-react";
import { Link } from "react-router-dom";

const reports = [
  {
    title: "Gói dịch vụ & Doanh thu",
    description: "Cấu hình gói dịch vụ và mức giá",
    path: ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.path,
    icon: DollarSign,
    tone: "from-emerald-500/15 to-emerald-500/5 text-emerald-600",
    ring: "hover:ring-emerald-500/30",
  },
  {
    title: "Danh sách thiệp cưới",
    description: "Xu hướng thiệp cưới và phân bổ trạng thái",
    path: ROUTES.MAIN.INVITATION_MANAGER.children.INVITATION_LIST.path,
    icon: Heart,
    tone: "from-rose-500/15 to-rose-500/5 text-rose-600",
    ring: "hover:ring-rose-500/30",
  },
  {
    title: "Kiểm duyệt lời chúc",
    description: "Lời chúc từ khách mời cần duyệt",
    path: ROUTES.MAIN.INVITATION_MANAGER.children.MODERATION_QUEUE.path,
    icon: BarChart2,
    tone: "from-violet-500/15 to-violet-500/5 text-violet-600",
    ring: "hover:ring-violet-500/30",
  },
  {
    title: "Kho mẫu thiệp",
    description: "Template phổ biến và theo theme",
    path: ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER.path,
    icon: Layout,
    tone: "from-indigo-500/15 to-indigo-500/5 text-indigo-600",
    ring: "hover:ring-indigo-500/30",
  },
];

export function ReportNavCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reports.map((report) => (
        <Link key={report.path} to={report.path}>
          <Card
            className={cn(
              "group h-full overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-lg ring-1 ring-transparent",
              report.ring,
            )}
          >
            <CardContent className="p-5">
              <div
                className={cn(
                  "mb-4 flex size-11 items-center justify-center rounded-xl bg-gradient-to-br",
                  report.tone,
                )}
              >
                <report.icon className="size-5" />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {report.title}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                    {report.description}
                  </p>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:translate-x-0.5" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
