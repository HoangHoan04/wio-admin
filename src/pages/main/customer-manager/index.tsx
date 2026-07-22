import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { PaginationDto } from "@/dto";
import type { CustomerDto, FilterCustomerDto } from "@/dto/customer.dto";
import {
  useActivateCustomer,
  useDeactivateCustomer,
  usePaginationCustomer,
} from "@/hooks/customer";
import { useRouter } from "@/routes/hooks";
import { Ban, CheckCircle, Eye } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterCustomerDto = {};

export default function CustomerManagerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterCustomerDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterCustomerDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<CustomerDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<CustomerDto | null>(null);

  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationCustomer(pagination);
  const { onActivateCustomer, isLoading: isLoadingActivate } =
    useActivateCustomer();
  const { onDeactivateCustomer, isLoading: isLoadingDeactivate } =
    useDeactivateCustomer();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: FilterCustomerDto) => {
    setFilter(newFilters);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedUser) return;
    await onActivateCustomer(selectedUser.id);
    await refetch();
    setSelectedUser(null);
  };

  const handleDeactivate = async () => {
    if (!selectedUser) return;
    await onDeactivateCustomer(selectedUser.id);
    await refetch();
    setSelectedUser(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã khách hàng",
      type: "input",
      placeholder: "Nhập mã khách hàng",
      col: 8,
    },
    {
      key: "fullName",
      label: "Tên người dùng",
      type: "input",
      placeholder: "Nhập tên người dùng",
      col: 8,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 8,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 8,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.STATUS_FILTER).map((status) => ({
        label: status.name,
        value: status.value,
      })),
      col: 8,
    },
  ];

  const columns: TableColumn<CustomerDto>[] = [
    {
      field: "code",
      header: "Mã khách hàng",
      width: 150,
      sortable: true,
    },
    {
      field: "fullName",
      header: "Tên người dùng",
      width: 200,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 200,
      sortable: true,
    },

    {
      field: "phone",
      header: "Số điện thoại",
      width: 150,
      sortable: true,
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      type: "tag",
      body: (rowData: CustomerDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<CustomerDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.CUSTOMER_MANAGER.children.DETAIL_CUSTOMER.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "deactivate",
      icon: <Ban className="size-3.5" />,
      tooltip: "Ngưng hoạt động",
      severity: "danger",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedUser(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => !!record.isDeleted,
      onClick: (record) => {
        setSelectedUser(record);
        activateConfirmRef.current?.show();
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

      <TableCustom<CustomerDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingActivate || isLoadingDeactivate}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy người dùng nào"
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
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt tài khoản"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
        message="Bạn có chắc chắn muốn kích hoạt tài khoản này không?"
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngưng hoạt động tài khoản"
        confirmText="Ngưng hoạt động"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDeactivate}
        message="Bạn có chắc chắn muốn ngưng hoạt động tài khoản này không?"
      />
    </BaseView>
  );
}
