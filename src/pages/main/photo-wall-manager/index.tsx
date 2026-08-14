import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterPhotoWallDto, PaginationDto, PhotoWallDto } from "@/dto";
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
  const [selectedRows, setSelectedRows] = useState<PhotoWallDto[]>([]);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoWallDto | null>(null);
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

  const handleFiltersChange = (newFilters: FilterPhotoWallDto) => {
    setFilter(newFilters);
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
    record: PhotoWallDto,
    action: "approve" | "reject" | "delete",
  ) => {
    setSelectedPhoto(record);
    setActionType(action);
    confirmRef.current?.show();
  };

  const filterFields: FilterField[] = [
    {
      key: "uploaderName",
      label: "Tên người gửi",
      type: "input",
      placeholder: "Nhập tên người gửi",
      col: 6,
    },
    {
      key: "isApproved",
      label: "Trạng thái duyệt",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Đã duyệt", value: true as any },
        { label: "Chờ duyệt", value: false as any },
      ],
      col: 6,
    },
  ];

  const columns: TableColumn<PhotoWallDto>[] = [
    {
      field: "url",
      header: "Hình ảnh",
      width: 100,
      align: "center",
      body: (rowData: PhotoWallDto) => {
        const imgUrl = rowData.url || rowData.photoUrl;
        return imgUrl ? (
          <img
            src={imgUrl}
            alt={rowData.uploaderName || "Ảnh"}
            className="size-12 rounded object-cover mx-auto border"
          />
        ) : (
          "—"
        );
      },
    },
    {
      field: "uploaderName",
      header: "Người gửi",
      width: 180,
      sortable: true,
      body: (row) => row.uploaderName || row.guestName || "—",
    },
    {
      field: "caption",
      header: "Lời nhắn (Caption)",
      width: 250,
      body: (rowData: PhotoWallDto) => (
        <div className="max-w-62.5 truncate">
          {rowData.caption || rowData.message || "—"}
        </div>
      ),
    },
    {
      field: "isApproved",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={row.isApproved ? "success" : "warning"}
          value={row.isApproved ? "Đã duyệt" : "Chờ duyệt"}
        />
      ),
    },
    {
      field: "createdAt",
      header: "Ngày gửi",
      width: 150,
      align: "center",
      body: (row) => (row.createdAt ? formatDateTime(row.createdAt) : "—"),
    },
  ];

  const rowActions: RowAction<PhotoWallDto>[] = [
    {
      key: "approve",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Phê duyệt",
      severity: "success",
      visible: (record) => !record.isApproved,
      onClick: (record) => askConfirm(record, "approve"),
    },
    {
      key: "reject",
      icon: <XCircle className="size-3.5" />,
      tooltip: "Từ chối",
      severity: "warning",
      visible: (record) => !!record.isApproved,
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
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<PhotoWallDto>
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
