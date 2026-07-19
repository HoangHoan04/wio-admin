import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { PaginationDto } from "@/dto";
import type { FilterGuestDto, GuestDto } from "@/dto/guest.dto";
import { usePaginationGuest } from "@/hooks/guest";
import { useRouter } from "@/routes/hooks";
import { Eye } from "lucide-react";
import { useState } from "react";

const initFilter: FilterGuestDto = {};

export default function GuestManagerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterGuestDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterGuestDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<GuestDto[]>([]);

  const { data, isLoading, refetch, total } = usePaginationGuest(pagination);

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

  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "Họ tên",
      type: "input",
      placeholder: "Nhập họ tên",
      col: 6,
    },
    {
      key: "invitationCode",
      label: "Mã mời",
      type: "input",
      placeholder: "Nhập mã mời",
      col: 6,
    },
    {
      key: "rsvpStatus",
      label: "Trạng thái RSVP",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.RSVP_STATUS).map((status) => ({
        label: status.name,
        value: status.code,
      })),
      col: 6,
    },
    {
      key: "side",
      label: "Khách của ai",
      type: "select",
      placeholder: "Chọn bên",
      options: Object.values(enumData.GUEST_SIDE).map((side) => ({
        label: side.name,
        value: side.code,
      })),
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
      field: "invitationCode",
      header: "Mã mời",
      width: 120,
      sortable: true,
    },
    {
      field: "side",
      header: "Bên",
      width: 120,
    },
    {
      field: "rsvpStatus",
      header: "RSVP",
      width: 130,
      align: "center",
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
        loading={isLoading}
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
    </BaseView>
  );
}
