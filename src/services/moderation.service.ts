import type {
  FilterPhotoWallDto,
  FilterWishDto,
  IPhotoWall,
  IWish,
  PageRequest,
  PageResponse,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const wishService = {
  getWishes: async (
    data: PageRequest<FilterWishDto>,
  ): Promise<PageResponse<IWish>> => {
    const response = await rootApiService.post<PageResponse<IWish>>(
      API_ENDPOINTS.WISH.PAGINATION,
      data,
    );
    return response;
  },

  approveWish: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WISH.APPROVE,
      { id },
    );
    return response;
  },

  rejectWish: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WISH.REJECT,
      { id },
    );
    return response;
  },

  pinWish: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WISH.PIN,
      { id },
    );
    return response;
  },

  unpinWish: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WISH.UNPIN,
      { id },
    );
    return response;
  },

  deleteWish: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.WISH.DELETE,
      { id },
    );
    return response;
  },
};

export const photoWallService = {
  getPhotos: async (
    data: PageRequest<FilterPhotoWallDto>,
  ): Promise<PageResponse<IPhotoWall>> => {
    const response = await rootApiService.post<PageResponse<IPhotoWall>>(
      API_ENDPOINTS.PHOTO_WALL.PAGINATION,
      data,
    );
    return response;
  },

  approvePhoto: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.PHOTO_WALL.APPROVE,
      { id },
    );
    return response;
  },

  rejectPhoto: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.PHOTO_WALL.REJECT,
      { id },
    );
    return response;
  },

  deletePhoto: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.PHOTO_WALL.DELETE,
      { id },
    );
    return response;
  },
};
