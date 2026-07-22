import { ROUTES } from "@/common/constants";
import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import { CommonActions } from "@/components/layout/CommonActions";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import { RowActions } from "@/components/layout/RowActions";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type {
  FilterServicePlanDto,
  PaginationDto,
  ServicePlanDto,
} from "@/dto";
import {
  useDeleteServicePlan,
  usePaginationServicePlan,
} from "@/hooks/service-plan";
import { useRouter } from "@/routes/hooks";
import { Check, Edit, Eye, Trash2, X } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterServicePlanDto = {};

export default function PlanManagerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterServicePlanDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterServicePlanDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<ServicePlanDto[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlanDto | null>(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationServicePlan(pagination);
  const { onDeleteServicePlan, isLoading: isLoadingDelete } =
    useDeleteServicePlan();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterServicePlanDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const askDeleteConfirm = (record: ServicePlanDto) => {
    setSelectedPlan(record);
    confirmRef.current?.show();
  };

  const handleConfirmDelete = async () => {
    if (!selectedPlan) return;
    await onDeleteServicePlan(selectedPlan.id);
    await refetch();
    setSelectedPlan(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children.ADD_PLAN
        .path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên gói dịch vụ",
      type: "input",
      placeholder: "Nhập tên gói...",
      col: 6,
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Hoạt động", value: "true" },
        { label: "Tạm khóa", value: "false" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<ServicePlanDto>[] = [
    {
      field: "name",
      header: "Tên gói dịch vụ",
      width: 200,
      sortable: true,
    },
    {
      field: "priceVnd",
      header: "Đơn giá (VNĐ)",
      width: 150,
      align: "right",
      body: (row) => `${Number(row.priceVnd).toLocaleString("vi-VN")} đ`,
    },
    {
      field: "durationDays",
      header: "Thời hạn",
      width: 120,
      align: "center",
      body: (row) => `${row.durationDays} ngày`,
    },
    {
      field: "maxGuests",
      header: "Tối đa khách",
      width: 120,
      align: "center",
    },
    {
      field: "maxPhotos",
      header: "Tối đa ảnh",
      width: 110,
      align: "center",
    },
    {
      field: "maxTemplates",
      header: "Tối đa template",
      width: 130,
      align: "center",
    },
    {
      field: "hasAi",
      header: "Có AI",
      width: 90,
      align: "center",
      body: (row) =>
        row.hasAi ? (
          <Check className="size-4 text-green-500 mx-auto" />
        ) : (
          <X className="size-4 text-muted-foreground mx-auto" />
        ),
    },
    {
      field: "hasAnalytics",
      header: "Thống kê",
      width: 100,
      align: "center",
      body: (row) =>
        row.hasAnalytics ? (
          <Check className="size-4 text-green-500 mx-auto" />
        ) : (
          <X className="size-4 text-muted-foreground mx-auto" />
        ),
    },
    {
      field: "hasCustomSlug",
      header: "Slug riêng",
      width: 100,
      align: "center",
      body: (row) =>
        row.hasCustomSlug ? (
          <Check className="size-4 text-green-500 mx-auto" />
        ) : (
          <X className="size-4 text-muted-foreground mx-auto" />
        ),
    },
    {
      field: "isActive",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={row.isActive ? "success" : "secondary"}
          value={row.isActive ? "Hoạt động" : "Tạm khóa"}
        />
      ),
    },
    {
      field: "createdAt",
      header: "Ngày tạo",
      width: 160,
      align: "center",
      body: (row) => (row.createdAt ? formatDateTime(row.createdAt) : "—"),
    },
  ];

  const rowActions: RowAction<ServicePlanDto>[] = [
    {
      key: "detail",
      icon: <Eye className="size-3.5" />,
      tooltip: "Chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children.EDIT_PLAN.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: <Edit className="size-3.5" />,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.SUBSCRIPTION_MANAGER.children.PLAN_MANAGER.children.EDIT_PLAN.path.replace(
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

      <TableCustom<ServicePlanDto>
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
        emptyText="Không tìm thấy gói dịch vụ nào"
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
          leftContent: (
            <>
              <RowActions
                actions={[CommonActions.create(handleCreate)]}
                justify="start"
                gap="medium"
              />
            </>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      {selectedPlan && (
        <ActionConfirm
          ref={confirmRef}
          title="Xác nhận xóa gói dịch vụ"
          confirmText="Xóa"
          cancelText="Hủy"
          variant="destructive"
          onConfirm={handleConfirmDelete}
          message={`Bạn có chắc chắn muốn xóa gói dịch vụ "${selectedPlan.name}" không?`}
        />
      )}
    </BaseView>
  );
}
