import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  CreateServicePlanDto,
  FilterServicePlanDto,
  ServicePlanDto,
  UpdateServicePlanDto,
} from "@/dto/service-plan.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationServicePlan = (
  params: PaginationDto<FilterServicePlanDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<ServicePlanDto>
  >({
    queryKey: [API_ENDPOINTS.SERVICE_PLAN.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.SERVICE_PLAN.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useServicePlanDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<ServicePlanDto>
  >({
    queryKey: [API_ENDPOINTS.SERVICE_PLAN.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.SERVICE_PLAN.FIND_BY_ID,
        { id },
      );
      return res as SuccessResponse<ServicePlanDto>;
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

export const useCreateServicePlan = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onCreateServicePlan, isPending: isLoading } =
    useMutation({
      mutationFn: (data: CreateServicePlanDto) =>
        rootApiService.post(API_ENDPOINTS.SERVICE_PLAN.CREATE, data) as Promise<
          SuccessResponse<ServicePlanDto>
        >,

      onSuccess: (res: SuccessResponse<ServicePlanDto>) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SERVICE_PLAN.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Tạo mới gói dịch vụ thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi tạo gói dịch vụ",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return { onCreateServicePlan, isLoading };
};

export const useUpdateServicePlan = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUpdateServicePlan, isPending: isLoading } =
    useMutation({
      mutationFn: (data: UpdateServicePlanDto) =>
        rootApiService.post(API_ENDPOINTS.SERVICE_PLAN.UPDATE, data) as Promise<
          SuccessResponse<ServicePlanDto>
        >,

      onSuccess: (res: SuccessResponse<ServicePlanDto>) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SERVICE_PLAN.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật gói dịch vụ thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi cập nhật gói dịch vụ",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return { onUpdateServicePlan, isLoading };
};

export const useDeleteServicePlan = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteServicePlan, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.SERVICE_PLAN.DELETE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.SERVICE_PLAN.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa gói dịch vụ thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi xóa gói dịch vụ",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return { onDeleteServicePlan, isLoading };
};

export const useSelectBoxServicePlan = () => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<{ id: string; name: string; priceVnd: number }[]>
  >({
    queryKey: [API_ENDPOINTS.SERVICE_PLAN.SELECT_BOX],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.SERVICE_PLAN.SELECT_BOX,
      );
      return res as SuccessResponse<
        { id: string; name: string; priceVnd: number }[]
      >;
    },
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};
