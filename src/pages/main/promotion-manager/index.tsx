import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface PromotionItem {
  id: string;
  code: string;
  name: string;
  discountPercent: number;
  maxDiscountAmount: number;
  usageLimit: number;
  usedCount: number;
  startDate: string;
  endDate: string;
  status: "ACTIVE" | "EXPIRED" | "DISABLED";
}

export default function PromotionManagerPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Record<string, any>>({});
  const [selectedRows, setSelectedRows] = useState<PromotionItem[]>([]);

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã giảm giá",
      type: "input",
      placeholder: "Nhập mã voucher...",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Tất cả",
      options: [
        { label: "Đang áp dụng", value: "ACTIVE" },
        { label: "Hết hạn", value: "EXPIRED" },
        { label: "Tắt", value: "DISABLED" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<PromotionItem>[] = [
    { field: "code", header: "Mã giảm giá", width: 140 },
    { field: "name", header: "Tên chương trình", width: 220 },
    {
      field: "discountPercent",
      header: "Giảm (%)",
      width: 100,
      align: "center",
      body: (row) => `${row.discountPercent}%`,
    },
    {
      field: "maxDiscountAmount",
      header: "Giảm tối đa",
      width: 140,
      align: "right",
      body: (row) => `${row.maxDiscountAmount.toLocaleString("vi-VN")} đ`,
    },
    {
      field: "usedCount",
      header: "Lượt dùng",
      width: 120,
      align: "center",
      body: (row) => `${row.usedCount} / ${row.usageLimit}`,
    },
    {
      field: "startDate",
      header: "Hạn sử dụng",
      width: 200,
      align: "center",
      body: (row) => `${row.startDate} ~ ${row.endDate}`,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={
            row.status === "ACTIVE"
              ? "success"
              : row.status === "EXPIRED"
                ? "secondary"
                : "danger"
          }
          value={
            row.status === "ACTIVE"
              ? "Đang áp dụng"
              : row.status === "EXPIRED"
                ? "Hết hạn"
                : "Tắt"
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<PromotionItem>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Chi tiết",
      severity: "info",
      onClick: (record) => navigate(`/promotion/detail/${record.id}`),
    },
    {
      key: "edit",
      icon: <Edit className="size-3.5" />,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      onClick: (record) => navigate(`/promotion/edit/${record.id}`),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => alert(`Xóa voucher: ${record.code}`),
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

      <TableCustom<PromotionItem>
        data={[]}
        columns={columns}
        rowActions={rowActions}
        enableSelection
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <Button
              size="sm"
              className="gap-1.5"
              onClick={() => navigate("/promotion/add")}
            >
              <Plus className="size-4" />
              Thêm mã giảm giá
            </Button>
          ),
        }}
      />
    </BaseView>
  );
}
