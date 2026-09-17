import type {
  CreateReviewDto,
  FilterReviewDto,
  PageResponse,
  PaginationDto,
  ReviewDto,
  UpdateReviewDto,
} from "@/dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationReview = (params: PaginationDto<FilterReviewDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<ReviewDto>>({
    queryKey: [API_ENDPOINTS.REVIEW.PAGINATION, params],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.REVIEW.PAGINATION,
        params,
      );
      return res as PageResponse<ReviewDto>;
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

export const useFindReviewById = (id?: string) => {
  const { data, isLoading, refetch } = useQuery<ReviewDto>({
    queryKey: [API_ENDPOINTS.REVIEW.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.REVIEW.FIND_BY_ID, {
        id,
      });
      return (res as any)?.data || res;
    },
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: CreateReviewDto) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.CREATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Tạo đánh giá thành công",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể tạo đánh giá",
      });
    },
  });

  return {
    onCreateReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useUpdateReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: UpdateReviewDto) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.UPDATE, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Cập nhật đánh giá thành công",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể cập nhật đánh giá",
      });
    },
  });

  return {
    onUpdateReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.DELETE, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Xoá đánh giá thành công",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể xoá đánh giá",
      });
    },
  });

  return {
    onDeleteReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useApproveReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.APPROVE, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Duyệt đánh giá thành công",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể duyệt đánh giá",
      });
    },
  });

  return {
    onApproveReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useRejectReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.REJECT, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Từ chối đánh giá thành công",
      });
    },
    onError: (err: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: err?.message || "Không thể từ chối đánh giá",
      });
    },
  });

  return {
    onRejectReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const usePinReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.PIN, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã ghim đánh giá lên trang chủ",
      });
    },
  });

  return {
    onPinReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};

export const useUnpinReview = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const mutation = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.REVIEW.UNPIN, { id }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.REVIEW.PAGINATION],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã bỏ ghim đánh giá",
      });
    },
  });

  return {
    onUnpinReview: mutation.mutateAsync,
    isLoading: mutation.isPending,
  };
};
