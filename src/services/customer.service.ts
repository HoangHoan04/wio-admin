import type {
  ChangePasswordDto,
  FilterCustomerDto,
  ICustomer,
  PageRequest,
  PageResponse,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const customerService = {
  getCustomers: async (
    data: PageRequest<FilterCustomerDto>,
  ): Promise<PageResponse<ICustomer>> => {
    const response = await rootApiService.post<PageResponse<ICustomer>>(
      API_ENDPOINTS.CUSTOMER.PAGINATION,
      data,
    );
    return response;
  },

  getCustomerById: async (id: string): Promise<ICustomer> => {
    const response = await rootApiService.post<{
      message: string;
      data: ICustomer;
    }>(API_ENDPOINTS.CUSTOMER.FIND_BY_ID, { id });
    return response.data;
  },

  activateCustomer: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.CUSTOMER.ACTIVATE,
      { id },
    );
    return response;
  },

  deactivateCustomer: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.CUSTOMER.DEACTIVATE,
      { id },
    );
    return response;
  },

  selectBox: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.CUSTOMER.SELECT_BOX,
      { id },
    );
    return response;
  },

  changePassword: async (
    data: ChangePasswordDto,
  ): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.CUSTOMER.CHANGE_PASSWORD,
      data,
    );
    return response;
  },
};
