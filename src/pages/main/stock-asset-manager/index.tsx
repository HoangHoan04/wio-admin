import { enumData } from "@/common/enums";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import { CommonActions } from "@/components/layout/CommonActions";
import FileUploadCustom from "@/components/layout/FileUpload";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import { RowActions } from "@/components/layout/RowActions";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusTag } from "@/components/ui/status-tag";
import type {
  FilterStockAssetDto,
  PaginationDto,
  StockAssetDto,
} from "@/dto";
import {
  useCreateStockAsset,
  useDeleteStockAsset,
  usePaginationStockAsset,
  useUpdateStockAsset,
} from "@/hooks/stock-asset";
import { Edit, Sticker, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterStockAssetDto = {};

const KIND_OPTIONS = Object.values(enumData.STOCK_ASSET_KIND);
const CATEGORY_OPTIONS = Object.values(enumData.STOCK_ASSET_CATEGORY);

const emptyForm = {
  title: "",
  category: "hearts",
  tags: "",
  src: "",
  thumb: "",
  kind: "sticker",
  license: "InviGo",
  sortOrder: 0,
  isActive: true,
};

function parseTags(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function AssetForm({
  form,
  onChange,
}: {
  form: typeof emptyForm;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      <div className="space-y-2">
        <Label>Tên hiển thị</Label>
        <Input
          value={form.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Tim đỏ, hoa hồng..."
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Loại</Label>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm"
            value={form.kind}
            onChange={(e) => onChange("kind", e.target.value)}
          >
            {KIND_OPTIONS.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label>Danh mục</Label>
          <select
            className="h-9 w-full rounded-md border border-input bg-transparent px-2.5 text-sm"
            value={form.category}
            onChange={(e) => onChange("category", e.target.value)}
          >
            {CATEGORY_OPTIONS.map((item) => (
              <option key={item.code} value={item.code}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label>Tags (phẩy)</Label>
        <Input
          value={form.tags}
          onChange={(e) => onChange("tags", e.target.value)}
          placeholder="tim, heart, love"
        />
      </div>
      <div className="space-y-2">
        <Label>Ảnh PNG/WebP nền trong suốt</Label>
        <FileUploadCustom
          type="image"
          mode="single"
          initValue={form.src || null}
          onFileUploaded={(data) => {
            if (!data || Array.isArray(data)) {
              onChange("src", "");
              return;
            }
            onChange("src", data.fileUrl);
            if (!form.thumb) onChange("thumb", data.fileUrl);
          }}
        />
      </div>
      <div className="space-y-2">
        <Label>Bản quyền / nguồn</Label>
        <Input
          value={form.license}
          onChange={(e) => onChange("license", e.target.value)}
          placeholder="Fluent UI Emoji (MIT)"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label>Thứ tự</Label>
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => onChange("sortOrder", Number(e.target.value))}
          />
        </div>
        <label className="flex items-end gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => onChange("isActive", e.target.checked)}
          />
          Hiển thị trên editor
        </label>
      </div>
    </div>
  );
}

export default function StockAssetManagerPage() {
  const [filter, setFilter] = useState<FilterStockAssetDto>(initFilter);
  const [pagination, setPagination] = useState<
    PaginationDto<FilterStockAssetDto>
  >({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<StockAssetDto[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<StockAssetDto | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const deleteConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationStockAsset(pagination);
  const { onCreateStockAsset, isLoading: isLoadingCreate } =
    useCreateStockAsset();
  const { onUpdateStockAsset, isLoading: isLoadingUpdate } =
    useUpdateStockAsset();
  const { onDeleteStockAsset, isLoading: isLoadingDelete } =
    useDeleteStockAsset();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const toPayload = () => ({
    title: form.title.trim(),
    category: form.category,
    kind: form.kind,
    tags: parseTags(form.tags),
    src: form.src,
    thumb: form.thumb || form.src,
    license: form.license,
    sortOrder: Number(form.sortOrder) || 0,
    isActive: form.isActive,
  });

  const handleCreate = async () => {
    if (!form.title.trim() || !form.src) return;
    await onCreateStockAsset(toPayload());
    setOpenCreate(false);
    setForm(emptyForm);
    await refetch();
  };

  const handleEdit = async () => {
    if (!editingId || !form.title.trim() || !form.src) return;
    await onUpdateStockAsset({ id: editingId, ...toPayload() });
    setOpenEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    await refetch();
  };

  const openEditDialog = (record: StockAssetDto) => {
    setEditingId(record.id);
    setForm({
      title: record.title || "",
      category: record.category || "hearts",
      tags: (record.tags || []).join(", "),
      src: record.src || "",
      thumb: record.thumb || "",
      kind: record.kind || "sticker",
      license: record.license || "",
      sortOrder: record.sortOrder ?? 0,
      isActive: record.isActive ?? true,
    });
    setOpenEdit(true);
  };

  const filterFields: FilterField[] = [
    {
      key: "title",
      label: "Tên",
      type: "input",
      placeholder: "Nhập tên asset",
      col: 6,
    },
    {
      key: "kind",
      label: "Loại",
      type: "select",
      placeholder: "Chọn loại",
      options: KIND_OPTIONS.map((item) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
    {
      key: "category",
      label: "Danh mục",
      type: "select",
      placeholder: "Chọn danh mục",
      options: CATEGORY_OPTIONS.map((item) => ({
        label: item.name,
        value: item.code,
      })),
      col: 6,
    },
  ];

  const columns: TableColumn<StockAssetDto>[] = [
    {
      field: "src",
      header: "Ảnh",
      width: 80,
      body: (row) => (
        <img
          src={row.thumb || row.src}
          alt={row.title}
          className="h-10 w-10 rounded object-contain bg-muted"
        />
      ),
    },
    { field: "title", header: "Tên", width: 180, sortable: true },
    {
      field: "kind",
      header: "Loại",
      width: 110,
      body: (row) =>
        KIND_OPTIONS.find((item) => item.code === row.kind)?.name || row.kind,
    },
    {
      field: "category",
      header: "Danh mục",
      width: 130,
      body: (row) =>
        CATEGORY_OPTIONS.find((item) => item.code === row.category)?.name ||
        row.category,
    },
    { field: "license", header: "Bản quyền", width: 160 },
    {
      field: "isActive",
      header: "Hiển thị",
      width: 100,
      align: "center",
      body: (row) => (
        <StatusTag
          severity={row.isActive ? "success" : "secondary"}
          value={row.isActive ? "Có" : "Không"}
        />
      ),
    },
  ];

  const rowActions: RowAction<StockAssetDto>[] = [
    {
      key: "edit",
      icon: <Edit className="size-3.5" />,
      tooltip: "Sửa",
      severity: "info",
      onClick: (record) => openEditDialog(record),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5" />,
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        setSelectedAsset(record);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  const loading = isLoading || isLoadingCreate || isLoadingUpdate || isLoadingDelete;

  return (
    <BaseView>
      <FilterCustom
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<StockAssetDto>
        data={data || []}
        columns={columns}
        loading={loading}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Chưa có asset trong thư viện"
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
          leftContent: (
            <RowActions
              actions={[
                CommonActions.create(() => {
                  setForm(emptyForm);
                  setOpenCreate(true);
                }),
              ]}
              justify="start"
              gap="small"
            />
          ),
        }}
      />

      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xác nhận xóa"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={async () => {
          if (!selectedAsset) return;
          await onDeleteStockAsset(selectedAsset.id);
          await refetch();
          setSelectedAsset(null);
        }}
        message="Xóa asset này khỏi thư viện editor?"
      />

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sticker className="size-4" />
              Thêm sticker / họa tiết
            </DialogTitle>
          </DialogHeader>
          <AssetForm
            form={form}
            onChange={(field, value) =>
              setForm((prev) => ({ ...prev, [field]: value }))
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenCreate(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleCreate}
              disabled={!form.title.trim() || !form.src || isLoadingCreate}
            >
              {isLoadingCreate ? "Đang thêm..." : "Thêm"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="size-4" />
              Cập nhật asset
            </DialogTitle>
          </DialogHeader>
          <AssetForm
            form={form}
            onChange={(field, value) =>
              setForm((prev) => ({ ...prev, [field]: value }))
            }
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenEdit(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleEdit}
              disabled={!form.title.trim() || !form.src || isLoadingUpdate}
            >
              {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseView>
  );
}
