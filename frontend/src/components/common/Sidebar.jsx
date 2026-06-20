import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  UserPlus,
  Briefcase, 
  ShieldCheck, 
  Building2, 
  UserCheck, 
  GraduationCap,
  LogOut,
  User
} from 'lucide-react';

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      navigate('/');
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-orange-200 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-1 px-3">
          <NavItem to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" />
          
          <div className="pt-4 pb-2 px-3 text-xs font-bold text-orange-400 uppercase tracking-wider">
            Users Management
          </div>
          <NavItem to="/student/manage" icon={<Users size={20} />} label="Manage Student" />
          <NavItem to="/student/add" icon={<UserPlus size={20} />} label="Add Student" />
          
          <NavItem to="/staff/manage" icon={<Briefcase size={20} />} label="Manage Staff" />
          <NavItem to="/staff/add" icon={<UserPlus size={20} />} label="Add Staff" />
          
          <div className="pt-4 pb-2 px-3 text-xs font-bold text-orange-400 uppercase tracking-wider">
            Administration
          </div>
          <NavItem to="/department" icon={<Building2 size={20} />} label="Department" />
          <NavItem to="/security/manage" icon={<ShieldCheck size={20} />} label="Security" />
          <NavItem to="/tutor" icon={<GraduationCap size={20} />} label="Tutor" />
          <NavItem to="/hod" icon={<UserCheck size={20} />} label="HOD" />
        </nav>
      </div>

      <div className="border-t border-orange-200 p-4">
        <div className="flex items-center space-x-3 mb-4 px-2">
          <div className="bg-orange-100 p-2 rounded-full">
            <User size={20} className="text-orange-600" />
          </div>
          <span className="text-sm font-bold text-gray-800">Admin Profile</span>
        </div>
        
        <button 
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg transition-colors hover:bg-orange-50 hover:text-orange-600"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

const NavItem = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
          isActive 
            ? 'bg-orange-500 text-white shadow-sm' 
            : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
        }`
      }
    >
      <span className="mr-3">{icon}</span>
      {label}
    </NavLink>
  );
};

export default Sidebar;
