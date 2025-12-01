import React, { useState } from 'react';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Heart, 
  User, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

const UserLayout = () => {
  const { user, logout, loading } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const navigation = [
    { name: 'Dashboard', href: '/user', icon: LayoutDashboard },
    { name: 'My Orders', href: '/user/orders', icon: ShoppingBag },
    { name: 'Wishlist', href: '/user/wishlist', icon: Heart },
    { name: 'Profile', href: '/user/profile', icon: User },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Sidebar Toggle */}
          <div className="lg:hidden mb-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="flex items-center gap-2 text-gray-600 bg-white px-4 py-2 rounded-lg shadow-sm w-full"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              <span className="font-medium">Menu</span>
            </button>
          </div>

          {/* Sidebar */}
          <aside className={`
            lg:w-64 bg-white rounded-xl shadow-sm border border-gray-100 h-fit
            ${isSidebarOpen ? 'block' : 'hidden lg:block'}
          `}>
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                  {user.username ? user.username[0].toUpperCase() : 'U'}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 truncate max-w-[120px]">{user.email}</p>
                </div>
              </div>
            </div>
            
            <nav className="p-4 space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                      ${isActive(item.href) 
                        ? 'bg-gray-900 text-white' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                    onClick={() => setIsSidebarOpen(false)}
                  >
                    <Icon size={18} />
                    {item.name}
                  </Link>
                );
              })}
              
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-4"
              >
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserLayout;
