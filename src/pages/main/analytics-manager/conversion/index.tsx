import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, BarChart2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ConversionReportPage() {
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
          <h1 className="text-xl font-bold">Báo cáo Tỷ lệ Nâng cấp Gói (Conversion Rate)</h1>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Tỷ lệ từ Free -&gt; Premium
              </CardTitle>
              <BarChart2 className="size-5 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34.5 %</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </BaseView>
  );
}
