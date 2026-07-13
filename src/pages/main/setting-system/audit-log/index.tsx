import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { ActionLogDto, ActionLogFilterDto, PaginationDto } from "@/dto";
import { usePaginationActionLog } from "@/hooks/action-log";
import { useState } from "react";

const initFilter: ActionLogFilterDto = {};

export default function AuditLogPage() {
  const [filter, setFilter] = useState<ActionLogFilterDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<ActionLogFilterDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, isLoading, refetch, total } =
    usePaginationActionLog(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as ActionLogFilterDto);
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
      key: "createdByName",
      label: "Người thực hiện",
      type: "input",
      placeholder: "Nhập tên người dùng",
      col: 6,
    },
    {
      key: "actionType",
      label: "Loại hành động",
      type: "input",
      placeholder: "Nhập loại hành động",
      col: 6,
    },
    {
      key: "entityName",
      label: "Đối tượng",
      type: "input",
      placeholder: "Nhập tên đối tượng",
      col: 6,
    },
  ];

  const columns: TableColumn<ActionLogDto>[] = [
    {
      field: "createdByName",
      header: "Người thực hiện",
      width: 180,
      sortable: true,
    },
    {
      field: "actionType",
      header: "Hành động",
      width: 130,
      align: "center",
    },
    {
      field: "entityName",
      header: "Đối tượng",
      width: 150,
    },
    {
      field: "entityId",
      header: "ID đối tượng",
      width: 200,
      body: (rowData: ActionLogDto) => (
        <span className="text-xs font-mono">{rowData.entityId || "-"}</span>
      ),
    },
    {
      field: "createdAt",
      header: "Thời gian",
      width: 180,
      type: "datetime",
    },
    {
      field: "ipAddress",
      header: "IP",
      width: 130,
      body: (rowData: ActionLogDto) => rowData.ipAddress || "-",
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

      <TableCustom<ActionLogDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        enableSelection={true}
        selectedRows={[]}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy lịch sử hoạt động"
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
