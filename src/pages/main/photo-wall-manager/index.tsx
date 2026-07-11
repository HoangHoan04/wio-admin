import BaseView from "@/components/layout/BaseView";
import FilterComponent from "@/components/layout/FilterComponent";
import type { FilterField } from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { ActionConfirmRef } from "@/components/ui/action-confirm";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterPhotoWallDto, IPhotoWall, PaginationDto } from "@/dto";
import {
  useApprovePhotoWall,
  useDeletePhotoWall,
  usePaginationPhotoWall,
  useRejectPhotoWall,
} from "@/hooks/photo-wall";
import { CheckCircle, Trash2, XCircle } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterPhotoWallDto = {};

export default function PhotoWallManagerPage() {
  const [filter, setFilter] = useState<FilterPhotoWallDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterPhotoWallDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<IPhotoWall[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<IPhotoWall | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "delete" | null
  >(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationPhotoWall(pagination);
  const { onApprovePhotoWall, isLoading: isLoadingApprove } =
    useApprovePhotoWall();
  const { onRejectPhotoWall, isLoading: isLoadingReject } =
    useRejectPhotoWall();
  const { onDeletePhotoWall, isLoading: isLoadingDelete } =
    useDeletePhotoWall();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterPhotoWallDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleConfirmAction = async () => {
    if (!selectedPhoto || !actionType) return;
    if (actionType === "approve") await onApprovePhotoWall(selectedPhoto.id);
    else if (actionType === "reject") await onRejectPhotoWall(selectedPhoto.id);
    else if (actionType === "delete") await onDeletePhotoWall(selectedPhoto.id);
    await refetch();
    setSelectedPhoto(null);
    setActionType(null);
  };

  const askConfirm = (
    record: IPhotoWall,
    action: "approve" | "reject" | "delete",
  ) => {
    setSelectedPhoto(record);
    setActionType(action);
    confirmRef.current?.show();
  };

  const filterFields: FilterField[] = [
    {
      key: "guestName",
      label: "Tên khách mời",
      type: "input",
      placeholder: "Nhập tên khách mời",
      col: 6,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Chờ duyệt", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<IPhotoWall>[] = [
    {
      field: "guestName",
      header: "Tên khách mời",
      width: 180,
      sortable: true,
    },
    {
      field: "message",
      header: "Lời nhắn",
      width: 250,
      body: (rowData: IPhotoWall) => (
        <div className="max-w-62.5 truncate">{rowData.message || "-"}</div>
      ),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (rowData: IPhotoWall) => {
        const map: Record<
          string,
          { severity: "success" | "warning" | "danger"; label: string }
        > = {
          APPROVED: { severity: "success", label: "Đã duyệt" },
          PENDING: { severity: "warning", label: "Chờ duyệt" },
          REJECTED: { severity: "danger", label: "Từ chối" },
        };
        const info = map[rowData.status] || {
          severity: "secondary" as const,
          label: rowData.status,
        };
        return <StatusTag severity={info.severity} value={info.label} />;
      },
    },
  ];

  const rowActions: RowAction<IPhotoWall>[] = [
    {
      key: "approve",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Phê duyệt",
      severity: "success",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => askConfirm(record, "approve"),
    },
    {
      key: "reject",
      icon: <XCircle className="size-3.5" />,
      tooltip: "Từ chối",
      severity: "danger",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => askConfirm(record, "reject"),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => askConfirm(record, "delete"),
    },
  ];

  const confirmConfig: Record<
    string,
    { title: string; message: string; confirmText: string }
  > = {
    approve: {
      title: "Xác nhận phê duyệt",
      message: "Bạn có chắc chắn muốn phê duyệt ảnh này không?",
      confirmText: "Phê duyệt",
    },
    reject: {
      title: "Xác nhận từ chối",
      message: "Bạn có chắc chắn muốn từ chối ảnh này không?",
      confirmText: "Từ chối",
    },
    delete: {
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa ảnh này không?",
      confirmText: "Xóa",
    },
  };

  const currentConfirm = actionType ? confirmConfig[actionType] : null;

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<IPhotoWall>
        data={data || []}
        columns={columns}
        loading={
          isLoading || isLoadingApprove || isLoadingReject || isLoadingDelete
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy ảnh nào"
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
          variant={
            actionType === "delete" || actionType === "reject"
              ? "destructive"
              : undefined
          }
          onConfirm={handleConfirmAction}
          message={currentConfirm.message}
        />
      )}
    </BaseView>
  );
}
