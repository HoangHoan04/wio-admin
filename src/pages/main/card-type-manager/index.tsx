import { enumData } from "@/common/enums";
import BaseView from "@/components/layout/BaseView";
import type { TableColumn } from "@/components/layout/TableCustom";
import TableCustom from "@/components/layout/TableCustom";
import { Button } from "@/components/ui/button";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import type { PageResponse } from "@/dto";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

type CardTypeRow = {
  id?: string;
  code: string;
  nameVi?: string;
  name?: string;
  slug?: string;
  isActive?: boolean;
  sortOrder?: number;
  accentColor?: string;
};

export default function CardTypeManagerPage() {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [API_ENDPOINTS.CARD_TYPE.PAGINATION],
    queryFn: () =>
      rootApiService.post<PageResponse<CardTypeRow>>(
        API_ENDPOINTS.CARD_TYPE.PAGINATION,
        {
          skip: 0,
          take: 50,
          where: {},
        },
      ),
  });

  const sync = useMutation({
    mutationFn: () => rootApiService.post(API_ENDPOINTS.CARD_TYPE.SYNC_ENUM, {}),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.CARD_TYPE.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res?.message || "Đã đồng bộ loại thiệp từ enum",
        timeout: 3000,
      });
    },
  });

  const rows: CardTypeRow[] = data?.data || [];

  const columns: TableColumn<CardTypeRow>[] = [
    { field: "code", header: "Mã", width: 140 },
    {
      field: "nameVi",
      header: "Tên",
      width: 200,
      body: (row) => row.nameVi || row.name || enumData.CARD_TYPE[row.code as keyof typeof enumData.CARD_TYPE]?.name,
    },
    { field: "slug", header: "Slug", width: 140 },
    {
      field: "isActive",
      header: "Hiện",
      width: 80,
      body: (row) => (row.isActive === false ? "Ẩn" : "Hiện"),
    },
    { field: "sortOrder", header: "Thứ tự", width: 90 },
  ];

  return (
    <BaseView>
      <div className="flex justify-end mb-4">
        <Button onClick={() => sync.mutate()} disabled={sync.isPending}>
          Đồng bộ enum
        </Button>
      </div>
      <TableCustom<CardTypeRow>
        data={rows}
        columns={columns}
        loading={isLoading}
        emptyText="Chưa có loại thiệp"
        toolbar={{ show: true, showRefreshButton: true, onRefresh: refetch }}
      />
    </BaseView>
  );
}
