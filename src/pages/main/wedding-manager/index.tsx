import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { FilterInvitationDto, InvitationDto, PaginationDto } from "@/dto";
import {
  useDeleteInvitation,
  usePaginationInvitation,
  usePublishInvitation,
  useUnpublishInvitation,
} from "@/hooks/invitation";
import { useRouter } from "@/routes/hooks";
import { Eye, Globe, GlobeLock, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterInvitationDto = {};

export default function InvitationListPage() {
  const router = useRouter();
  const confirmRef = useRef<ActionConfirmRef>(null);
  const [filter, setFilter] = useState<FilterInvitationDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterInvitationDto>>(
    {
      skip: 0,
      take: 10,
      where: initFilter,
    },
  );
  const [selectedRows, setSelectedRows] = useState<InvitationDto[]>([]);
  const [selectedInvitation, setSelectedInvitation] =
    useState<InvitationDto | null>(null);
  const [actionType, setActionType] = useState<
    "publish" | "unpublish" | "delete" | null
  >(null);
  const { data, isLoading, refetch, total } = usePaginationInvitation(pagination);
  const { onPublishInvitation } = usePublishInvitation();
  const { onUnpublishInvitation } = useUnpublishInvitation();
  const { onDeleteInvitation } = useDeleteInvitation();

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

  const askConfirm = (
    record: InvitationDto,
    type: "publish" | "unpublish" | "delete",
  ) => {
    setSelectedInvitation(record);
    setActionType(type);
    confirmRef.current?.show();
  };

  const handleConfirm = async () => {
    if (!selectedInvitation || !actionType) return;
    if (actionType === "publish") {
      await onPublishInvitation(selectedInvitation.id);
    } else if (actionType === "unpublish") {
      await onUnpublishInvitation(selectedInvitation.id);
    } else {
      await onDeleteInvitation(selectedInvitation.id);
    }
    await refetch();
    setSelectedInvitation(null);
    setActionType(null);
  };

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
    {
      key: "publish",
      icon: <Globe className="size-3.5" />,
      tooltip: "Xuất bản",
      severity: "success",
      visible: (record) =>
        record.status !== enumData.INVITATION_STATUS.PUBLISHED.code,
      onClick: (record) => askConfirm(record, "publish"),
    },
    {
      key: "unpublish",
      icon: <GlobeLock className="size-3.5" />,
      tooltip: "Hủy xuất bản",
      severity: "warning",
      visible: (record) =>
        record.status === enumData.INVITATION_STATUS.PUBLISHED.code,
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

      {selectedInvitation && actionType && (
        <ActionConfirm
          ref={confirmRef}
          title={
            actionType === "delete"
              ? "Xác nhận xóa thiệp"
              : actionType === "publish"
                ? "Xác nhận xuất bản"
                : "Xác nhận hủy xuất bản"
          }
          confirmText={
            actionType === "delete"
              ? "Xóa"
              : actionType === "publish"
                ? "Xuất bản"
                : "Hủy xuất bản"
          }
          cancelText="Hủy"
          variant={actionType === "delete" ? "destructive" : "default"}
          onConfirm={handleConfirm}
          message={
            actionType === "delete"
              ? "Bạn có chắc chắn muốn xóa thiệp này không?"
              : actionType === "publish"
                ? "Xuất bản thiệp này để khách có thể xem?"
                : "Hủy xuất bản thiệp này?"
          }
        />
      )}
    </BaseView>
  );
}
