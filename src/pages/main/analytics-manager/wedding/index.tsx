import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Heart, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function WeddingReportPage() {
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
          <h1 className="text-xl font-bold">Báo cáo Đám cưới mới</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Đám cưới tạo mới tháng này
              </CardTitle>
              <Heart className="size-5 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">128 đám cưới</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1 text-green-600 font-medium">
                <TrendingUp className="size-3.5" /> +8.2% tăng trưởng
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseView>
  );
}
