import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { CustomerDto, FilterCustomerDto } from "@/dto/customer.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationCustomer = (
  params: PaginationDto<FilterCustomerDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<CustomerDto>
  >({
    queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.CUSTOMER.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useCustomerDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<CustomerDto>
  >({
    queryKey: [API_ENDPOINTS.CUSTOMER.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.CUSTOMER.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<CustomerDto>;
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

export const useActivateCustomer = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateCustomer, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.CUSTOMER.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt tài khoản thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi kích hoạt tài khoản",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    },
  );

  return { onActivateCustomer, isLoading };
};

export const useDeactivateCustomer = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateCustomer, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.CUSTOMER.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CUSTOMER.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Đình chỉ tài khoản thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi đình chỉ tài khoản",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return { onDeactivateCustomer, isLoading };
};
