import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterInvitationDto, InvitationDto } from "@/dto/invitation.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationInvitation = (
  params: PaginationDto<FilterInvitationDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<InvitationDto>
  >({
    queryKey: [API_ENDPOINTS.INVITATION.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.INVITATION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useInvitationDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<InvitationDto>
  >({
    queryKey: [API_ENDPOINTS.INVITATION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.INVITATION.FIND_BY_ID,
        {
          id,
        },
      );
      return res as SuccessResponse<InvitationDto>;
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

export const useForceResetSlug = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onForceResetSlug, isPending: isLoading } = useMutation({
    mutationFn: (data: {
      invitationId: string;
      newSlug: string;
      reason: string;
    }) =>
      rootApiService.post(
        API_ENDPOINTS.INVITATION.FORCE_RESET_SLUG,
        data,
      ) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.INVITATION.PAGINATION],
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

export const usePublishInvitation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onPublishInvitation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.INVITATION.PUBLISH, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INVITATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xuất bản thiệp thành công",
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

  return { onPublishInvitation, isLoading };
};

export const useUnpublishInvitation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onUnpublishInvitation, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.INVITATION.UNPUBLISH, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INVITATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Hủy xuất bản thiệp thành công",
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

  return { onUnpublishInvitation, isLoading };
};

export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteInvitation, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.INVITATION.DELETE, {
          id,
        }) as Promise<SuccessResponse>,
      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.INVITATION.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Xóa thiệp thành công",
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

  return { onDeleteInvitation, isLoading };
};
