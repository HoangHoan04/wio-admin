import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export interface OverviewStats {
  invitations?: {
    total: number;
    published: number;
    draft: number;
    archived: number;
    byType: Array<{ cardType: string; name: string; total: number }>;
  };
  guests?: { total: number; attending: number };
  wishes?: { pending: number };
  users?: { newLast7Days: number };
  [key: string]: any;
}

export const useSystemStats = () => {
  const { data, isLoading, isFetching, refetch, error } = useQuery<OverviewStats>({
    queryKey: [API_ENDPOINTS.ANALYTICS.OVERVIEW],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.ANALYTICS.OVERVIEW);
      return (res as any)?.data || res;
    },
  });

  return {
    data,
    isLoading,
    isFetching,
    refetch,
    error,
  };
};
