import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { FilterWeddingDto, PaginationDto, WeddingDto } from "@/dto";
import { usePaginationWedding } from "@/hooks/wedding";
import { useRouter } from "@/routes/hooks";
import { Eye } from "lucide-react";
import { useState } from "react";

const initFilter: FilterWeddingDto = {};

export default function WeddingListPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterWeddingDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterWeddingDto>>(
    {
      skip: 0,
      take: 10,
      where: initFilter,
    },
  );
  const [selectedRows, setSelectedRows] = useState<WeddingDto[]>([]);
  const { data, isLoading, refetch, total } = usePaginationWedding(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterWeddingDto);
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
      key: "slug",
      label: "Slug",
      type: "input",
      placeholder: "Nhập slug",
      col: 6,
    },
    {
      key: "groomName",
      label: "Tên chú rể",
      type: "input",
      placeholder: "Nhập tên chú rể",
      col: 6,
    },
    {
      key: "brideName",
      label: "Tên cô dâu",
      type: "input",
      placeholder: "Nhập tên cô dâu",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.WEDDING_STATUS).map((item) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<WeddingDto>[] = [
    {
      field: "slug",
      header: "Slug",
      width: 150,
      sortable: true,
    },
    {
      field: "groomName",
      header: "Chú rể",
      width: 180,
      sortable: true,
    },
    {
      field: "brideName",
      header: "Cô dâu",
      width: 180,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (rowData) => {
        const status = Object.values(enumData.WEDDING_STATUS).find(
          (item) => item.code === rowData.status,
        );
        return (
          <span
            className={`px-2 py-1 rounded-md text-sm font-semibold ${
              status?.color
            }`}
          >
            {status?.name || rowData.status}
          </span>
        );
      },
    },
    {
      field: "ceremonyAt",
      header: "Ngày cưới",
      width: 160,
      type: "datetime",
      align: "center",
    },
  ];

  const rowActions: RowAction<WeddingDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.WEDDING_MANAGER.children.WEDDING_LIST.children.DETAIL_WEDDING.path.replace(
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
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<WeddingDto>
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
        emptyText="Không tìm thấy đám cưới nào"
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
