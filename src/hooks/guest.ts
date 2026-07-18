import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterGuestDto, GuestDto, GuestStatsDto } from "@/dto/guest.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationGuest = (params: PaginationDto<FilterGuestDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<GuestDto>>({
    queryKey: [API_ENDPOINTS.GUEST.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.GUEST.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useGuestDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<GuestDto>
  >({
    queryKey: [API_ENDPOINTS.GUEST.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.GUEST.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<GuestDto>;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useGuestStats = (weddingId: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<GuestStatsDto>
  >({
    queryKey: [API_ENDPOINTS.GUEST.STATS, weddingId],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.GUEST.STATS, {
        id: weddingId,
      });
      return res as SuccessResponse<GuestStatsDto>;
    },
    enabled: !!weddingId,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useDeleteGuest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteGuest, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.GUEST.DELETE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.GUEST.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa khách mờthành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: Error) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi xóa khách mờ",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onDeleteGuest, isLoading };
};
