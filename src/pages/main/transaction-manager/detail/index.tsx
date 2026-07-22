import BaseView from "@/components/layout/BaseView";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusTag } from "@/components/ui/status-tag";
import { ArrowLeft, Receipt } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailTransactionPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const txnData = {
    id: id || "1",
    code: "TXN-100234",
    customerName: "Nguyễn Văn A",
    customerEmail: "nguyenvana@gmail.com",
    customerPhone: "0987654321",
    planName: "Gói Cao Cấp (12 tháng)",
    amount: 599000,
    paymentMethod: "VNPAY",
    bankTransactionNo: "VNP14892019",
    status: "SUCCESS",
    createdAt: "2026-07-20 14:30:00",
  };

  const tabs = [
    {
      key: "detail",
      title: "Chi tiết giao dịch",
      icon: <Receipt className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giao dịch #{txnData.code}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Mã giao dịch" value={txnData.code} />
                <InfoItem label="Tên khách hàng" value={txnData.customerName} />
                <InfoItem label="Email liên hệ" value={txnData.customerEmail} />
                <InfoItem label="Số điện thoại" value={txnData.customerPhone} />
                <InfoItem label="Gói dịch vụ" value={txnData.planName} />
                <InfoItem
                  label="Số tiền"
                  value={`${txnData.amount.toLocaleString("vi-VN")} VNĐ`}
                />
                <InfoItem label="Cổng thanh toán" value={txnData.paymentMethod} />
                <InfoItem
                  label="Mã giao dịch ngân hàng"
                  value={txnData.bankTransactionNo}
                />
                <InfoItem
                  label="Trạng thái"
                  value={
                    <StatusTag
                      severity="success"
                      value="Thành công"
                    />
                  }
                />
                <InfoItem label="Thời gian thanh toán" value={txnData.createdAt} />
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
