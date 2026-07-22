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
  FilterMusicBackgroundDto,
  MusicBackgroundDto,
  PaginationDto,
} from "@/dto";
import {
  useCreateMusicBackground,
  useDeleteMusicBackground,
  useImportYoutubeMusic,
  usePaginationMusicBackground,
  useUpdateMusicBackground,
} from "@/hooks/music-background";
import { Edit, Music, Trash2, Video } from "lucide-react";
import { useEffect, useRef, useState } from "react";

function getAudioDuration(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const audio = new Audio(url);
    const cleanup = () => URL.revokeObjectURL(url);
    audio.addEventListener("loadedmetadata", () => {
      const totalSeconds = Math.floor(audio.duration);
      const m = Math.floor(totalSeconds / 60);
      const s = totalSeconds % 60;
      resolve(`${m}:${s.toString().padStart(2, "0")}`);
      cleanup();
    });
    audio.addEventListener("error", () => {
      cleanup();
      reject(new Error("Cannot read audio file metadata"));
    });
  });
}

const initFilter: FilterMusicBackgroundDto = {};

const emptyForm = {
  name: "",
  author: "",
  duration: "",
  audioUrl: "",
  isActive: true,
};

function MusicForm({
  form,
  onChange,
}: {
  form: typeof emptyForm;
  onChange: (field: string, value: any) => void;
}) {
  return (
    <div className="grid grid-cols-1 gap-4 py-4">
      <div className="space-y-2">
        <Label>Tên bài hát</Label>
        <Input
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          placeholder="Nhập tên bài hát"
        />
      </div>
      <div className="space-y-2">
        <Label>Tác giả</Label>
        <Input
          value={form.author}
          onChange={(e) => onChange("author", e.target.value)}
          placeholder="Nhập tên tác giả"
        />
      </div>
      <div className="space-y-2">
        <Label>Thời lượng</Label>
        <Input
          value={form.duration}
          disabled
          placeholder="Tự động lấy từ file âm thanh"
        />
      </div>
      <div className="space-y-2">
        <Label>Tải file âm thanh</Label>
        <FileUploadCustom
          type="audio"
          mode="single"
          initValue={form.audioUrl || null}
          onFileUploaded={(data) => {
            if (!data || Array.isArray(data)) {
              onChange("audioUrl", "");
              onChange("duration", "");
              return;
            }
            onChange("audioUrl", data.fileUrl);
            if (data.file) {
              getAudioDuration(data.file)
                .then((duration) => {
                  onChange("duration", duration);
                })
                .catch(() => {});
            }
          }}
        />
      </div>
    </div>
  );
}

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

  const [openCreate, setOpenCreate] = useState(false);
  const [openYoutube, setOpenYoutube] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [youtubeImportPending, setYoutubeImportPending] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const deleteConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } =
    usePaginationMusicBackground(pagination);

  useEffect(() => {
    const hasProcessing = data?.some(
      (item) => item.status === "PROCESSING" || item.status === "PENDING",
    );
    if (!hasProcessing && !youtubeImportPending) return;

    let elapsed = 0;
    const interval = setInterval(() => {
      refetch();
      elapsed += 3000;
      if (youtubeImportPending && elapsed >= 60000) {
        setYoutubeImportPending(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [data, refetch, youtubeImportPending]);

  const { onCreateMusicBackground, isLoading: isLoadingCreate } =
    useCreateMusicBackground();
  const { onUpdateMusicBackground, isLoading: isLoadingUpdate } =
    useUpdateMusicBackground();
  const { onImportYoutube, isLoading: isLoadingYoutube } =
    useImportYoutubeMusic();
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

  const handleCreate = async () => {
    if (!form.name.trim()) return;
    await onCreateMusicBackground(form);
    setOpenCreate(false);
    setForm(emptyForm);
    await refetch();
  };

  const handleEdit = async () => {
    if (!editingId || !form.name.trim()) return;
    await onUpdateMusicBackground({ id: editingId, ...form });
    setOpenEdit(false);
    setEditingId(null);
    setForm(emptyForm);
    await refetch();
  };

  const handleImportYoutube = async () => {
    if (!youtubeUrl.trim()) return;
    await onImportYoutube(youtubeUrl);
    setOpenYoutube(false);
    setYoutubeUrl("");
    setYoutubeImportPending(true);
    await refetch();
  };

  const openEditDialog = (record: MusicBackgroundDto) => {
    setEditingId(record.id);
    setForm({
      name: record.name || "",
      author: record.author || "",
      duration: record.duration || "",
      audioUrl: record.audioUrl || "",
      isActive: true,
    });
    setOpenEdit(true);
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
      body: (rowData) => {
        const status = Object.values(enumData.MUSIC_PROCESS_STATUS).find(
          (item) => item.code === rowData.status,
        );
        return (
          <StatusTag
            severity={status?.color || "gray"}
            value={status?.name || rowData.status}
          />
        );
      },
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
        setSelectedMusic(record);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  const loading =
    isLoading ||
    isLoadingCreate ||
    isLoadingUpdate ||
    isLoadingYoutube ||
    isLoadingDelete;

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
        loading={loading}
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
          leftContent: (
            <>
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
              <RowActions
                actions={[
                  CommonActions.importYoutube(() => {
                    setForm(emptyForm);
                    setOpenYoutube(true);
                  }),
                ]}
                justify="start"
                gap="small"
              />
            </>
          ),
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

      <Dialog open={openCreate} onOpenChange={setOpenCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Music className="size-4" />
              Thêm nhạc nền mới
            </DialogTitle>
          </DialogHeader>
          <MusicForm
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
              disabled={!form.name.trim() || isLoadingCreate}
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
              Cập nhật nhạc nền
            </DialogTitle>
          </DialogHeader>
          <MusicForm
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
              disabled={!form.name.trim() || isLoadingUpdate}
            >
              {isLoadingUpdate ? "Đang cập nhật..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openYoutube} onOpenChange={setOpenYoutube}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Video className="size-4" />
              Nhập nhạc từ YouTube
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <Label>URL YouTube</Label>
            <Input
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenYoutube(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleImportYoutube}
              disabled={!youtubeUrl.trim() || isLoadingYoutube}
            >
              {isLoadingYoutube ? "Đang tải..." : "Nhập"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </BaseView>
  );
}
