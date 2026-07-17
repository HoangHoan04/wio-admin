import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterWeddingDto, WeddingDto } from "@/dto/wedding.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationWedding = (
  params: PaginationDto<FilterWeddingDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<WeddingDto>
  >({
    queryKey: [API_ENDPOINTS.WEDDING.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.WEDDING.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useWeddingDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<WeddingDto>
  >({
    queryKey: [API_ENDPOINTS.WEDDING.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.WEDDING.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<WeddingDto>;
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

export const usePublishWedding = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onPublishWedding, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WEDDING.PUBLISH, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WEDDING.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xuất bản thành công",
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

  return { onPublishWedding, isLoading };
};

export const useUnpublishWedding = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUnpublishWedding, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.WEDDING.UNPUBLISH, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.WEDDING.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hủy xuất bản thành công",
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
    },
  );

  return { onUnpublishWedding, isLoading };
};

export const useDeleteWedding = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteWedding, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.WEDDING.DELETE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WEDDING.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa thành công",
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

  return { onDeleteWedding, isLoading };
};

export const useForceResetSlug = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onForceResetSlug, isPending: isLoading } = useMutation({
    mutationFn: (data: {
      weddingId: string;
      newSlug: string;
      reason: string;
    }) =>
      rootApiService.post(
        API_ENDPOINTS.WEDDING.FORCE_RESET_SLUG,
        data,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.WEDDING.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Đặt lại slug thành công",
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

  return { onForceResetSlug, isLoading };
};
