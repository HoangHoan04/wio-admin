import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
import { Eye, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TransactionItem {
  id: string;
  code: string;
  customerName: string;
  planName: string;
  amount: number;
  paymentMethod: "VNPAY" | "MOMO" | "BANK_TRANSFER";
  status: "SUCCESS" | "PENDING" | "FAILED";
  createdAt: string;
}



export default function TransactionManagerPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Record<string, any>>({});

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã giao dịch",
      type: "input",
      placeholder: "Nhập mã giao dịch...",
      col: 4,
    },
    {
      key: "customerName",
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập tên khách hàng...",
      col: 4,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Thành công", value: "SUCCESS" },
        { label: "Chờ xử lý", value: "PENDING" },
        { label: "Thất bại", value: "FAILED" },
      ],
      col: 4,
    },
  ];

  const columns: TableColumn<TransactionItem>[] = [
    { field: "code", header: "Mã giao dịch", width: 140 },
    { field: "customerName", header: "Khách hàng", width: 180 },
    { field: "planName", header: "Gói dịch vụ", width: 200 },
    {
      field: "amount",
      header: "Số tiền (VNĐ)",
      width: 150,
      align: "right",
      body: (row) => `${row.amount.toLocaleString("vi-VN")} đ`,
    },
    { field: "paymentMethod", header: "Phương thức", width: 150, align: "center" },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => {
        const severityMap: Record<string, "success" | "warning" | "danger"> = {
          SUCCESS: "success",
          PENDING: "warning",
          FAILED: "danger",
        };
        const labelMap: Record<string, string> = {
          SUCCESS: "Thành công",
          PENDING: "Chờ xử lý",
          FAILED: "Thất bại",
        };
        return (
          <StatusTag
            severity={severityMap[row.status]}
            value={labelMap[row.status]}
          />
        );
      },
    },
    { field: "createdAt", header: "Thời gian", width: 160, align: "center" },
  ];

  const rowActions: RowAction<TransactionItem>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) => navigate(`/transaction/detail/${record.id}`),
    },
  ];

  return (
    <BaseView>
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => { }}
        onClear={() => setFilter({})}
      />

      <TableCustom<TransactionItem>
        data={[]}
        columns={columns}
        rowActions={rowActions}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5"
              onClick={() => navigate("/transaction/refund-request")}
            >
              <RefreshCw className="size-3.5" />
              Yêu cầu hoàn tiền
            </Button>
          ),
        }}
      />
    </BaseView>
  );
}
