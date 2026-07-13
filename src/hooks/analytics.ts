import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export interface SystemStats {
  totalWeddings: number;
  totalUsers: number;
  totalSubscriptions: number;
  totalTemplates: number;
  [key: string]: any;
}

export const useSystemStats = () => {
  const { data, isLoading, refetch, error } = useQuery<SystemStats>({
    queryKey: [API_ENDPOINTS.ANALYTICS.SYSTEM_STATS],
    queryFn: () => rootApiService.post(API_ENDPOINTS.ANALYTICS.SYSTEM_STATS),
  });

  return {
    data,
    isLoading,
    refetch,
    error,
  };
};
