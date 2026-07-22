import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { ArrowLeft, Ticket } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailPromotionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const promoData = {
    id: id || "1",
    code: "HEU2026",
    name: "Ưu đãi Hè rực rỡ 2026",
    discountPercent: 20,
    maxDiscountAmount: 100000,
    usageLimit: 100,
    usedCount: 24,
    startDate: "2026-06-01",
    endDate: "2026-08-31",
    status: "ACTIVE",
  };

  const tabs = [
    {
      key: "detail",
      title: "Chi tiết mã giảm giá",
      icon: <Ticket className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin khuyến mãi: {promoData.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Mã Voucher" value={promoData.code} />
                <InfoItem label="Tên chương trình" value={promoData.name} />
                <InfoItem
                  label="Tỷ lệ giảm"
                  value={`${promoData.discountPercent}%`}
                />
                <InfoItem
                  label="Mức giảm tối đa"
                  value={`${promoData.maxDiscountAmount.toLocaleString("vi-VN")} VNĐ`}
                />
                <InfoItem
                  label="Số lượt sử dụng"
                  value={`${promoData.usedCount} / ${promoData.usageLimit}`}
                />
                <InfoItem
                  label="Thời gian hiệu lực"
                  value={`${promoData.startDate} đến ${promoData.endDate}`}
                />
                <InfoItem
                  label="Trạng thái"
                  value={
                    <StatusTag
                      severity="success"
                      value="Đang áp dụng"
                    />
                  }
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-semibold text-foreground">{value}</span>
    </div>
  );
}
