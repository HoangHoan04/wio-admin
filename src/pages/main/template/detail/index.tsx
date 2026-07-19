import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import { getEnumName } from "@/common/helpers";
import ActionLog from "@/components/layout/ActionLog";
import BaseView from "@/components/layout/BaseView";
import type { TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { StatusTag } from "@/components/ui/status-tag";
import type { FilterWeddingDto, PaginationDto, WeddingDto } from "@/dto";
import { useTemplateDetail } from "@/hooks/template";
import { usePaginationWedding } from "@/hooks/wedding";
import { cn } from "@/lib/utils";
import { useRouter } from "@/routes/hooks";
import {
  ArrowLeft,
  Crown,
  Eye,
  Heart,
  History,
  ImageIcon,
  Info,
  Layout,
  Tag,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function DetailTemplatePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const router = useRouter();
  const { data, isLoading } = useTemplateDetail(id);

  const [weddingPagination, setWeddingPagination] = useState<
    PaginationDto<FilterWeddingDto>
  >({
    skip: 0,
    take: 10,
    where: { templateId: id },
  });

  const {
    data: weddings,
    isLoading: isLoadingWeddings,
    total: weddingsTotal,
  } = usePaginationWedding(weddingPagination);

  const handleWeddingPageChange = (page: number, pageSize: number) => {
    setWeddingPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const weddingColumns: TableColumn<WeddingDto>[] = useMemo(
    () => [
      {
        field: "slug",
        header: "Slug",
        width: 150,
        sortable: true,
      },
      {
        field: "groomName",
        header: "Chú rể",
        width: 180,
        sortable: true,
      },
      {
        field: "brideName",
        header: "Cô dâu",
        width: 180,
        sortable: true,
      },
      {
        field: "ceremonyAt",
        header: "Ngày cưới",
        width: 160,
        type: "datetime",
        align: "center",
      },
      {
        field: "publishedAt",
        header: "Ngày xuất bản",
        width: 160,
        type: "datetime",
        align: "center",
      },
    ],
    [],
  );

  const weddingRowActions = useMemo(
    () => [
      {
        key: "view",
        icon: <Eye className="size-3.5" />,
        tooltip: "Xem chi tiết",
        severity: "info" as const,
        onClick: (record: WeddingDto) =>
          router.push(
            ROUTES.MAIN.WEDDING_MANAGER.children.WEDDING_LIST.children.DETAIL_WEDDING.path.replace(
              ":id",
              record.id,
            ),
          ),
      },
    ],
    [router],
  );

  if (isLoading) {
    return (
      <BaseView>
        <div className="flex h-full items-center justify-center">
          <Spinner className="size-10 text-primary" />
        </div>
      </BaseView>
    );
  }

  if (!data) {
    return (
      <BaseView>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <p className="font-medium text-muted-foreground">
            Không tìm thấy thông tin template
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="gap-1.5"
          >
            <ArrowLeft className="size-3.5" />
            Quay lại danh sách
          </Button>
        </div>
      </BaseView>
    );
  }

  const features = data.features || {};
  const hasFeatures = Object.keys(features).length > 0;

  const tabs = [
    {
      key: "info",
      title: "Thông tin chi tiết",
      icon: <Info className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layout className="size-4" />
                Thông tin cơ bản
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem label="Tên template" value={data.name || "N/A"} />
                <InfoItem label="Slug" value={data.slug || "N/A"} />
                <InfoItem
                  label="Tên mẫu theme"
                  value={getEnumName(enumData.THEME_CODE, data.themeCode)}
                />
                <InfoItem
                  label="Mô tả"
                  value={data.description || "N/A"}
                  className="md:col-span-2"
                />
                <InfoItem label="Gói tối thiểu" value={data.minPlan || "N/A"} />
                <InfoItem
                  label="Số ngày dùng thử"
                  value={
                    data.trialDays != null ? `${data.trialDays} ngày` : "N/A"
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="size-4" />
                Trạng thái
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-3">
                <InfoItem
                  label="Hiển thị"
                  value={
                    <StatusTag
                      severity={data.isShow ? "success" : "secondary"}
                      value={data.isShow ? "Hiển thị" : "Ẩn"}
                    />
                  }
                />
                <InfoItem
                  label="Premium"
                  value={
                    <span className="inline-flex items-center gap-1.5">
                      <StatusTag
                        severity={data.isPremium ? "success" : "secondary"}
                        value={data.isPremium ? "Có" : "Không"}
                      />
                      {data.isPremium && (
                        <Crown className="size-3.5 text-amber-500" />
                      )}
                    </span>
                  }
                />
                <InfoItem
                  label="Hoạt động"
                  value={
                    <StatusTag
                      severity={data.isDeleted ? "danger" : "success"}
                      value={data.isDeleted ? "Đã xóa mềm" : "Đang hoạt động"}
                    />
                  }
                />
              </div>
            </CardContent>
          </Card>

          {data.thumbnailUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="size-4" />
                  Ảnh thumbnail
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row items-start gap-4">
                  <div className="relative overflow-hidden rounded-lg border border-border bg-muted/50">
                    <img
                      src={data.thumbnailUrl}
                      alt={data.name}
                      className="max-h-64 max-w-full object-contain"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {data.tags && data.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="size-4" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {data.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-sm bg-muted rounded-md border border-border font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Features */}
          {hasFeatures && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="size-4" />
                  Cấu hình tính năng (features)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="rounded-lg bg-muted p-4 text-sm overflow-auto max-h-96 border border-border">
                  <code>{JSON.stringify(features, null, 2)}</code>
                </pre>
              </CardContent>
            </Card>
          )}

          <div className="flex items-center justify-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-1.5"
            >
              <ArrowLeft className="size-3.5" />
              Quay lại
            </Button>
          </div>
        </div>
      ),
    },
    {
      key: "weddings",
      title: `Đám cưới sử dụng (${weddingsTotal || 0})`,
      icon: <Heart className="size-3.5" />,
      content: (
        <div className="flex flex-col gap-6 p-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="size-4" />
                Danh sách đám cưới sử dụng template
              </CardTitle>
            </CardHeader>
            <CardContent>
              <TableCustom<WeddingDto>
                data={weddings || []}
                columns={weddingColumns}
                loading={isLoadingWeddings}
                rowActions={weddingRowActions}
                stripedRows={true}
                showGridlines={true}
                scrollable={true}
                emptyText="Chưa có đám cưới nào sử dụng template này"
                pagination={{
                  current:
                    Math.floor(
                      weddingPagination.skip / weddingPagination.take,
                    ) + 1,
                  pageSize: weddingPagination.take,
                  total: weddingsTotal || 0,
                  showTotal: true,
                }}
                onPageChange={handleWeddingPageChange}
              />
            </CardContent>
          </Card>
        </div>
      ),
    },
    {
      key: "action-log",
      title: "Lịch sử thao tác",
      icon: <History className="size-3.5" />,
      content: (
        <div className="flex h-full flex-col items-center justify-start gap-2 py-4">
          <ActionLog
            entityName="TemplateEntity"
            entityId={data.id}
            title={`Lịch sử thao tác của mẫu thiệp: ${data.name} (${getEnumName(enumData.THEME_CODE, data.themeCode)})`}
          />
        </div>
      ),
    },
  ];

  return <BaseView tabs={tabs} />;
}

function InfoItem({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <p className="text-3xl font-semibold text-foreground">{value}</p>
    </div>
  );
}
