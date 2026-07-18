import { ROUTES } from "@/common/constants";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { PaginationDto } from "@/dto";
import type { FilterGuestDto, GuestDto } from "@/dto/guest.dto";
import { useDeleteGuest, usePaginationGuest } from "@/hooks/guest";
import { useRouter } from "@/routes/hooks";
import { Eye, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterGuestDto = {};

const sideLabel = (side?: string) => {
  switch (side) {
    case "GROOM":
      return "Bên chú rể";
    case "BRIDE":
      return "Bên cô dâu";
    default:
      return "Cả hai";
  }
};

const rsvpSeverity = (status?: string) => {
  switch (status) {
    case "ATTENDING":
      return "success";
    case "DECLINED":
      return "danger";
    default:
      return "warning";
  }
};

const rsvpLabel = (status?: string) => {
  switch (status) {
    case "ATTENDING":
      return "Tham dự";
    case "DECLINED":
      return "Từ chối";
    default:
      return "Chưa phản hồi";
  }
};

export default function GuestManagerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterGuestDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterGuestDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<GuestDto[]>([]);
  const [selectedGuest, setSelectedGuest] = useState<GuestDto | null>(null);

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationGuest(pagination);
  const { onDeleteGuest, isLoading: isLoadingDelete } = useDeleteGuest();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: FilterGuestDto) => {
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
    if (!selectedGuest) return;
    await onDeleteGuest(selectedGuest.id);
    await refetch();
    setSelectedGuest(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "Họ tên",
      type: "input",
      placeholder: "Nhập họ tên",
      col: 6,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập SĐT",
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
      key: "invitationCode",
      label: "Mã mờ",
      type: "input",
      placeholder: "Nhập mã mờ",
      col: 6,
    },
    {
      key: "rsvpStatus",
      label: "Trạng thái RSVP",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Chưa phản hồi", value: "PENDING" },
        { label: "Tham dự", value: "ATTENDING" },
        { label: "Từ chối", value: "DECLINED" },
      ],
      col: 6,
    },
    {
      key: "side",
      label: "Khách của ai",
      type: "select",
      placeholder: "Chọn bên",
      options: [
        { label: "Bên chú rể", value: "GROOM" },
        { label: "Bên cô dâu", value: "BRIDE" },
        { label: "Cả hai", value: "BOTH" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<GuestDto>[] = [
    {
      field: "fullName",
      header: "Họ tên",
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
      field: "email",
      header: "Email",
      width: 200,
      sortable: true,
    },
    {
      field: "invitationCode",
      header: "Mã mờ",
      width: 120,
      sortable: true,
    },
    {
      field: "side",
      header: "Bên",
      width: 120,
      body: (rowData: GuestDto) => sideLabel(rowData.side),
    },
    {
      field: "rsvpStatus",
      header: "RSVP",
      width: 130,
      align: "center",
      body: (rowData: GuestDto) => (
        <StatusTag
          severity={rsvpSeverity(rowData.rsvpStatus)}
          value={rsvpLabel(rowData.rsvpStatus)}
        />
      ),
    },
    {
      field: "attendingCount",
      header: "Số khách",
      width: 100,
      align: "center",
    },
    {
      field: "isVip",
      header: "VIP",
      width: 80,
      align: "center",
      body: (rowData: GuestDto) => (
        <StatusTag
          severity={rowData.isVip ? "warning" : "secondary"}
          value={rowData.isVip ? "VIP" : "—"}
        />
      ),
    },
  ];

  const rowActions: RowAction<GuestDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.WEDDING_MANAGER.children.WEDDING_LIST.children.DETAIL_WEDDING.path.replace(
            ":id",
            record.weddingId,
          ),
        ),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        setSelectedGuest(record);
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

      <TableCustom<GuestDto>
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
        emptyText="Không tìm thấy khách mờnào"
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
        title="Xác nhận xóa khách mờ"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDelete}
        message="Bạn có chắc chắn muốn xóa khách mờnày không?"
      />
    </BaseView>
  );
}
