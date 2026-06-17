import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import InsertStudentPage from '../pages/students/InsertStudentPage';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Dashboard</h2><p className="mt-2 text-gray-600">Welcome to Admin Dashboard</p></div>} />
        
        {/* Student Routes */}
        <Route path="/student/add" element={<InsertStudentPage />} />
        <Route path="/student/manage" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Manage Students</h2><p className="mt-2 text-gray-600">Student list will appear here.</p></div>} />
        
        {/* Staff Routes */}
        <Route path="/staff/add" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Add Staff</h2><p className="mt-2 text-gray-600">Form to add staff will appear here.</p></div>} />
        <Route path="/staff/manage" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Manage Staff</h2><p className="mt-2 text-gray-600">Staff list will appear here.</p></div>} />
        
        {/* Security Routes */}
        <Route path="/security/add" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Add Security</h2><p className="mt-2 text-gray-600">Form to add security will appear here.</p></div>} />
        <Route path="/security/manage" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Manage Security</h2><p className="mt-2 text-gray-600">Security personnel list will appear here.</p></div>} />
        
        {/* Other Admin Routes */}
        <Route path="/department" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Department Management</h2><p className="mt-2 text-gray-600">Department management interface.</p></div>} />
        <Route path="/tutor" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Tutor Management</h2><p className="mt-2 text-gray-600">Tutor mapping interface.</p></div>} />
        <Route path="/hod" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">HOD Management</h2><p className="mt-2 text-gray-600">HOD mapping interface.</p></div>} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
