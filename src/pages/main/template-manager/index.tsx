import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import { getEnumName } from "@/common/helpers/enumHelper";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import { CommonActions } from "@/components/layout/CommonActions";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import { RowActions } from "@/components/layout/RowActions";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterTemplateDto, PaginationDto, TemplateDto } from "@/dto";
import {
  usePaginationTemplate,
  useSetIsDeletedTemplate,
  useSetIsShowTemplate,
  useSetPremiumTemplate,
} from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import {
  CheckCircle,
  Crown,
  Edit,
  Eye,
  EyeOff,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterTemplateDto = {};

type ActionType = "show" | "hide" | "premium" | "free" | "delete" | "restore";

export default function TemplateManagerPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTemplateDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterTemplateDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<TemplateDto[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateDto | null>(
    null,
  );
  const [actionType, setActionType] = useState<ActionType | null>(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { onSetIsDeletedTemplate, isLoading: isLoadingIsDeleted } =
    useSetIsDeletedTemplate();
  const { onSetIsShowTemplate, isLoading: isLoadingIsShow } =
    useSetIsShowTemplate();
  const { onSetPremiumTemplate, isLoading: isLoadingPremium } =
    useSetPremiumTemplate();
  const { data, isLoading, refetch, total } = usePaginationTemplate(pagination);

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as FilterTemplateDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const askConfirm = (record: TemplateDto, type: ActionType) => {
    setSelectedTemplate(record);
    setActionType(type);
    confirmRef.current?.show();
  };

  const handleConfirm = async () => {
    if (!selectedTemplate || !actionType) return;

    switch (actionType) {
      case "show":
        await onSetIsShowTemplate({
          id: selectedTemplate.id,
          isShow: true,
        });
        break;
      case "hide":
        await onSetIsShowTemplate({
          id: selectedTemplate.id,
          isShow: false,
        });
        break;
      case "premium":
        await onSetPremiumTemplate({
          id: selectedTemplate.id,
          isPremium: true,
        });
        break;
      case "free":
        await onSetPremiumTemplate({
          id: selectedTemplate.id,
          isPremium: false,
        });
        break;
      case "delete":
        await onSetIsDeletedTemplate({
          id: selectedTemplate.id,
          isDeleted: true,
        });
        break;
      case "restore":
        await onSetIsDeletedTemplate({
          id: selectedTemplate.id,
          isDeleted: false,
        });
        break;
    }

    await refetch();
    setSelectedTemplate(null);
    setActionType(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER.children
        .ADD_TEMPLATE.path,
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "name",
      label: "Tên template",
      type: "input",
      placeholder: "Nhập tên template",
      col: 6,
    },
    {
      key: "themeCode",
      label: "Mã theme",
      type: "input",
      placeholder: "Nhập mã theme",
      col: 6,
    },
    {
      key: "isShow",
      label: "Trạng thái hiển thị",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Hiển thị", value: true },
        { label: "Ẩn", value: false },
      ],
      col: 6,
    },
    {
      key: "isPremium",
      label: "Premium",
      type: "select",
      placeholder: "Chọn loại",
      options: [
        { label: "Premium", value: true },
        { label: "Free", value: false },
      ],
      col: 6,
    },
    {
      key: "isDeleted",
      label: "Trạng thái hoạt động",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.STATUS_FILTER || {}).map((item) => ({
        label: item.name,
        value: item.value,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<TemplateDto>[] = [
    {
      field: "name",
      header: "Tên template",
      width: 200,
      sortable: true,
      frozen: true,
    },
    {
      field: "slug",
      header: "Slug",
      width: 150,
      sortable: true,
    },
    {
      field: "themeCode",
      header: "Mã theme",
      width: 100,
      align: "center",
      body: (rowData: TemplateDto) => (
        <>{getEnumName(enumData.THEME_CODE, rowData.themeCode)}</>
      ),
    },
    {
      field: "isShow",
      header: "Hiển thị",
      width: 100,
      align: "center",
      type: "boolean",
    },
    {
      field: "isPremium",
      header: "Premium",
      width: 100,
      align: "center",
      type: "boolean",
    },
    {
      field: "minPlan",
      header: "Gói tối thiểu",
      width: 120,
      align: "center",
    },
    {
      field: "trialDays",
      header: "Ngày dùng thử",
      width: 120,
      align: "center",
    },
    {
      field: "isDeleted",
      header: "Hoạt động",
      width: 150,
      align: "center",
      type: "tag",
      body: (rowData: TemplateDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<TemplateDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER.children.DETAIL_TEMPLATE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: <Edit className="size-3.5" />,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.INVITATION_MANAGER.children.TEMPLATE_MANAGER.children.EDIT_TEMPLATE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "show",
      icon: <Eye className="size-3.5" />,
      tooltip: "Hiển thị",
      severity: "info",
      visible: (record) => !record.isDeleted && !record.isShow,
      onClick: (record) => askConfirm(record, "show"),
    },
    {
      key: "hide",
      icon: <EyeOff className="size-3.5" />,
      tooltip: "Ẩn",
      severity: "warning",
      visible: (record) => !record.isDeleted && !!record.isShow,
      onClick: (record) => askConfirm(record, "hide"),
    },
    {
      key: "premium",
      icon: <Crown className="size-3.5" />,
      tooltip: "Đặt Premium",
      severity: "success",
      visible: (record) => !record.isDeleted && !record.isPremium,
      onClick: (record) => askConfirm(record, "premium"),
    },
    {
      key: "free",
      icon: <XCircle className="size-3.5" />,
      tooltip: "Bỏ Premium",
      severity: "secondary",
      visible: (record) => !record.isDeleted && !!record.isPremium,
      onClick: (record) => askConfirm(record, "free"),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Ngưng hoạt động",
      severity: "danger",
      visible: (record) => !record.isDeleted,
      onClick: (record) => askConfirm(record, "delete"),
    },
    {
      key: "restore",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => !!record.isDeleted,
      onClick: (record) => askConfirm(record, "restore"),
    },
  ];

  const confirmConfig: Record<
    ActionType,
    { title: string; message: string; confirmText: string }
  > = {
    show: {
      title: "Xác nhận hiển thị",
      message: "Bạn có chắc chắn muốn hiển thị template này không?",
      confirmText: "Hiển thị",
    },
    hide: {
      title: "Xác nhận ẩn",
      message: "Bạn có chắc chắn muốn ẩn template này không?",
      confirmText: "Ẩn",
    },
    premium: {
      title: "Xác nhận đặt Premium",
      message: "Bạn có chắc chắn muốn đặt template này thành Premium không?",
      confirmText: "Đặt Premium",
    },
    free: {
      title: "Xác nhận bỏ Premium",
      message:
        "Bạn có chắc chắn muốn bỏ trạng thái Premium của template này không?",
      confirmText: "Bỏ Premium",
    },
    delete: {
      title: "Xác nhận ngưng hoạt động",
      message: "Bạn có chắc chắn muốn ngưng hoạt động template này không?",
      confirmText: "Ngưng hoạt động",
    },
    restore: {
      title: "Xác nhận kích hoạt",
      message: "Bạn có chắc chắn muốn kích hoạt template này không?",
      confirmText: "ích hoạt",
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

      <TableCustom<TemplateDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading || isLoadingIsDeleted || isLoadingIsShow || isLoadingPremium
        }
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy template nào"
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
          leftContent: (
            <>
              <RowActions
                actions={[CommonActions.create(handleCreate)]}
                justify="start"
                gap="medium"
              />
            </>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={confirmRef}
        title={currentConfirm?.title || "Xác nhận"}
        message={
          currentConfirm?.message ||
          "Bạn có chắc chắn muốn thực hiện hành động này?"
        }
        confirmText={currentConfirm?.confirmText || "Xác nhận"}
        cancelText="Hủy"
        variant={actionType === "delete" ? "destructive" : "default"}
        onConfirm={handleConfirm}
      />
    </BaseView>
  );
}
