import { formatDateTime } from "@/common/helpers";
import type { ActionConfirmRef } from "@/components/layout/ActionConfirm";
import { ActionConfirm } from "@/components/layout/ActionConfirm";
import BaseView from "@/components/layout/BaseView";
import type { FilterField } from "@/components/layout/FilterCustom";
import FilterCustom from "@/components/layout/FilterCustom";
import type { RowAction, TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusTag } from "@/components/ui/status-tag";
import { Textarea } from "@/components/ui/textarea";
import type {
  CreateReviewDto,
  FilterReviewDto,
  PaginationDto,
  ReviewDto,
} from "@/dto";
import {
  useApproveReview,
  useCreateReview,
  useDeleteReview,
  usePaginationReview,
  usePinReview,
  useRejectReview,
  useUnpinReview,
} from "@/hooks/review";
import {
  CheckCircle,
  Pin,
  PinOff,
  Plus,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useRef, useState } from "react";

const initFilter: FilterReviewDto = {};

export default function ReviewManagerPage() {
  const [filter, setFilter] = useState<FilterReviewDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FilterReviewDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedReview, setSelectedReview] = useState<ReviewDto | null>(null);
  const [actionType, setActionType] = useState<
    "approve" | "reject" | "pin" | "unpin" | "delete" | null
  >(null);

  // Dialog Add Review State
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [formData, setFormData] = useState<CreateReviewDto>({
    authorName: "",
    content: "",
    rating: 5,
    eventLabel: "",
  });

  const confirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationReview(pagination);
  const { onApproveReview } = useApproveReview();
  const { onRejectReview } = useRejectReview();
  const { onPinReview } = usePinReview();
  const { onUnpinReview } = useUnpinReview();
  const { onDeleteReview } = useDeleteReview();
  const { onCreateReview, isLoading: isCreating } = useCreateReview();

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const askActionConfirm = (
    record: ReviewDto,
    type: "approve" | "reject" | "pin" | "unpin" | "delete",
  ) => {
    setSelectedReview(record);
    setActionType(type);
    confirmRef.current?.show();
  };

  const handleAction = async () => {
    if (!selectedReview) return;
    if (actionType === "approve") {
      await onApproveReview(selectedReview.id);
    } else if (actionType === "reject") {
      await onRejectReview(selectedReview.id);
    } else if (actionType === "pin") {
      await onPinReview(selectedReview.id);
    } else if (actionType === "unpin") {
      await onUnpinReview(selectedReview.id);
    } else if (actionType === "delete") {
      await onDeleteReview(selectedReview.id);
    }
    confirmRef.current?.hide();
    refetch();
  };

  const handleCreate = async () => {
    if (!formData.authorName.trim() || !formData.content.trim()) return;
    await onCreateReview(formData);
    setIsAddOpen(false);
    setFormData({ authorName: "", content: "", rating: 5, eventLabel: "" });
    refetch();
  };

  const filterFields: FilterField[] = [
    {
      key: "authorName",
      label: "Người đánh giá",
      type: "input",
      placeholder: "Nhập tên người đánh giá...",
      col: 4,
    },
    {
      key: "status",
      label: "Trạng thái duyệt",
      type: "select",
      placeholder: "Tất cả trạng thái",
      options: [
        { label: "Chờ duyệt", value: "PENDING" },
        { label: "Đã duyệt", value: "APPROVED" },
        { label: "Từ chối", value: "REJECTED" },
      ],
      col: 4,
    },
    {
      key: "rating",
      label: "Số sao",
      type: "select",
      placeholder: "Tất cả số sao",
      options: [
        { label: "5 sao", value: "5" },
        { label: "4 sao", value: "4" },
        { label: "3 sao", value: "3" },
        { label: "2 sao", value: "2" },
        { label: "1 sao", value: "1" },
      ],
      col: 4,
    },
  ];

  const columns: TableColumn<ReviewDto>[] = [
    {
      field: "authorName",
      header: "Người đánh giá",
      width: 220,
      body: (row) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-8">
            <AvatarImage src={row.avatarUrl || ""} />
            <AvatarFallback>{row.authorName?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm leading-tight">
              {row.authorName}
            </span>
            {row.eventLabel && (
              <span className="text-xs text-muted-foreground">
                {row.eventLabel}
              </span>
            )}
          </div>
        </div>
      ),
    },
    {
      field: "rating",
      header: "Đánh giá",
      width: 140,
      align: "center",
      body: (row) => (
        <div className="flex items-center justify-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < row.rating
                  ? "text-amber-500 fill-amber-500"
                  : "text-muted-foreground/30"
              }`}
            />
          ))}
          <span className="ml-1 text-xs font-semibold">{row.rating}</span>
        </div>
      ),
    },
    {
      field: "content",
      header: "Nội dung",
      width: 300,
      body: (row) => (
        <p className="text-sm line-clamp-2 max-w-[320px]" title={row.content}>
          {row.content}
        </p>
      ),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (row) => {
        const map: Record<
          string,
          { label: string; severity: "warning" | "success" | "danger" }
        > = {
          PENDING: { label: "Chờ duyệt", severity: "warning" },
          APPROVED: { label: "Đã duyệt", severity: "success" },
          REJECTED: { label: "Từ chối", severity: "danger" },
        };
        const st = map[row.status] || {
          label: row.status,
          severity: "warning",
        };
        return <StatusTag value={st.label} severity={st.severity} />;
      },
    },
    {
      field: "isPinned",
      header: "Ghim trang chủ",
      width: 130,
      align: "center",
      body: (row) =>
        row.isPinned ? (
          <Badge className="bg-amber-500/15 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 border-amber-500/30 gap-1 text-xs font-medium">
            <Pin className="size-3" /> Đã ghim
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground">Không</span>
        ),
    },
    {
      field: "createdAt",
      header: "Thời gian",
      width: 150,
      align: "center",
      body: (row) => formatDateTime(row.createdAt),
    },
  ];

  const rowActions: RowAction<ReviewDto>[] = [
    {
      key: "approve",
      icon: <CheckCircle className="size-3.5 text-emerald-600" />,
      tooltip: "Duyệt đánh giá",
      visible: (row) => row.status !== "APPROVED",
      onClick: (row) => askActionConfirm(row, "approve"),
    },
    {
      key: "reject",
      icon: <XCircle className="size-3.5 text-rose-600" />,
      tooltip: "Từ chối",
      visible: (row) => row.status !== "REJECTED",
      onClick: (row) => askActionConfirm(row, "reject"),
    },
    {
      key: "pin",
      icon: <Pin className="size-3.5 text-amber-600" />,
      tooltip: "Ghim lên trang chủ",
      visible: (row) => !row.isPinned,
      onClick: (row) => askActionConfirm(row, "pin"),
    },
    {
      key: "unpin",
      icon: <PinOff className="size-3.5 text-slate-500" />,
      tooltip: "Bỏ ghim",
      visible: (row) => !!row.isPinned,
      onClick: (row) => askActionConfirm(row, "unpin"),
    },
    {
      key: "delete",
      icon: <Trash2 className="size-3.5 text-red-500" />,
      tooltip: "Xoá",
      onClick: (row) => askActionConfirm(row, "delete"),
    },
  ];

  return (
    <BaseView>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Đánh Giá Khách Hàng
            </h1>
            <p className="text-sm text-muted-foreground">
              Kiểm duyệt, ghim lên trang chủ và quản lý feedback người dùng.
            </p>
          </div>
          <Button onClick={() => setIsAddOpen(true)} className="gap-2 shrink-0">
            <Plus className="size-4" /> Thêm đánh giá
          </Button>
        </div>

        <FilterCustom
          fields={filterFields}
          filters={filter as Record<string, any>}
          onFiltersChange={(vals) => setFilter(vals as FilterReviewDto)}
          onSearch={() => handleSearch(false)}
          onClear={() => handleSearch(true)}
        />

        <TableCustom<ReviewDto>
          data={data}
          columns={columns}
          loading={isLoading}
          rowActions={rowActions}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total,
          }}
          onPageChange={handlePageChange}
          emptyText="Chưa có đánh giá nào"
          toolbar={{
            show: true,
            showRefreshButton: true,
            onRefresh: refetch,
          }}
        />

        {/* Action Confirmation Modal */}
        <ActionConfirm
          ref={confirmRef}
          title={
            actionType === "approve"
              ? "Duyệt đánh giá"
              : actionType === "reject"
                ? "Từ chối đánh giá"
                : actionType === "pin"
                  ? "Ghim đánh giá"
                  : actionType === "unpin"
                    ? "Bỏ ghim đánh giá"
                    : "Xác nhận xoá"
          }
          message={`Bạn có chắc muốn ${
            actionType === "approve"
              ? "duyệt"
              : actionType === "reject"
                ? "từ chối"
                : actionType === "pin"
                  ? "ghim lên trang chủ"
                  : actionType === "unpin"
                    ? "bỏ ghim"
                    : "xoá"
          } đánh giá từ "${selectedReview?.authorName}"?`}
          variant={actionType === "delete" ? "destructive" : "default"}
          onConfirm={handleAction}
        />

        {/* Dialog Add Review */}
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogContent className="sm:max-w-[480px]">
            <DialogHeader>
              <DialogTitle>Thêm đánh giá mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-1.5">
                <Label htmlFor="authorName">Tên người đánh giá *</Label>
                <Input
                  id="authorName"
                  placeholder="VD: Nguyễn Văn A & Lê Thị B"
                  value={formData.authorName}
                  onChange={(e) =>
                    setFormData({ ...formData, authorName: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="eventLabel">Nhãn sự kiện</Label>
                <Input
                  id="eventLabel"
                  placeholder="VD: Thiệp cưới · 12/2025"
                  value={formData.eventLabel}
                  onChange={(e) =>
                    setFormData({ ...formData, eventLabel: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1.5">
                <Label>Xếp hạng số sao</Label>
                <Select
                  value={String(formData.rating)}
                  onValueChange={(val) =>
                    setFormData({ ...formData, rating: Number(val) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">⭐⭐⭐⭐⭐ (5 sao)</SelectItem>
                    <SelectItem value="4">⭐⭐⭐⭐ (4 sao)</SelectItem>
                    <SelectItem value="3">⭐⭐⭐ (3 sao)</SelectItem>
                    <SelectItem value="2">⭐⭐ (2 sao)</SelectItem>
                    <SelectItem value="1">⭐ (1 sao)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="content">Nội dung đánh giá *</Label>
                <Textarea
                  id="content"
                  rows={4}
                  placeholder="Nhập nội dung chia sẻ, đánh giá..."
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddOpen(false)}
                disabled={isCreating}
              >
                Hủy
              </Button>
              <Button onClick={handleCreate} disabled={isCreating}>
                {isCreating ? "Đang lưu..." : "Lưu đánh giá"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </BaseView>
  );
}
