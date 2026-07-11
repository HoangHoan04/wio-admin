import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterMusicBackgroundDto, IMusicBackground } from "@/dto/music-background.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationMusicBackground = (params: PaginationDto<FilterMusicBackgroundDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<IMusicBackground>>({
    queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useDeleteMusicBackground = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteMusicBackground, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.DELETE, { id }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION] });
      showToast({ type: "success", message: res.message || "Xóa nhạc nền thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onDeleteMusicBackground, isLoading };
};
