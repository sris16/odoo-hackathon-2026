import React, { useState } from 'react';
import { Navigate, Outlet, NavLink, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Map, 
  PieChart, 
  Compass, 
  CheckSquare, 
  LogOut, 
  Menu,
  X,
  Plane
} from 'lucide-react';

export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'My Trips', path: '/trips', icon: Map },
    { name: 'Budget', path: '/budget', icon: PieChart },
    { name: 'Explore', path: '/explore', icon: Compass },
    { name: 'Checklist', path: '/checklist', icon: CheckSquare },
  ];

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 w-64 px-4 py-6">
      <Link to="/dashboard" className="flex items-center gap-2 px-2 mb-10 text-brand-600">
        <Plane size={28} />
        <span className="text-2xl font-bold tracking-tight">Traveloop</span>
      </Link>

      <nav className="flex-1 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium ${
                isActive 
                  ? 'bg-brand-50 text-brand-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <item.icon size={20} />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="pt-6 mt-6 border-t border-gray-100">
        <div className="px-3 mb-4">
          <p className="text-sm font-medium text-gray-900">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-left"
        >
          <LogOut size={20} />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed inset-y-0 z-50">
        <Sidebar />
      </div>

      {/* Mobile Menu */}
      <div className="lg:hidden">
        {/* Mobile Top Bar */}
        <div className="fixed top-0 inset-x-0 h-16 bg-white border-b border-gray-200 z-40 flex items-center justify-between px-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-brand-600">
            <Plane size={24} />
            <span className="text-xl font-bold">Traveloop</span>
          </Link>
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 flex">
            <div 
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="relative flex-1 w-full max-w-xs bg-white">
              <button
                className="absolute top-4 right-4 p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X size={24} />
              </button>
              <Sidebar />
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col pt-16 lg:pt-0 min-w-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
