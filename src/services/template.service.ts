import type {
  CreateTemplateDto,
  FilterTemplateDto,
  ITemplate,
  PageRequest,
  PageResponse,
  SetPremiumTemplateDto,
  UpdateTemplateDto,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const templateService = {
  getTemplates: async (
    data: PageRequest<FilterTemplateDto>,
  ): Promise<PageResponse<ITemplate>> => {
    const response = await rootApiService.post<PageResponse<ITemplate>>(
      API_ENDPOINTS.TEMPLATE.PAGINATION,
      data,
    );
    return response;
  },

  getTemplateById: async (id: string): Promise<ITemplate> => {
    const response = await rootApiService.post<{ data: ITemplate }>(
      API_ENDPOINTS.TEMPLATE.FIND_BY_ID,
      { id },
    );
    return response.data;
  },

  createTemplate: async (data: CreateTemplateDto): Promise<ITemplate> => {
    const response = await rootApiService.post<{ data: ITemplate }>(
      API_ENDPOINTS.TEMPLATE.CREATE,
      data,
    );
    return response.data;
  },

  updateTemplate: async (data: UpdateTemplateDto): Promise<ITemplate> => {
    const response = await rootApiService.post<{ data: ITemplate }>(
      API_ENDPOINTS.TEMPLATE.UPDATE,
      data,
    );
    return response.data;
  },

  deleteTemplate: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.TEMPLATE.DELETE,
      { id },
    );
    return response;
  },

  activateTemplate: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.TEMPLATE.ACTIVATE,
      { id },
    );
    return response;
  },

  deactivateTemplate: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.TEMPLATE.DEACTIVATE,
      { id },
    );
    return response;
  },

  setPremiumTemplate: async (
    data: SetPremiumTemplateDto,
  ): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.TEMPLATE.SET_PREMIUM,
      data,
    );
    return response;
  },
};
