import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, DollarSign, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RevenueReportPage() {
  const navigate = useNavigate();

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
          <h1 className="text-xl font-bold">Báo cáo Doanh thu Hệ thống</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Doanh thu tháng này
              </CardTitle>
              <DollarSign className="size-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45,890,000 đ</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-green-600 font-medium">
                <TrendingUp className="size-3.5" /> +15.4% so với tháng trước
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tổng doanh thu năm 2026
              </CardTitle>
              <DollarSign className="size-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">320,450,000 đ</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseView>
  );
}
