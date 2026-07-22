import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type {
  FilterSubscriptionDto,
  PaginationDto,
  SubscriptionDto,
} from "@/dto";
import {
  useDeleteSubscription,
  usePaginationSubscription,
} from "@/hooks/subscription";
import { Eye, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const initFilter: FilterSubscriptionDto = {};

export default function SubscriptionListPage() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterSubscriptionDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterSubscriptionDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<SubscriptionDto[]>([]);
  const [selectedSubscription, setSelectedSubscription] =
    useState<SubscriptionDto | null>(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationSubscription(pagination);
  const { onDeleteSubscription, isLoading: isLoadingDelete } =
    useDeleteSubscription();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterSubscriptionDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const askDeleteConfirm = (record: SubscriptionDto) => {
    setSelectedSubscription(record);
    confirmRef.current?.show();
  };

  const handleConfirmDelete = async () => {
    if (!selectedSubscription) return;
    await onDeleteSubscription(selectedSubscription.id);
    await refetch();
    setSelectedSubscription(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "status",
      label: "Trạng thái đăng ký",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Hoạt động (ACTIVE)", value: "ACTIVE" },
        { label: "Hết hạn (EXPIRED)", value: "EXPIRED" },
        { label: "Đã hủy (CANCELLED)", value: "CANCELLED" },
        { label: "Chờ thanh toán (PENDING)", value: "PENDING" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<SubscriptionDto>[] = [
    {
      field: "user",
      header: "Khách hàng",
      width: 200,
      body: (row) =>
        row.user?.fullName || row.user?.email || row.userId || "N/A",
    },
    {
      field: "wedding",
      header: "Đám cưới",
      width: 200,
      body: (row) =>
        row.wedding
          ? `${row.wedding.groomName} & ${row.wedding.brideName}`
          : "N/A",
    },
    {
      field: "plan",
      header: "Gói dịch vụ",
      width: 180,
      body: (row) => row.plan?.name || "N/A",
    },
    {
      field: "startedAt",
      header: "Ngày bắt đầu",
      width: 160,
      align: "center",
      body: (row) => (row.startedAt ? formatDateTime(row.startedAt) : "—"),
    },
    {
      field: "expiresAt",
      header: "Ngày hết hạn",
      width: 160,
      align: "center",
      body: (row) => (row.expiresAt ? formatDateTime(row.expiresAt) : "—"),
    },
    {
      field: "paidAmountVnd",
      header: "Số tiền thanh toán",
      width: 160,
      align: "right",
      body: (row) =>
        row.paidAmountVnd
          ? `${Number(row.paidAmountVnd).toLocaleString("vi-VN")} đ`
          : "—",
    },
    {
      field: "paymentMethod",
      header: "PTTT",
      width: 120,
      align: "center",
      body: (row) => row.paymentMethod || "—",
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => {
        const severity =
          row.status === "ACTIVE"
            ? "success"
            : row.status === "PENDING"
              ? "warning"
              : "danger";
        return <StatusTag severity={severity} value={row.status} />;
      },
    },
  ];

  const rowActions: RowAction<SubscriptionDto>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Chi tiết",
      severity: "info",
      onClick: (record) => navigate(`/subscription/detail/${record.id}`),
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

      <TableCustom<SubscriptionDto>
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
        emptyText="Không tìm thấy đăng ký gói dịch vụ nào"
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

      {selectedSubscription && (
        <ActionConfirm
          ref={confirmRef}
          title="Xác nhận xóa đăng ký"
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
          onConfirm={handleConfirmDelete}
          message="Bạn có chắc chắn muốn xóa đăng ký gói dịch vụ này không?"
        />
      )}
    </BaseView>
  );
}
