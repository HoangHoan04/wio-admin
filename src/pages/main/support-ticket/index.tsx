import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { ContactDto, FilterContactDto, PaginationDto } from "@/dto";
import { useDeleteContact, usePaginationContact } from "@/hooks/contact";
import { Eye, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const initFilter: FilterContactDto = {};

export default function SupportTicketPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterContactDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterContactDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<ContactDto[]>([]);
  const [selectedContact, setSelectedContact] = useState<ContactDto | null>(
    null,
  );

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationContact(pagination);
  const { onDeleteContact, isLoading: isLoadingDelete } = useDeleteContact();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterContactDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const askDeleteConfirm = (record: ContactDto) => {
    setSelectedContact(record);
    confirmRef.current?.show();
  };

  const handleConfirmDelete = async () => {
    if (!selectedContact) return;
    await onDeleteContact(selectedContact.id);
    await refetch();
    setSelectedContact(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã yêu cầu",
      type: "input",
      placeholder: "Nhập mã CTK...",
      col: 6,
    },
    {
      key: "name",
      label: "Tên khách hàng",
      type: "input",
      placeholder: "Nhập họ tên...",
      col: 6,
    },
    {
      key: "email",
      label: "Email khách hàng",
      type: "input",
      placeholder: "Nhập email...",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Mới gửi (PENDING)", value: "PENDING" },
        { label: "Đang xử lý (IN_PROGRESS)", value: "IN_PROGRESS" },
        { label: "Đã xử lý / Phản hồi (RESOLVED)", value: "RESOLVED" },
        { label: "Đã đóng (CLOSED)", value: "CLOSED" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<ContactDto>[] = [
    {
      field: "code",
      header: "Mã Yêu Cầu",
      width: 130,
      body: (row) => row.code || `CTK-${row.id.substring(0, 4)}`,
    },
    {
      field: "name",
      header: "Tên Khách Hàng",
      width: 180,
    },
    {
      field: "email",
      header: "Email",
      width: 200,
    },
    {
      field: "subject",
      header: "Tiêu Đề / Yêu Cầu",
      width: 250,
      body: (row) => row.subject || "Yêu cầu hỗ trợ liên hệ",
    },
    {
      field: "status",
      header: "Trạng Thái",
      width: 150,
      align: "center",
      body: (row) => {
        const severity =
          row.status === "PENDING"
            ? "danger"
            : row.status === "IN_PROGRESS"
              ? "warning"
              : row.status === "RESOLVED"
                ? "success"
                : "secondary";
        const label =
          row.status === "PENDING"
            ? "Mới gửi"
            : row.status === "IN_PROGRESS"
              ? "Đang xử lý"
              : row.status === "RESOLVED"
                ? "Đã phản hồi"
                : "Đã đóng";
        return <StatusTag severity={severity} value={label} />;
      },
    },
    {
      field: "createdAt",
      header: "Thời Gian Gửi",
      width: 160,
      align: "center",
      body: (row) => (row.createdAt ? formatDateTime(row.createdAt) : "—"),
    },
  ];

  const rowActions: RowAction<ContactDto>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết & Phản hồi",
      severity: "info",
      onClick: (record) => navigate(`/support-ticket/detail/${record.id}`),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => askDeleteConfirm(record),
    },
  ];

  return (
    <BaseView>
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<ContactDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingDelete}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không có yêu cầu liên hệ nào từ khách hàng"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      {selectedContact && (
        <ActionConfirm
          ref={confirmRef}
          title="Xác nhận xóa liên hệ"
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
          onConfirm={handleConfirmDelete}
          message={`Bạn có chắc chắn muốn xóa yêu cầu liên hệ từ "${selectedContact.name}" không?`}
        />
      )}
    </BaseView>
  );
}
