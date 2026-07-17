import { ROUTES } from "@/common/constants";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type {
  FilterSubscriptionDto,
  PaginationDto,
  SubscriptionDto,
} from "@/dto";
import {
  useDeleteSubscription,
  usePaginationSubscription,
} from "@/hooks/subscription";
import { useRouter } from "@/routes/hooks";
import { Eye, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterSubscriptionDto = {};

export default function SubscriptionListPage() {
  const router = useRouter();
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

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);

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

  const handleFiltersChange = (newFilters: FilterSubscriptionDto) => {
    setFilter(newFilters);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleDelete = async () => {
    if (!selectedSubscription) return;
    await onDeleteSubscription(selectedSubscription.id);
    await refetch();
    setSelectedSubscription(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "planName",
      label: "Gói dịch vụ",
      type: "input",
      placeholder: "Nhập tên gói",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Hoạt động", value: "ACTIVE" },
        { label: "Hết hạn", value: "EXPIRED" },
        { label: "Đã hủy", value: "CANCELLED" },
        { label: "Chờ xử lý", value: "PENDING" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<SubscriptionDto>[] = [
    {
      field: "planName",
      header: "Gói dịch vụ",
      width: 150,
      sortable: true,
    },
    {
      field: "user",
      header: "Người dùng",
      width: 200,
      body: (rowData: SubscriptionDto) =>
        rowData.user?.fullName || rowData.userId,
    },

    {
      field: "startDate",
      header: "Ngày bắt đầu",
      width: 160,
      type: "datetime",
    },
    {
      field: "endDate",
      header: "Ngày kết thúc",
      width: 160,
      type: "datetime",
    },
    {
      field: "price",
      header: "Giá",
      width: 120,
      type: "currency",
      align: "right",
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
    },
  ];

  const rowActions: RowAction<SubscriptionDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.SUBSCRIPTION_LIST.children.DETAIL_SUBSCRIPTION.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        setSelectedSubscription(record);
        deleteConfirmRef.current?.show();
      },
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
        emptyText="Không tìm thấy subscription nào"
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

      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xác nhận xóa"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDelete}
        message="Bạn có chắc chắn muốn xóa subscription này không?"
      />
    </BaseView>
  );
}
