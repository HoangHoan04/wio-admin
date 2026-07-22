import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type {
  ContactDto,
  FilterContactDto,
  UpdateContactStatusDto,
} from "@/dto/contact.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationContact = (
  params: PaginationDto<FilterContactDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<ContactDto>
  >({
    queryKey: [API_ENDPOINTS.CONTACT.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.CONTACT.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useContactDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<ContactDto>
  >({
    queryKey: [API_ENDPOINTS.CONTACT.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.CONTACT.FIND_BY_ID,
        { id },
      );
      return res as SuccessResponse<ContactDto>;
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

export const useUpdateContactStatus = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUpdateContactStatus, isPending: isLoading } =
    useMutation({
      mutationFn: (data: UpdateContactStatusDto) =>
        rootApiService.post(
          API_ENDPOINTS.CONTACT.UPDATE_STATUS,
          data,
        ) as Promise<SuccessResponse<ContactDto>>,

      onSuccess: (res: SuccessResponse<ContactDto>) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CONTACT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật trạng thái liên hệ thành công",
          title: "Thành công",
          timeout: 3000,
        });
      },
      onError: (error: Error) => {
        showToast({
          type: "error",
          message: error?.message || "Có lỗi xảy ra khi cập nhật liên hệ",
          title: "Lỗi",
          timeout: 3000,
        });
      },
    });

  return { onUpdateContactStatus, isLoading };
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteContact, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.CONTACT.DELETE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.CONTACT.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa yêu cầu liên hệ thành công",
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

  return { onDeleteContact, isLoading };
};
