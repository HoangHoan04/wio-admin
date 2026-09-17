import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import type { TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  FilterTemplateCategoryDto,
  PaginationDto,
  TemplateCategoryDto,
} from "@/dto";
import {
  usePaginationTemplateCategory,
  useSyncEnumTemplateCategory,
} from "@/hooks/template-category";
import { HeartHandshake, RefreshCw } from "lucide-react";
import { useState } from "react";

export default function TemplateCategoryManagerPage() {
  const [pagination, setPagination] = useState<
    PaginationDto<FilterTemplateCategoryDto>
  >({
    skip: 0,
    take: 50,
    where: {},
  });

  const { data, isLoading, refetch, total } =
    usePaginationTemplateCategory(pagination);
  const { onSyncEnum, isLoading: isSyncing } = useSyncEnumTemplateCategory();

  const handleSync = async () => {
    await onSyncEnum();
    refetch();
  };

  const columns: TableColumn<TemplateCategoryDto>[] = [
    {
      field: "category",
      header: "Mã phong cách (Theme Code)",
      width: 200,
      body: (row) => {
        const themeCode = row.category || row.code || "";
        const themeEnum =
          enumData.WEDDING_THEME[
            themeCode as keyof typeof enumData.WEDDING_THEME
          ];
        return (
          <div className="flex items-center gap-2">
            <span
              className="size-3 rounded-full shrink-0"
              style={{ backgroundColor: themeEnum?.color || "#64748B" }}
            />
            <span className="font-mono text-xs font-semibold">{themeCode}</span>
          </div>
        );
      },
    },
    {
      field: "nameVi",
      header: "Tên phong cách cưới",
      width: 220,
      body: (row) => {
        const themeCode = row.category || row.code || "";
        const themeEnum =
          enumData.WEDDING_THEME[
            themeCode as keyof typeof enumData.WEDDING_THEME
          ];
        return (
          <span className="font-medium">
            {row.nameVi || row.name || themeEnum?.name || themeCode}
          </span>
        );
      },
    },
    {
      field: "slug",
      header: "Slug URL",
      width: 180,
      body: (row) => (
        <span className="text-xs text-muted-foreground font-mono">
          {row.slug || (row.category ? row.category.toLowerCase() : "—")}
        </span>
      ),
    },
    {
      field: "sortOrder",
      header: "Thứ tự",
      width: 100,
      align: "center",
      body: (row) => row.sortOrder ?? 0,
    },
    {
      field: "isActive",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (row) =>
        row.isActive === false ? (
          <Badge variant="secondary" className="text-xs">
            Ẩn
          </Badge>
        ) : (
          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
            Hoạt động
          </Badge>
        ),
    },
  ];

  return (
    <BaseView>
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="size-6 text-primary" />
              <h1 className="text-2xl font-bold tracking-tight">
                Phong Cách Cưới (Template Categories)
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Quản lý phân loại danh mục giao diện thiệp cưới theo phong cách
              (Cổ điển, Hiện đại, Sang trọng, Rustic...).
            </p>
          </div>
          <Button
            onClick={handleSync}
            disabled={isSyncing}
            className="gap-2 shrink-0"
          >
            <RefreshCw
              className={`size-4 ${isSyncing ? "animate-spin" : ""}`}
            />
            {isSyncing ? "Đang đồng bộ..." : "Đồng bộ từ Enum"}
          </Button>
        </div>

        <TableCustom<TemplateCategoryDto>
          data={data}
          columns={columns}
          loading={isLoading}
          pagination={{
            current: Math.floor(pagination.skip / pagination.take) + 1,
            pageSize: pagination.take,
            total,
          }}
          onPageChange={(page, pageSize) =>
            setPagination((prev) => ({
              ...prev,
              skip: (page - 1) * pageSize,
              take: pageSize,
            }))
          }
          emptyText="Chưa có phong cách cưới nào. Hãy bấm 'Đồng bộ từ Enum' để khởi tạo!"
          toolbar={{
            show: true,
            showRefreshButton: true,
            onRefresh: refetch,
          }}
        />
      </div>
    </BaseView>
  );
}
