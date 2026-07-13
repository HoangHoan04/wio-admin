import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterPhotoWallDto, PhotoWallDto } from "@/dto/moderation.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationPhotoWall = (
  params: PaginationDto<FilterPhotoWallDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<PhotoWallDto>
  >({
    queryKey: [API_ENDPOINTS.PHOTO_WALL.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.PHOTO_WALL.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useApprovePhotoWall = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onApprovePhotoWall, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.PHOTO_WALL.APPROVE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.PHOTO_WALL.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Phê duyệt ảnh thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: any) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    },
  );

  return { onApprovePhotoWall, isLoading };
};

export const useRejectPhotoWall = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRejectPhotoWall, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PHOTO_WALL.REJECT, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PHOTO_WALL.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Từ chối ảnh thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onRejectPhotoWall, isLoading };
};

export const useDeletePhotoWall = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeletePhotoWall, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PHOTO_WALL.DELETE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PHOTO_WALL.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa ảnh thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onDeletePhotoWall, isLoading };
};
