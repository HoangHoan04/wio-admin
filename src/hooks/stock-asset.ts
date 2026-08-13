import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  CreateStockAssetDto,
  FilterStockAssetDto,
  StockAssetDto,
  UpdateStockAssetDto,
} from "@/dto/stock-asset.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationStockAsset = (
  params: PaginationDto<FilterStockAssetDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<StockAssetDto>
  >({
    queryKey: [API_ENDPOINTS.STOCK_ASSET.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.STOCK_ASSET.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateStockAsset = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onCreateStockAsset, isPending: isLoading } = useMutation({
    mutationFn: (data: CreateStockAssetDto) =>
      rootApiService.post(
        API_ENDPOINTS.STOCK_ASSET.CREATE,
        data,
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STOCK_ASSET.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Thêm asset thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onCreateStockAsset, isLoading };
};

export const useUpdateStockAsset = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUpdateStockAsset, isPending: isLoading } = useMutation({
    mutationFn: (data: UpdateStockAssetDto) =>
      rootApiService.post(
        API_ENDPOINTS.STOCK_ASSET.UPDATE,
        data,
      ) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STOCK_ASSET.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật asset thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateStockAsset, isLoading };
};

export const useDeleteStockAsset = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteStockAsset, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.STOCK_ASSET.DELETE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.STOCK_ASSET.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa asset thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onDeleteStockAsset, isLoading };
};
