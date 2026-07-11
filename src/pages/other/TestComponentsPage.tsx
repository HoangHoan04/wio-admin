import { enumData } from "@/common/enums";
import type {
  PaginationConfig,
  RowAction,
  TableColumn,
} from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Edit, Eye, Plus, Trash } from "lucide-react";
import React, { useState } from "react";

interface EmployeeTest {
  id: string;
  name: string;
  role: string;
  department: string; // Phòng ban
  email: string;
  phone: string; // Số điện thoại
  address: string; // Địa chỉ
  salary: number;
  joinDate: string;
  performance: string; // Đánh giá hiệu suất (A, B, C...)
  leaveDays: number; // Số ngày phép còn lại
  currentProject: string; // Dự án hiện tại
  manager: string; // Người quản lý trực tiếp
  status: "active" | "inactive" | "pending";
  isVerified: boolean;
}

const mockEmployees: EmployeeTest[] = [
  {
    id: "EMP001",
    name: "Nguyễn Văn A",
    role: "Phát triển phần mềm",
    email: "nguyenvana@company.com",
    phone: "0901234567",
    address: "123 Đường Lê Lợi, Quận 1, TP. HCM",
    department: "Công nghệ thông tin",
    salary: 25000000,
    joinDate: "2024-01-15T08:00:00Z",
    status: "active",
    isVerified: true,
    performance: "A",
    leaveDays: 12,
    currentProject: "E-Commerce System",
    manager: "Trần Khải Minh",
  },
  {
    id: "EMP002",
    name: "Trần Thị B",
    role: "Chuyên viên nhân sự",
    email: "tranthib@company.com",
    phone: "0912345678",
    address: "456 Đường Nguyễn Huệ, Quận 3, TP. HCM",
    department: "Hành chính Nhân sự",
    salary: 18000000,
    joinDate: "2023-11-10T08:00:00Z",
    status: "active",
    isVerified: true,
    performance: "B+",
    leaveDays: 8,
    currentProject: "Recruitment 2026",
    manager: "Lê Hoài Nam",
  },
  {
    id: "EMP003",
    name: "Phạm Văn C",
    role: "Trưởng phòng thiết kế",
    email: "phamvanc@company.com",
    phone: "0923456789",
    address: "789 Đường Trần Hưng Đạo, Quận 5, TP. HCM",
    department: "Thiết kế Sản phẩm",
    salary: 35000000,
    joinDate: "2022-05-20T08:00:00Z",
    status: "inactive",
    isVerified: false,
    performance: "A+",
    leaveDays: 4,
    currentProject: "Redesign UI/UX Mobile App",
    manager: "Ban Giám Đốc",
  },
  {
    id: "EMP004",
    name: "Lê Thị D",
    role: "Quản trị hệ thống",
    email: "lethid@company.com",
    phone: "0934567890",
    address: "101 Đường Hoàng Diệu, Ba Đình, Hà Nội",
    department: "An ninh mạng & Hệ thống",
    salary: 22000000,
    joinDate: "2024-03-01T08:00:00Z",
    status: "pending",
    isVerified: true,
    performance: "B",
    leaveDays: 14,
    currentProject: "Cloud Migration 2026",
    manager: "Nguyễn Văn A",
  },
  {
    id: "EMP005",
    name: "Hoàng Văn E",
    role: "Chuyên viên kiểm thử",
    email: "hoangvane@company.com",
    phone: "0945678901",
    address: "202 Đường Nguyễn Văn Linh, Hải Châu, Đà Nẵng",
    department: "Đảm bảo chất lượng (QA)",
    salary: 15000000,
    joinDate: "2024-05-12T08:00:00Z",
    status: "active",
    isVerified: false,
    performance: "C",
    leaveDays: 10,
    currentProject: "Automation Testing Suite",
    manager: "Phan Mỹ Linh",
  },
  {
    id: "EMP006",
    name: "Ngô Quốc Bảo",
    role: "Kỹ sư DevOps",
    department: "An ninh mạng & Hệ thống",
    email: "baonq@company.com",
    phone: "0956789012",
    address: "78 Đường láng, Đống Đa, Hà Nội",
    salary: 28000000,
    joinDate: "2023-02-15T08:00:00Z",
    performance: "A",
    leaveDays: 6,
    currentProject: "Cloud Migration 2026",
    manager: "Lê Thị D",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP007",
    name: "Vũ Thu Thảo",
    role: "Chuyên viên Marketing",
    department: "Truyền thông & Thương hiệu",
    email: "thaovt@company.com",
    phone: "0967890123",
    address: "456 Điện Biên Phủ, Bình Thạnh, TP. HCM",
    salary: 17000000,
    joinDate: "2024-06-01T08:00:00Z",
    performance: "B+",
    leaveDays: 11,
    currentProject: "Product Launch Q3",
    manager: "Lê Hoài Nam",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP008",
    name: "Đặng Hoàng Long",
    role: "Lập trình viên Mobile",
    department: "Công nghệ thông tin",
    email: "longdh@company.com",
    phone: "0978901234",
    address: "12 Đường số 4, Khu Trung Sơn, Bình Chánh, TP. HCM",
    salary: 24000000,
    joinDate: "2025-01-10T08:00:00Z",
    performance: "B",
    leaveDays: 12,
    currentProject: "Redesign UI/UX Mobile App",
    manager: "Phạm Văn C",
    status: "pending",
    isVerified: false,
  },
  {
    id: "EMP009",
    name: "Bùi Minh Tuấn",
    role: "Phân tích dữ liệu (DA)",
    department: "Tối ưu hóa Kinh doanh",
    email: "tuanbm@company.com",
    phone: "0989012345",
    address: "99 Lê Duẩn, Hoàn Kiếm, Hà Nội",
    salary: 26000000,
    joinDate: "2023-08-22T08:00:00Z",
    performance: "A+",
    leaveDays: 5,
    currentProject: "BI Dashboard Setup",
    manager: "Ban Giám Đốc",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP010",
    name: "Đỗ Thùy Linh",
    role: "Kiểm thử viên tự động",
    department: "Đảm bảo chất lượng (QA)",
    email: "linhdt@company.com",
    phone: "0990123456",
    address: "156 Nguyễn Văn Cừ, Quận Long Biên, Hà Nội",
    salary: 19000000,
    joinDate: "2024-02-28T08:00:00Z",
    performance: "B",
    leaveDays: 9,
    currentProject: "Automation Testing Suite",
    manager: "Hoàng Văn E",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP011",
    name: "Lý Văn Phước",
    role: "Kỹ sư AI/ML",
    department: "Công nghệ thông tin",
    email: "phuoclv@company.com",
    phone: "0909876543",
    address: "Khu công nghệ cao, Quận 9, TP. HCM",
    salary: 40000000,
    joinDate: "2025-03-15T08:00:00Z",
    performance: "A",
    leaveDays: 14,
    currentProject: "Recommendation Engine",
    manager: "Nguyễn Văn A",
    status: "pending",
    isVerified: false,
  },
  {
    id: "EMP012",
    name: "Dương Mỹ Huyền",
    role: "Designer UI/UX",
    department: "Thiết kế Sản phẩm",
    email: "huyendm@company.com",
    phone: "0918765432",
    address: "34 Cầu Giấy, Quận Cầu Giấy, Hà Nội",
    salary: 21000000,
    joinDate: "2023-10-05T08:00:00Z",
    performance: "B+",
    leaveDays: 7,
    currentProject: "Redesign UI/UX Mobile App",
    manager: "Phạm Văn C",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP013",
    name: "Trịnh Đình Quang",
    role: "Kế toán tổng hợp",
    department: "Tài chính Kế toán",
    email: "quangtd@company.com",
    phone: "0928765431",
    address: "55 Nguyễn Chí Thanh, Đống Đa, Hà Nội",
    salary: 16500000,
    joinDate: "2022-01-20T08:00:00Z",
    performance: "C",
    leaveDays: 2,
    currentProject: "Tax Audit 2026",
    manager: "Ban Giám Đốc",
    status: "inactive",
    isVerified: true,
  },
  {
    id: "EMP014",
    name: "Lâm Hoài Bảo",
    role: "Phát triển Back-end",
    department: "Công nghệ thông tin",
    email: "baolh@company.com",
    phone: "0938765430",
    address: "210 Lý Thường Kiệt, Quận 11, TP. HCM",
    salary: 27000000,
    joinDate: "2024-07-19T08:00:00Z",
    performance: "A",
    leaveDays: 11,
    currentProject: "E-Commerce System",
    manager: "Nguyễn Văn A",
    status: "active",
    isVerified: true,
  },
  {
    id: "EMP015",
    name: "Trần Thanh Trúc",
    role: "Chuyên viên Đào tạo",
    department: "Hành chính Nhân sự",
    email: "tructt@company.com",
    phone: "0948765429",
    address: "88 Song Hành, Quận 2, TP. HCM",
    salary: 18500000,
    joinDate: "2025-05-01T08:00:00Z",
    performance: "B",
    leaveDays: 13,
    currentProject: "Internal Training 2026",
    manager: "Trần Thị B",
    status: "active",
    isVerified: false,
  },
];

