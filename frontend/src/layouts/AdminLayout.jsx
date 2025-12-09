import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Home, LogOut, Users, Moon, Sun, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Coupons', href: '/admin/coupons', icon: Package },
    { name: 'Live Traffic', href: '/admin/traffic', icon: Users },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col flex-grow pt-5 bg-white dark:bg-gray-800 overflow-y-auto border-r border-gray-200 dark:border-gray-700 h-full">
      <div className="flex items-center justify-between flex-shrink-0 px-4 mb-5">
        <span className="font-serif text-xl font-bold text-gray-900 dark:text-white">M Timepiece Admin</span>
        {/* Close button for mobile */}
        <button 
          onClick={() => setSidebarOpen(false)}
          className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Theme Toggle in Mobile Sidebar */}
      <div className="px-4 mb-4 md:mb-0">
         <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center p-2 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            {theme === 'dark' ? (
              <>
                <Sun size={20} className="mr-2" />
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <Moon size={20} className="mr-2" />
                <span>Dark Mode</span>
              </>
            )}
          </button>
      </div>

      <div className="mt-2 flex-grow flex flex-col">
        <nav className="flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setSidebarOpen(false)} 
                className={`${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    isActive ? 'text-indigo-500 dark:text-indigo-400' : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-300'
                  } mr-3 flex-shrink-0 h-6 w-6 transition-colors`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700">
        <Link to="/" className="flex items-center px-4 py-3 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors">
          <Home className="mr-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
          Back to Store
        </Link>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5 text-red-500 dark:text-red-400" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 flex overflow-hidden transition-colors duration-200">
      
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 flex flex-col w-72 max-w-xs bg-white dark:bg-gray-800 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar (Static) */}
      <div className="hidden md:flex md:w-64 md:flex-col">
        <SidebarContent />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden w-full">
        {/* Mobile Header */}
        <div className="md:hidden pl-4 pr-4 pt-4 pb-2 flex items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
           <button
            onClick={() => setSidebarOpen(true)}
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
          >
            <span className="sr-only">Open sidebar</span>
            <Menu size={24} />
          </button>
          <span className="font-serif text-lg font-bold text-gray-900 dark:text-white">Admin Panel</span>
          <div className="w-12"></div> {/* Spacer for center alignment */}
        </div>

        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
