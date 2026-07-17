import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type {
  FilterMusicBackgroundDto,
  MusicBackgroundDto,
  PaginationDto,
} from "@/dto";
import {
  useDeleteMusicBackground,
  usePaginationMusicBackground,
} from "@/hooks/music-background";
import { Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterMusicBackgroundDto = {};

export default function MusicBackgroundManagerPage() {
  const [filter, setFilter] = useState<FilterMusicBackgroundDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterMusicBackgroundDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<MusicBackgroundDto[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicBackgroundDto | null>(
    null,
  );

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationMusicBackground(pagination);
  const { onDeleteMusicBackground, isLoading: isLoadingDelete } =
    useDeleteMusicBackground();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: FilterMusicBackgroundDto) => {
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
    if (!selectedMusic) return;
    await onDeleteMusicBackground(selectedMusic.id);
    await refetch();
    setSelectedMusic(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên nhạc",
      type: "input",
      placeholder: "Nhập tên nhạc",
      col: 6,
    },
    {
      key: "author",
      label: "Tác giả",
      type: "input",
      placeholder: "Nhập tác giả",
      col: 6,
    },
    {
      key: "isActive",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Hoạt động", value: true },
        { label: "Không hoạt động", value: false },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<MusicBackgroundDto>[] = [
    {
      field: "name",
      header: "Tên nhạc",
      width: 200,
      sortable: true,
    },
    {
      field: "author",
      header: "Tác giả",
      width: 150,
      sortable: true,
    },
    {
      field: "duration",
      header: "Thời lượng",
      width: 100,
      align: "center",
    },
    {
      field: "status",
      header: "Trạng thái xử lý",
      width: 140,
      align: "center",
    },
    {
      field: "isActive",
      header: "Kích hoạt",
      width: 100,
      align: "center",
      body: (rowData: MusicBackgroundDto) => (
        <StatusTag
          severity={rowData.isActive ? "success" : "secondary"}
          value={rowData.isActive ? "Có" : "Không"}
        />
      ),
    },
    {
      field: "usageCount",
      header: "Lượt sử dụng",
      width: 120,
      align: "center",
      body: (rowData: MusicBackgroundDto) => rowData.usageCount ?? 0,
    },
  ];

  const rowActions: RowAction<MusicBackgroundDto>[] = [
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        setSelectedMusic(record);
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

      <TableCustom<MusicBackgroundDto>
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
        emptyText="Không tìm thấy nhạc nền nào"
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
        message="Bạn có chắc chắn muốn xóa nhạc nền này không?"
      />
    </BaseView>
  );
}
