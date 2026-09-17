import type {
  FilterTemplateCategoryDto,
  PageResponse,
  PaginationDto,
  TemplateCategoryDto,
} from "@/dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTemplateCategory = (
  params: PaginationDto<FilterTemplateCategoryDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TemplateCategoryDto>
  >({
    queryKey: [API_ENDPOINTS.TEMPLATE_CATEGORY.PAGINATION, params],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.TEMPLATE_CATEGORY.PAGINATION,
        params,
      );
      return res as PageResponse<TemplateCategoryDto>;
    },
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useSyncEnumTemplateCategory = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: () =>
      rootApiService.post(API_ENDPOINTS.TEMPLATE_CATEGORY.SYNC_ENUM, {}),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TEMPLATE_CATEGORY.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: res?.message || "Đã đồng bộ phong cách cưới từ enum",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể đồng bộ từ enum",
      });
    },
  });

  return {
    onSyncEnum: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
