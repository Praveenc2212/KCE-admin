import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useClassStore = create((set) => ({
  classes: [],
  isLoading: false,
  error: null,

  fetchClasses: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/class', { params: filters });
      if (response.data.success) {
        set({ classes: response.data.data, isLoading: false });
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to fetch classes' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error fetching classes';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  createClass: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/class', data);
      if (response.data.success) {
        set((state) => ({
          classes: [...state.classes, response.data.data],
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to create class' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error creating class';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  updateClassTutor: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // Backend expects { department, year, section, newStaffId } in the body
      const response = await axiosInstance.put('/class', data);
      if (response.data.success) {
        set((state) => ({
          classes: state.classes.map((c) =>
            c.department === data.department && c.year === data.year && c.section === data.section
              ? { ...c, tutors: [{ ...response.data.data.newTutor }] }
              : c
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to reassign tutor' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error reassigning tutor';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  deleteClass: async (data) => {
    set({ isLoading: true, error: null });
    try {
      // axios.delete with body needs data in a config object
      const response = await axiosInstance.delete('/class', { data });
      if (response.data.success) {
        set((state) => ({
          classes: state.classes.filter(
            (c) => !(c.department === data.department && c.year === data.year && c.section === data.section)
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to delete class' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error deleting class';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useClassStore;
