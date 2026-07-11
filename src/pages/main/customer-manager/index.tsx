import { ROUTES } from "@/common/constants";
import BaseView from "@/components/layout/BaseView";
import FilterComponent from "@/components/layout/FilterComponent";
import type { FilterField } from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { ActionConfirmRef } from "@/components/ui/action-confirm";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterCustomerDto, ICustomer, PaginationDto } from "@/dto";
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
  const [selectedRows, setSelectedRows] = useState<ICustomer[]>([]);
  const [selectedUser, setSelectedUser] = useState<ICustomer | null>(null);

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

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterCustomerDto);
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
      key: "fullName",
      label: "Tên người dùng",
      type: "input",
      placeholder: "Nhập tên người dùng",
      col: 6,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Hoạt động", value: false },
        { label: "Đình chỉ", value: true },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<ICustomer>[] = [
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
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: ICustomer) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={rowData.isDeleted ? "Đình chỉ" : "Hoạt động"}
        />
      ),
    },
  ];

  const rowActions: RowAction<ICustomer>[] = [
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
      tooltip: "Đình chỉ",
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
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<ICustomer>
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
        title="Xác nhận đình chỉ tài khoản"
        confirmText="Đình chỉ"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDeactivate}
        message="Bạn có chắc chắn muốn đình chỉ tài khoản này không?"
      />
    </BaseView>
  );
}
