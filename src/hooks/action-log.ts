import type { PageResponse, PaginationDto } from "@/dto";
import type { ActionLogDto, ActionLogFilterDto } from "@/dto/action-log.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export const usePaginationActionLog = (
  params: PaginationDto<ActionLogFilterDto>,
) => {
  const { data, isLoading, refetch, error } = useQuery<
    PageResponse<ActionLogDto>
  >({
    queryKey: [API_ENDPOINTS.ACTION_LOG, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.ACTION_LOG, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};
