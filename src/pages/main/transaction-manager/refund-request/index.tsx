import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface RefundItem {
  id: string;
  transactionCode: string;
  customerName: string;
  amount: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}


export default function RefundRequestPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = [
    {
      key: "transactionCode",
      label: "Mã giao dịch",
      type: "input",
      placeholder: "Nhập mã giao dịch...",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái hoàn tiền",
      type: "select",
      placeholder: "Tất cả",
      options: [
        { label: "Chờ xử lý", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<RefundItem>[] = [
    { field: "transactionCode", header: "Mã giao dịch", width: 140 },
    { field: "customerName", header: "Khách hàng", width: 180 },
    {
      field: "amount",
      header: "Số tiền hoàn",
      width: 150,
      align: "right",
      body: (row) => `${row.amount.toLocaleString("vi-VN")} đ`,
    },
    { field: "reason", header: "Lý do hoàn tiền", width: 300 },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={
            row.status === "APPROVED"
              ? "success"
              : row.status === "PENDING"
                ? "warning"
                : "danger"
          }
          value={
            row.status === "APPROVED"
              ? "Đã duyệt"
              : row.status === "PENDING"
                ? "Chờ xử lý"
                : "Từ chối"
          }
        />
      ),
    },
    { field: "createdAt", header: "Thời gian gửi", width: 160, align: "center" },
  ];

  const rowActions: RowAction<RefundItem>[] = [
    {
      key: "approve",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Duyệt hoàn tiền",
      severity: "success",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => alert(`Duyệt hoàn tiền cho giao dịch: ${record.transactionCode}`),
    },
    {
      key: "reject",
      icon: <XCircle className="size-3.5" />,
      tooltip: "Từ chối hoàn tiền",
      severity: "danger",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => alert(`Từ chối hoàn tiền cho giao dịch: ${record.transactionCode}`),
    },
  ];

  return (
    <BaseView>
      <div className="p-4 pb-0 flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-1.5"
        >
          <ArrowLeft className="size-4" />
          Quay lại
        </Button>
        <h2 className="text-lg font-bold">Danh sách Yêu cầu Hoàn tiền</h2>
      </div>

      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => { }}
        onClear={() => setFilter({})}
      />

      <TableCustom<RefundItem>
        data={[]}
        columns={columns}
        rowActions={rowActions}
      />
    </BaseView>
  );
}
