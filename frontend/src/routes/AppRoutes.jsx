import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage';
import AdminLayout from '../layouts/AdminLayout';
import StudentForm  from '../components/forms/StudentForm';
import StaffForm  from '../components/forms/StaffForm';
import ManageStudents from '../pages/students/ManageStudents';
import CreateClass from '../pages/class/CreateClass';
import ManageStaff from '../pages/staff/ManageStaff';
import ManageHod from '../pages/hod/ManageHod';
import ManageSecurity from '../pages/security/ManageSecurity';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      
      {/* Admin Protected Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<div className="bg-white p-6 rounded-lg shadow border border-orange-100"><h2 className="text-xl font-bold text-orange-600">Dashboard</h2><p className="mt-2 text-gray-600">Welcome to Admin Dashboard</p></div>} />
        
        {/* Student Routes */}
        <Route path="/student/add" element={ <StudentForm /> } />
        <Route path="/student/manage" element={<ManageStudents />} />
        
        {/* Staff Routes */}
        <Route path="/staff/manage" element={<ManageStaff />} />
        <Route path="/staff/add" element={<StaffForm /> } />
        
        {/* Security Routes */}
        <Route path="/security/manage" element={<ManageSecurity />} />
        
        {/* Other Admin Routes */}
        <Route path="/class/manage" element={<CreateClass />} />
        <Route path="/hod" element={<ManageHod />} />
      </Route>
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
