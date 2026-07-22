import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import { StatusTag } from "@/components/ui/status-tag";
import { Eye, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface StaffItem {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
}



export default function StaffManagerPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<Record<string, any>>({});
  const [selectedRows, setSelectedRows] = useState<StaffItem[]>([]);

  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập tên nhân sự...",
      col: 6,
    },
    {
      key: "role",
      label: "Vai trò",
      type: "select",
      placeholder: "Tất cả vai trò",
      options: [
        { label: "Super Admin", value: "SUPER_ADMIN" },
        { label: "Nhân viên hỗ trợ", value: "SUPPORT_STAFF" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<StaffItem>[] = [
    { field: "fullName", header: "Họ và tên", width: 180 },
    { field: "email", header: "Email", width: 220 },
    { field: "phone", header: "Số điện thoại", width: 140 },
    { field: "role", header: "Vai trò", width: 160 },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={row.status === "ACTIVE" ? "success" : "secondary"}
          value={row.status === "ACTIVE" ? "Hoạt động" : "Tạm khóa"}
        />
      ),
    },
    { field: "createdAt", header: "Ngày tạo", width: 140, align: "center" },
  ];

  const rowActions: RowAction<StaffItem>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Chi tiết",
      severity: "info",
      onClick: (record) => navigate(`/staff/detail/${record.id}`),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa nhân sự",
      severity: "danger",
      onClick: (record) => alert(`Xóa nhân sự: ${record.fullName}`),
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

      <TableCustom<StaffItem>
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
            <div className="flex gap-2">
              <Button
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/staff/add")}
              >
                <Plus className="size-4" />
                Thêm nhân sự
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => navigate("/staff/role-permission")}
              >
                <ShieldCheck className="size-4" />
                Phân quyền vai trò
              </Button>
            </div>
          ),
        }}
      />
    </BaseView>
  );
}
