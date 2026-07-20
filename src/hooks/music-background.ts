import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  CreateMusicBackgroundDto,
  FilterMusicBackgroundDto,
  MusicBackgroundDto,
  UpdateMusicBackgroundDto,
} from "@/dto/music-background.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationMusicBackground = (
  params: PaginationDto<FilterMusicBackgroundDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<MusicBackgroundDto>
  >({
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

export const useCreateMusicBackground = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onCreateMusicBackground, isPending: isLoading } =
    useMutation({
      mutationFn: (data: CreateMusicBackgroundDto) =>
        rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.CREATE, data) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Thêm nhạc nền thành công",
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

  return { onCreateMusicBackground, isLoading };
};

export const useUpdateMusicBackground = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUpdateMusicBackground, isPending: isLoading } =
    useMutation({
      mutationFn: (data: UpdateMusicBackgroundDto) =>
        rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.UPDATE, data) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật nhạc nền thành công",
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

  return { onUpdateMusicBackground, isLoading };
};

export const useImportYoutubeMusic = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onImportYoutube, isPending: isLoading } =
    useMutation({
      mutationFn: (youtubeUrl: string) =>
        rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.IMPORT_YOUTUBE, { youtubeUrl }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Đã thêm nhạc vào hàng đợi xử lý. Vui lòng chờ trong giây lát.",
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

  return { onImportYoutube, isLoading };
};

export const useDeleteMusicBackground = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteMusicBackground, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.MUSIC_BACKGROUND.DELETE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa nhạc nền thành công",
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

  return { onDeleteMusicBackground, isLoading };
};
