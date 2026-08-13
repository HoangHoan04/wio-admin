import type { PageResponse, PaginationDto, SuccessResponse } from "@/dto";
import type { FilterGuestDto, GuestDto, GuestStatsDto } from "@/dto/guest.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export const usePaginationGuest = (params: PaginationDto<FilterGuestDto>) => {
  const { data, isLoading, refetch, error } = useQuery<PageResponse<GuestDto>>({
    queryKey: [API_ENDPOINTS.GUEST.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.GUEST.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};

export const useGuestDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<GuestDto>
  >({
    queryKey: [API_ENDPOINTS.GUEST.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.GUEST.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<GuestDto>;
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

export const useGuestStats = (invitationId: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<
    SuccessResponse<GuestStatsDto>
  >({
    queryKey: [API_ENDPOINTS.GUEST.STATS, invitationId],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.GUEST.STATS, {
        id: invitationId,
      });
      return res as SuccessResponse<GuestStatsDto>;
    },
    enabled: !!invitationId,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};
