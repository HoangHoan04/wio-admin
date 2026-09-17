import type {
  FilterNotificationDto,
  NotificationDto,
  PageResponse,
  PaginationDto,
} from "@/dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export const usePaginationNotification = (
  params: PaginationDto<FilterNotificationDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<NotificationDto>
  >({
    queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION, params],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.PAGINATION,
        params,
      );
      return res as PageResponse<NotificationDto>;
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

export const useFindNotificationById = (id?: string) => {
  const { data, isLoading, refetch } = useQuery<NotificationDto>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(
        API_ENDPOINTS.NOTIFICATION.FIND_BY_ID,
        { id },
      );
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
