import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';

const AdminLayout = () => {
  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      <Header />
      <div className="flex flex-1 w-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-orange-50/40 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
