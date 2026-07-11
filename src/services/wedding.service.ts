import type {
  AdminForceResetSlugDto,
  FilterWeddingDto,
  IWedding,
  PageRequest,
  PageResponse,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const weddingService = {
  getWeddings: async (
    data: PageRequest<FilterWeddingDto>,
  ): Promise<PageResponse<IWedding>> => {
    const response = await rootApiService.post<PageResponse<IWedding>>(
      API_ENDPOINTS.WEDDING.PAGINATION,
      data,
    );
    return response;
  },

  getWeddingById: async (id: string): Promise<IWedding> => {
    const response = await rootApiService.post<IWedding>(
      API_ENDPOINTS.WEDDING.FIND_BY_ID,
      { id },
    );
    return response;
  },

  forceResetSlug: async (
    data: AdminForceResetSlugDto,
  ): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WEDDING.FORCE_RESET_SLUG,
      data,
    );
    return response;
  },

  publishWedding: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WEDDING.PUBLISH,
      { id },
    );
    return response;
  },

  unpublishWedding: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WEDDING.UNPUBLISH,
      { id },
    );
    return response;
  },

  getSlugHistory: async (id: string): Promise<any[]> => {
    const response = await rootApiService.post<any[]>(
      API_ENDPOINTS.WEDDING.SLUG_HISTORY,
      { id },
    );
    return response;
  },

  deleteWedding: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WEDDING.DELETE,
      { id },
    );
    return response;
  },
};
