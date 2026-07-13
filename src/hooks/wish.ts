import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterWishDto, WishDto } from "@/dto/moderation.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationWish = (params: PaginationDto<FilterWishDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<WishDto>>({
    queryKey: [API_ENDPOINTS.WISH.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.WISH.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useApproveWish = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onApproveWish, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WISH.APPROVE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WISH.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Phê duyệt lời chúc thành công",
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

  return { onApproveWish, isLoading };
};

export const useRejectWish = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRejectWish, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WISH.REJECT, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WISH.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Từ chối lời chúc thành công",
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

  return { onRejectWish, isLoading };
};

export const usePinWish = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onPinWish, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WISH.PIN, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WISH.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Ghim lời chúc thành công",
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

  return { onPinWish, isLoading };
};

export const useUnpinWish = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUnpinWish, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WISH.UNPIN, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WISH.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Bỏ ghim lời chúc thành công",
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

  return { onUnpinWish, isLoading };
};

export const useDeleteWish = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteWish, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WISH.DELETE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WISH.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa lời chúc thành công",
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

  return { onDeleteWish, isLoading };
};
