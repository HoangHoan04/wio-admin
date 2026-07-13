import { ROUTES } from "@/common/constants";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterWeddingDto, IWedding, PaginationDto } from "@/dto";
import {
  useDeleteWedding,
  usePaginationWedding,
  usePublishWedding,
  useUnpublishWedding,
} from "@/hooks/wedding";
import { useRouter } from "@/routes/hooks";
import { Eye, Globe, GlobeOff, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

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
  const [selectedRows, setSelectedRows] = useState<IWedding[]>([]);
  const [selectedWedding, setSelectedWedding] = useState<IWedding | null>(null);
  const [actionType, setActionType] = useState<
    "publish" | "unpublish" | "delete" | null
  >(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationWedding(pagination);
  const { onPublishWedding, isLoading: isLoadingPublish } = usePublishWedding();
  const { onUnpublishWedding, isLoading: isLoadingUnpublish } =
    useUnpublishWedding();
  const { onDeleteWedding, isLoading: isLoadingDelete } = useDeleteWedding();

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

  const handleConfirmAction = async () => {
    if (!selectedWedding || !actionType) return;
    if (actionType === "publish") await onPublishWedding(selectedWedding.id);
    else if (actionType === "unpublish")
      await onUnpublishWedding(selectedWedding.id);
    else if (actionType === "delete") await onDeleteWedding(selectedWedding.id);
    await refetch();
    setSelectedWedding(null);
    setActionType(null);
  };

  const askConfirm = (
    record: IWedding,
    action: "publish" | "unpublish" | "delete",
  ) => {
    setSelectedWedding(record);
    setActionType(action);
    confirmRef.current?.show();
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
      options: [
        { label: "Đã xuất bản", value: "PUBLISHED" },
        { label: "Chưa xuất bản", value: "DRAFT" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<IWedding>[] = [
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
      body: (rowData: IWedding) => (
        <StatusTag
          severity={rowData.status === "PUBLISHED" ? "success" : "warning"}
          value={rowData.status === "PUBLISHED" ? "Đã xuất bản" : "Bản nháp"}
        />
      ),
    },
    {
      field: "ceremonyAt",
      header: "Ngày cưới",
      width: 160,
      type: "datetime",
      align: "center",
    },
  ];

  const rowActions: RowAction<IWedding>[] = [
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
    {
      key: "publish",
      icon: <Globe className="size-3.5" />,
      tooltip: "Xuất bản",
      severity: "success",
      visible: (record) => record.status !== "PUBLISHED",
      onClick: (record) => askConfirm(record, "publish"),
    },
    {
      key: "unpublish",
      icon: <GlobeOff className="size-3.5" />,
      tooltip: "Hủy xuất bản",
      severity: "warning",
      visible: (record) => record.status === "PUBLISHED",
      onClick: (record) => askConfirm(record, "unpublish"),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => askConfirm(record, "delete"),
    },
  ];

  const confirmConfig = {
    publish: {
      title: "Xác nhận xuất bản",
      message: "Bạn có chắc chắn muốn xuất bản đám cưới này không?",
      confirmText: "Xuất bản",
    },
    unpublish: {
      title: "Xác nhận hủy xuất bản",
      message: "Bạn có chắc chắn muốn hủy xuất bản đám cưới này không?",
      confirmText: "Hủy xuất bản",
    },
    delete: {
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa đám cưới này không?",
      confirmText: "Xóa",
    },
  };

  const currentConfirm = actionType ? confirmConfig[actionType] : null;

  return (
    <BaseView>
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<IWedding>
        data={data || []}
        columns={columns}
        loading={
          isLoading || isLoadingPublish || isLoadingUnpublish || isLoadingDelete
        }
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

      {currentConfirm && (
        <ActionConfirm
          ref={confirmRef}
          title={currentConfirm.title}
          confirmText={currentConfirm.confirmText}
          cancelText="Hủy"
          variant={actionType === "delete" ? "destructive" : undefined}
          onConfirm={handleConfirmAction}
          message={currentConfirm.message}
        />
      )}
    </BaseView>
  );
}