const TestComponentsPage: React.FC = () => {
  const [selectedRows, setSelectedRows] = useState<EmployeeTest[]>([]);
  const [data, setData] = useState<EmployeeTest[]>(mockEmployees);
  const [loading, setLoading] = useState(false);
  const [sortConfig, setSortConfig] = useState<{
    sortField: string | null;
    sortOrder: 1 | -1 | 0 | null;
  }>({
    sortField: null,
    sortOrder: null,
  });

  const columns: TableColumn<EmployeeTest>[] = [
    {
      field: "id",
      header: "Mã NV",
      width: 100,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Họ và Tên",
      width: 200,
      sortable: true,
      frozen: true,
    },
    {
      field: "role",
      header: "Vị trí",
      width: 180,
    },
    {
      field: "department",
      header: "Phòng ban",
      width: 180,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 220,
    },
    {
      field: "phone",
      header: "Số điện thoại",
      width: 150,
    },
    {
      field: "address",
      header: "Địa chỉ thường trú",
      width: 300,
    },
    {
      field: "salary",
      header: "Mức lương",
      type: "currency",
      width: 150,
      sortable: true,
    },
    {
      field: "joinDate",
      header: "Ngày vào làm",
      type: "date",
      width: 160,
      sortable: true,
    },
    {
      field: "performance",
      header: "Đánh giá",
      width: 120,
      sortable: true,
    },
    {
      field: "leaveDays",
      header: "Phép còn lại",
      type: "number",
      width: 130,
      sortable: true,
    },
    {
      field: "currentProject",
      header: "Dự án đang làm",
      width: 200,
    },
    {
      field: "manager",
      header: "Người quản lý",
      width: 180,
    },
    {
      field: "status",
      header: "Trạng thái",
      type: "badge",
      width: 130,
      badgeSeverity: (val) => {
        if (val === "active") return "success";
        if (val === "pending") return "warning";
        return "danger";
      },
    },
    {
      field: "isVerified",
      header: "Đã xác thực",
      type: "boolean",
      width: 130,
    },
  ];

  const rowActions: RowAction<EmployeeTest>[] = [
    {
      key: "view",
      icon: <Eye size={14} />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) => alert(`Xem chi tiết: ${record.name}`),
    },
    {
      key: "edit",
      icon: <Edit size={14} />,
      tooltip: "Chỉnh sửa",
      severity: "success",
      onClick: (record) => alert(`Sửa thông tin: ${record.name}`),
    },
    {
      key: "delete",
      icon: <Trash size={14} />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        if (confirm(`Bạn có chắc chắn muốn xóa ${record.name}?`)) {
          setData((prev) => prev.filter((item) => item.id !== record.id));
        }
      },
    },
  ];

  const handleSort = (event: {
    sortField: string | null;
    sortOrder: 1 | -1 | 0 | null;
  }) => {
    setSortConfig(event);
    const { sortField, sortOrder } = event;
    if (!sortField || !sortOrder) {
      setData(mockEmployees);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      let valA = a[sortField as keyof EmployeeTest];
      let valB = b[sortField as keyof EmployeeTest];

      if (typeof valA === "string") {
        return sortOrder === 1
          ? valA.localeCompare(valB as string)
          : (valB as string).localeCompare(valA);
      }

      if (typeof valA === "number") {
        return sortOrder === 1
          ? (valA as number) - (valB as number)
          : (valB as number) - (valA as number);
      }

      return 0;
    });

    setData(sortedData);
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      setData(mockEmployees);
      setLoading(false);
    }, 800);
  };

  const pagination: PaginationConfig = {
    current: 1,
    pageSize: enumData.PAGE.PAGESIZE,
    total: data.length,
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Khu vực thử nghiệm Component
          </h1>
          <p className="text-sm text-muted-foreground">
            Trang dành riêng để test các tính năng của TableCustom (Kéo thả, Co
            giãn, Ghim cột, Ẩn/Hiện cột, Đổi mật độ).
          </p>
        </div>
        <button
          onClick={() => alert("Thêm mới bản ghi")}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground hover:bg-primary/90 text-sm font-semibold rounded-lg shadow transition-colors"
        >
          <Plus size={16} />
          Thêm mẫu thử
        </button>
      </div>

      <div>
        <TableCustom
          id="test-employee-table"
          data={data}
          columns={columns}
          loading={loading}
          enableSelection
          showIndexList
          selectedRows={selectedRows}
          onSelectionChange={setSelectedRows}
          rowActions={rowActions}
          rowActionsWidth="120px"
          rowActionsFrozen
          sortField={sortConfig.sortField || undefined}
          sortOrder={sortConfig.sortOrder}
          onSort={handleSort}
          toolbar={{
            show: true,
            showRefreshButton: true,
            onRefresh: handleRefresh,
            leftContent: (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">
                  Bảng nhân viên thử nghiệm
                </span>
                {selectedRows.length > 0 && (
                  <span className="text-xs px-2 py-0.5 rounded bg-primary/10 text-primary font-bold">
                    Đã chọn {selectedRows.length} mục
                  </span>
                )}
              </div>
            ),
          }}
          pagination={pagination}
        />
      </div>
    </div>
  );
};

export default TestComponentsPage;
