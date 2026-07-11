import type {
  CreateMusicBackgroundDto,
  FilterMusicBackgroundDto,
  IMusicBackground,
  ImportYoutubeDto,
  PageRequest,
  PageResponse,
  UpdateMusicBackgroundDto,
} from "@/dto";
import rootApiService from "./api.service";
import { API_ENDPOINTS } from "./endpoint";

export const musicBackgroundService = {
  getMusicList: async (
    data: PageRequest<FilterMusicBackgroundDto>,
  ): Promise<PageResponse<IMusicBackground>> => {
    const response = await rootApiService.post<PageResponse<IMusicBackground>>(
      API_ENDPOINTS.MUSIC_BACKGROUND.PAGINATION,
      data,
    );
    return response;
  },

  getMusicById: async (id: string): Promise<IMusicBackground> => {
    const response = await rootApiService.post<{ data: IMusicBackground }>(
      API_ENDPOINTS.MUSIC_BACKGROUND.FIND_BY_ID,
      { id },
    );
    return response.data;
  },

  createMusic: async (data: CreateMusicBackgroundDto): Promise<IMusicBackground> => {
    const response = await rootApiService.post<{ data: IMusicBackground }>(
      API_ENDPOINTS.MUSIC_BACKGROUND.CREATE,
      data,
    );
    return response.data;
  },

  importYoutube: async (data: ImportYoutubeDto): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.MUSIC_BACKGROUND.IMPORT_YOUTUBE,
      data,
    );
    return response;
  },

  updateMusic: async (data: UpdateMusicBackgroundDto): Promise<IMusicBackground> => {
    const response = await rootApiService.post<{ data: IMusicBackground }>(
      API_ENDPOINTS.MUSIC_BACKGROUND.UPDATE,
      data,
    );
    return response.data;
  },

  deleteMusic: async (id: string): Promise<{ message: string }> => {
    const response = await rootApiService.post<{ message: string }>(
      API_ENDPOINTS.MUSIC_BACKGROUND.DELETE,
      { id },
    );
    return response;
  },
};
