import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/login', { email, password });
      if (response.data.success) {
        set({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
        return response.data;
      } else {
        set({
          isLoading: false,
          error: response.data.message || 'Login failed',
        });
        return response.data;
      }
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'An error occurred during login';
      set({
        isLoading: false,
        error: errorMsg,
      });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/auth/logout');
      if (response.data.success) {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Logout failed';
      set({
        isLoading: false,
        error: errorMsg,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/auth/me');
      if (response.data.success) {
        set({
          user: response.data.data,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
      return response.data;
    } catch (error) {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null, 
      });
    }
  },
}));

export default useAuthStore;
