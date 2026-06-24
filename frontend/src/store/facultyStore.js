import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useFacultyStore = create((set) => ({
  staffs: [],
  isLoading: false,
  error: null,

  fetchStaffs: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/faculty', { params: filters });
      if (response.data.success) {
        set({ staffs: response.data.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to fetch staff' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error fetching staff';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  bulkCreateFaculties: async (facultiesData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/faculty/bulk-create', facultiesData);
      if (response.data.success) {
        set({ isLoading: false });
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to bulk create staff' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error creating staff';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  updateFaculty: async (staffId, updateData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/faculty/${staffId}`, updateData);
      if (response.data.success) {
        set((state) => ({
          staffs: state.staffs.map((staff) =>
            staff.staffId === staffId ? { ...staff, ...updateData } : staff
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to update staff' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error updating staff';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  deleteFaculty: async (staffId) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/faculty/${staffId}`);
      if (response.data.success) {
        set((state) => ({
          staffs: state.staffs.filter((staff) => staff.staffId !== staffId),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to delete staff' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error deleting staff';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useFacultyStore;
