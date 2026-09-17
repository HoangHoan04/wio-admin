import type {
  ActionLogDto,
  ActionLogFilterDto,
  PageResponse,
  PaginationDto,
} from "@/dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

/* ============================================================
 * QUERY KEY
 * ============================================================ */
export const actionLogKeys = {
  all: ["action-log"] as const,
  pagination: (params: PaginationDto<ActionLogFilterDto>) =>
    [...actionLogKeys.all, "pagination", params] as const,
};

/* ============================================================
 * HOOK — Pagination
 * ============================================================ */
export const usePaginationActionLog = (
  params: PaginationDto<ActionLogFilterDto>,
) => {
  const query = useQuery<PageResponse<ActionLogDto>>({
    queryKey: actionLogKeys.pagination(params),
    queryFn: () =>
      rootApiService.post<PageResponse<ActionLogDto>>(
        API_ENDPOINTS.ACTION_LOG.PAGINATION,
        params,
      ),
    staleTime: 30_000, // 30s — log ít thay đổi
  });

  return {
    data: query.data?.data ?? [],
    total: query.data?.total ?? 0,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,
  };
};
