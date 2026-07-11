import { create } from 'zustand';

interface LoadingState {
  isLoading: boolean;
  message?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isLoading: false,
  message: '',
  showLoading: (message) => set({ isLoading: true, message: message || 'Đang tải...' }),
  hideLoading: () => set({ isLoading: false, message: '' }),
}));

export default useLoadingStore;
