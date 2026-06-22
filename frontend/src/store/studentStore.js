import { create } from 'zustand';
import axiosInstance from '../api/axiosInstance';

const useStudentStore = create((set) => ({
  students: [],
  isLoading: false,
  error: null,

  fetchStudents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get('/students', { params: filters });
      if (response.data.success) {
        set({
          students: response.data.data,
          isLoading: false,
        });
      } else {
        set({
          isLoading: false,
          error: response.data.message || 'Failed to fetch students',
        });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error fetching students';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  bulkCreateStudents: async (studentsData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.post('/students/bulk-create', studentsData);
      if (response.data.success) {
        set({ isLoading: false });
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to bulk create students' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error creating students';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  updateStudent: async (rollno, data) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.put(`/students/${rollno}`, data);
      if (response.data.success) {
        set((state) => ({
          students: state.students.map((student) =>
            student.rollno === rollno ? response.data.data : student
          ),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to update student' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error updating student';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },

  deleteStudent: async (rollno) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.delete(`/students/${rollno}`);
      if (response.data.success) {
        set((state) => ({
          students: state.students.filter((student) => student.rollno !== rollno),
          isLoading: false,
        }));
      } else {
        set({ isLoading: false, error: response.data.message || 'Failed to delete student' });
      }
      return response.data;
    } catch (error) {
      const errorMsg = error.response?.data?.message || error.message || 'Error deleting student';
      set({ isLoading: false, error: errorMsg });
      throw new Error(errorMsg);
    }
  },
}));

export default useStudentStore;
