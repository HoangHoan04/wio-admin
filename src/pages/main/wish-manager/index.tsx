import BaseView from "@/components/layout/BaseView";
import FilterComponent from "@/components/layout/FilterComponent";
import type { FilterField } from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { ActionConfirmRef } from "@/components/ui/action-confirm";
import { ActionConfirm } from "@/components/ui/action-confirm";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterWishDto, IWish, PaginationDto } from "@/dto";
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
  const [selectedRows, setSelectedRows] = useState<IWish[]>([]);
  const [selectedWish, setSelectedWish] = useState<IWish | null>(null);
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
    record: IWish,
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

  const columns: TableColumn<IWish>[] = [
    {
      field: "guestName",
      header: "Tên khách mời",
      width: 180,
      sortable: true,
    },
    {
      field: "content",
      header: "Nội dung",
      width: 300,
      body: (rowData: IWish) => (
        <div className="max-w-75 truncate">{rowData.content}</div>
      ),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (rowData: IWish) => {
        const map: Record<
          string,
          { severity: "success" | "warning" | "danger" | "info"; label: string }
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
    {
      field: "isPinned",
      header: "Ghim",
      width: 80,
      align: "center",
      type: "boolean",
    },
  ];

  const rowActions: RowAction<IWish>[] = [
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
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<IWish>
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
