import type {
  FilterSubscriptionDto,
  ISubscription,
  PageRequest,
  PageResponse,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const subscriptionService = {
  getSubscriptions: async (
    data: PageRequest<FilterSubscriptionDto>,
  ): Promise<PageResponse<ISubscription>> => {
    const response = await rootApiService.post<PageResponse<ISubscription>>(
      API_ENDPOINTS.SUBSCRIPTION.PAGINATION,
      data,
    );
    return response;
  },

  getSubscriptionById: async (id: string): Promise<ISubscription> => {
    const response = await rootApiService.post<ISubscription>(
      API_ENDPOINTS.SUBSCRIPTION.FIND_BY_ID,
      { id },
    );
    return response;
  },

  changePlan: async (data: { id: string; planName: string }): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.SUBSCRIPTION.CHANGE_PLAN,
      data,
    );
    return response;
  },

  deleteSubscription: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.SUBSCRIPTION.DELETE,
      { id },
    );
    return response;
  },
};
