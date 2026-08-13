import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { FilterInvitationDto, InvitationDto, PaginationDto } from "@/dto";
import { usePaginationInvitation } from "@/hooks/invitation";
import { useRouter } from "@/routes/hooks";
import { Eye } from "lucide-react";
import { useState } from "react";

const initFilter: FilterInvitationDto = {};

export default function InvitationListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterInvitationDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterInvitationDto>>(
    {
      skip: 0,
      take: 10,
      where: initFilter,
    },
  );
  const [selectedRows, setSelectedRows] = useState<InvitationDto[]>([]);
  const { data, isLoading, refetch, total } = usePaginationInvitation(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tiêu đề",
      type: "input",
      placeholder: "Nhập tiêu đề",
      col: 6,
    },
    {
      key: "slug",
      label: "Slug",
      type: "input",
      placeholder: "Nhập slug",
      col: 6,
    },
    {
      key: "cardType",
      label: "Loại thiệp",
      type: "select",
      placeholder: "Chọn loại",
      options: Object.values(enumData.CARD_TYPE).map((item) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.INVITATION_STATUS).map((item) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<InvitationDto>[] = [
    {
      field: "title",
      header: "Tiêu đề",
      width: 220,
      sortable: true,
    },
    {
      field: "cardType",
      header: "Loại",
      width: 140,
      body: (row) => {
        const type = Object.values(enumData.CARD_TYPE).find(
          (item) => item.code === row.cardType,
        );
        return (
          <span
            className="px-2 py-1 rounded-md text-xs font-semibold text-white"
            style={{ background: type?.color || "#6B7280" }}
          >
            {type?.name || row.cardType}
          </span>
        );
      },
    },
    {
      field: "slug",
      header: "Slug",
      width: 150,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (rowData) => {
        const status = Object.values(enumData.INVITATION_STATUS).find(
          (item) => item.code === rowData.status,
        );
        return (
          <span className="px-2 py-1 rounded-md text-sm font-semibold">
            {status?.name || rowData.status}
          </span>
        );
      },
    },
    {
      field: "user",
      header: "User",
      width: 200,
      body: (row) => row.user?.email || row.userId,
    },
    {
      field: "primaryEventAt",
      header: "Sự kiện",
      width: 160,
      type: "datetime",
      align: "center",
    },
  ];

  const rowActions: RowAction<InvitationDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.INVITATION_MANAGER.children.INVITATION_LIST.children.DETAIL_INVITATION.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
  ];

  return (
    <BaseView>
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={(next) => setFilter(next as FilterInvitationDto)}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<InvitationDto>
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
        emptyText="Không tìm thấy thiệp nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={(page, pageSize) =>
          setPagination((prev) => ({
            ...prev,
            skip: (page - 1) * pageSize,
            take: pageSize,
          }))
        }
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
