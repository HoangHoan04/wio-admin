import { ROUTES } from "@/common/constants";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import { CommonActions } from "@/components/layout/CommonActions";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import { RowActions } from "@/components/layout/RowActions";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import type { FilterTemplateDto, PaginationDto, TemplateDto } from "@/dto";
import {
  useActivateTemplate,
  useDeactivateTemplate,
  useDeleteTemplate,
  usePaginationTemplate,
} from "@/hooks/template";
import { useRouter } from "@/routes/hooks";
import { CheckCircle, Eye, Trash2, XCircle } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterTemplateDto = {};

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
  const [actionType, setActionType] = useState<
    "activate" | "deactivate" | "delete" | null
  >(null);

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationTemplate(pagination);
  const { onActivateTemplate, isLoading: isLoadingActivate } =
    useActivateTemplate();
  const { onDeactivateTemplate, isLoading: isLoadingDeactivate } =
    useDeactivateTemplate();
  const { onDeleteTemplate, isLoading: isLoadingDelete } = useDeleteTemplate();

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

  const handleConfirmAction = async () => {
    if (!selectedTemplate || !actionType) return;
    if (actionType === "activate")
      await onActivateTemplate(selectedTemplate.id);
    else if (actionType === "deactivate")
      await onDeactivateTemplate(selectedTemplate.id);
    else if (actionType === "delete")
      await onDeleteTemplate(selectedTemplate.id);
    await refetch();
    setSelectedTemplate(null);
    setActionType(null);
  };

  const askConfirm = (
    record: TemplateDto,
    action: "activate" | "deactivate" | "delete",
  ) => {
    setSelectedTemplate(record);
    setActionType(action);
    confirmRef.current?.show();
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.children
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
  ];

  const rowActions: RowAction<TemplateDto>[] = [
    {
      key: "view",
      icon: <Eye className="size-3.5" />,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.WEDDING_MANAGER.children.TEMPLATE_MANAGER.children.DETAIL_TEMPLATE.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "activate",
      icon: <CheckCircle className="size-3.5" />,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => !record.isShow,
      onClick: (record) => askConfirm(record, "activate"),
    },
    {
      key: "deactivate",
      icon: <XCircle className="size-3.5" />,
      tooltip: "Vô hiệu hóa",
      severity: "warning",
      visible: (record) => !!record.isShow,
      onClick: (record) => askConfirm(record, "deactivate"),
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
    activate: {
      title: "Xác nhận kích hoạt",
      message: "Bạn có chắc chắn muốn kích hoạt template này không?",
      confirmText: "Kích hoạt",
    },
    deactivate: {
      title: "Xác nhận vô hiệu hóa",
      message: "Bạn có chắc chắn muốn vô hiệu hóa template này không?",
      confirmText: "Vô hiệu hóa",
    },
    delete: {
      title: "Xác nhận xóa",
      message: "Bạn có chắc chắn muốn xóa template này không?",
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

      <TableCustom<TemplateDto>
        data={data || []}
        columns={columns}
        loading={
          isLoading ||
          isLoadingActivate ||
          isLoadingDeactivate ||
          isLoadingDelete
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
