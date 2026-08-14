import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterWishDto, PaginationDto, WishDto } from "@/dto";
import {
  useApproveWish,
  useDeleteWish,
  usePaginationWish,
  usePinWish,
  useRejectWish,
  useUnpinWish,
} from "@/hooks/wish";
import { CheckCircle, Pin, PinOff, Trash2, XCircle } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterWishDto = {};

export default function WishManagerPage() {
  const [filter, setFilter] = useState<FilterWishDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterWishDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<WishDto[]>([]);
  const [selectedWish, setSelectedWish] = useState<WishDto | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "pin" | "unpin" | "delete" | null
  >(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationWish(pagination);
  const { onApproveWish, isLoading: isLoadingApprove } = useApproveWish();
  const { onRejectWish, isLoading: isLoadingReject } = useRejectWish();
  const { onPinWish, isLoading: isLoadingPin } = usePinWish();
  const { onUnpinWish, isLoading: isLoadingUnpin } = useUnpinWish();
  const { onDeleteWish, isLoading: isLoadingDelete } = useDeleteWish();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterWishDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleConfirmAction = async () => {
    if (!selectedWish || !actionType) return;
    if (actionType === "approve") await onApproveWish(selectedWish.id);
    else if (actionType === "reject") await onRejectWish(selectedWish.id);
    else if (actionType === "pin") await onPinWish(selectedWish.id);
    else if (actionType === "unpin") await onUnpinWish(selectedWish.id);
    else if (actionType === "delete") await onDeleteWish(selectedWish.id);
    await refetch();
    setSelectedWish(null);
    setActionType(null);
  };

  const askConfirm = (
    record: WishDto,
    action: "approve" | "reject" | "pin" | "unpin" | "delete",
  ) => {
    setSelectedWish(record);
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

  const columns: TableColumn<WishDto>[] = [
    {
      field: "guestName",
      header: "Tên khách mời",
      width: 180,
      sortable: true,
    },
    {
      field: "content",
      header: "Nội dung lời chúc",
      width: 300,
      body: (rowData: WishDto) => (
        <div className="max-w-75 truncate">{rowData.content}</div>
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
      field: "isPinned",
      header: "Ghim",
      width: 80,
      align: "center",
      type: "boolean",
    },
    {
      field: "createdAt",
      header: "Ngày gửi",
      width: 150,
      align: "center",
      body: (row) => (row.createdAt ? formatDateTime(row.createdAt) : "—"),
    },
  ];

  const rowActions: RowAction<WishDto>[] = [
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
      key: "pin",
      icon: <Pin className="size-3.5" />,
      tooltip: "Ghim",
      severity: "info",
      visible: (record) => !record.isPinned,
      onClick: (record) => askConfirm(record, "pin"),
    },
    {
      key: "unpin",
      icon: <PinOff className="size-3.5" />,
      tooltip: "Bỏ ghim",
      severity: "warning",
      visible: (record) => !!record.isPinned,
      onClick: (record) => askConfirm(record, "unpin"),
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
      message: "Bạn có chắc chắn muốn phê duyệt lời chúc này không?",
      confirmText: "Phê duyệt",
    },
    reject: {
      title: "Xác nhận từ chối",
      message: "Bạn có chắc chắn muốn từ chối lời chúc này không?",
      confirmText: "Từ chối",
    },
    pin: {
      title: "Xác nhận ghim",
      message: "Bạn có chắc chắn muốn ghim lời chúc này không?",
      confirmText: "Ghim",
    },
    unpin: {
      title: "Xác nhận bỏ ghim",
      message: "Bạn có chắc chắn muốn bỏ ghim lời chúc này không?",
      confirmText: "Bỏ ghim",
    },
    delete: {
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa lời chúc này không?",
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

      <TableCustom<WishDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingApprove ||
          isLoadingReject ||
          isLoadingPin ||
          isLoadingUnpin ||
          isLoadingDelete
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy lời chúc nào"
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
