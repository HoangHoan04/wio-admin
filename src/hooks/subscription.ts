import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  AdminChangeSubscriptionPlanDto,
  FilterSubscriptionDto,
  SubscriptionDto,
} from "@/dto/subscription.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationSubscription = (
  params: PaginationDto<FilterSubscriptionDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<SubscriptionDto>
  >({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.SUBSCRIPTION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useSubscriptionDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<SubscriptionDto>
  >({
    queryKey: [API_ENDPOINTS.SUBSCRIPTION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.SUBSCRIPTION.FIND_BY_ID,
        { id },
      );
      return res as SuccessResponse<SubscriptionDto>;
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

export const useDeleteSubscription = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteSubscription, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.SUBSCRIPTION.DELETE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SUBSCRIPTION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa subscription thành công",
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

  return { onDeleteSubscription, isLoading };
};

export const useChangePlanSubscription = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onChangePlanSubscription, isPending: isLoading } =
    useMutation({
      mutationFn: (data: AdminChangeSubscriptionPlanDto) =>
        rootApiService.post(
          API_ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN,
          data,
        ) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SUBSCRIPTION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Thay đổi gói dịch vụ thành công",
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

  return { onChangePlanSubscription, isLoading };
};
