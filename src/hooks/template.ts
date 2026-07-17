import type {
  CreateTemplateDto,
  FilterTemplateDto,
  PageResponse,
  PaginationDto,
  SuccessResponse,
  UpdateTemplateDto,
} from "@/dto";
import type { SetPremiumTemplateDto, TemplateDto } from "@/dto/template.dto";
import { useRouter } from "@/routes/hooks/use-router";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useToast } from "@/store/toastStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationTemplate = (
  params: PaginationDto<FilterTemplateDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<TemplateDto>
  >({
    queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION, params],
    queryFn: () =>
      rootApiService.post(API_ENDPOINTS.TEMPLATE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useTemplateDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<{ data: TemplateDto }>({
    queryKey: [API_ENDPOINTS.TEMPLATE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.TEMPLATE.FIND_BY_ID, {
        id,
      });
      return res as { data: TemplateDto };
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

export const useCreateTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const router = useRouter();

  const { mutateAsync: onCreateTemplate, isPending: isLoading } = useMutation({
    mutationFn: (data: CreateTemplateDto) =>
      rootApiService.post(API_ENDPOINTS.TEMPLATE.CREATE, data) as Promise<
        SuccessResponse<TemplateDto>
      >,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
      });
      showToast({
        type: "success",
        message: "Tạo template thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
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

  return { onCreateTemplate, isLoading };
};

export const useUpdateTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const router = useRouter();

  const { mutateAsync: onUpdateTemplate, isPending: isLoading } = useMutation({
    mutationFn: (data: UpdateTemplateDto) =>
      rootApiService.post(API_ENDPOINTS.TEMPLATE.UPDATE, data) as Promise<
        SuccessResponse<TemplateDto>
      >,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
      });
      showToast({
        type: "success",
        message: "Cập nhật template thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
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

  return { onUpdateTemplate, isLoading };
};

export const useActivateTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateTemplate, isPending: isLoading } = useMutation(
    {
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TEMPLATE.ACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Kích hoạt template thành công",
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

  return { onActivateTemplate, isLoading };
};

export const useDeactivateTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateTemplate, isPending: isLoading } =
    useMutation({
      mutationFn: (id: string) =>
        rootApiService.post(API_ENDPOINTS.TEMPLATE.DEACTIVATE, {
          id,
        }) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Vô hiệu hóa template thành công",
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

  return { onDeactivateTemplate, isLoading };
};

export const useSetPremiumTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onSetPremiumTemplate, isPending: isLoading } =
    useMutation({
      mutationFn: (data: SetPremiumTemplateDto) =>
        rootApiService.post(
          API_ENDPOINTS.TEMPLATE.SET_PREMIUM,
          data,
        ) as Promise<SuccessResponse>,

      onSuccess: (res: SuccessResponse) => {
        queryClient.invalidateQueries({
          queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
        });
        showToast({
          type: "success",
          message: res.message || "Cập nhật premium thành công",
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

  return { onSetPremiumTemplate, isLoading };
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteTemplate, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.TEMPLATE.DELETE, {
        id,
      }) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.TEMPLATE.PAGINATION],
      });
      showToast({
        type: "success",
        message: res.message || "Xóa template thành công",
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

  return { onDeleteTemplate, isLoading };
};
