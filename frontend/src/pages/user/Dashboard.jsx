import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { ShoppingBag, Heart, User, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '0', icon: ShoppingBag, color: 'bg-blue-100 text-blue-600' },
    { label: 'Wishlist Items', value: '0', icon: Heart, color: 'bg-pink-100 text-pink-600' },
    { label: 'Pending Reviews', value: '0', icon: Clock, color: 'bg-yellow-100 text-yellow-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {user.username}!
        </h1>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your account today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Account Details</h2>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Name</span>
              <span className="font-medium text-gray-900">{user.username}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-50">
              <span className="text-gray-500">Email</span>
              <span className="font-medium text-gray-900">{user.email}</span>
            </div>
            <div className="pt-4">
              <Link to="/user/profile" className="text-indigo-600 hover:text-indigo-500 font-medium text-sm">
                Edit Profile &rarr;
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Orders</h2>
          <div className="text-center py-8">
            <div className="bg-gray-50 h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-400">
              <ShoppingBag size={20} />
            </div>
            <p className="text-gray-500 text-sm mb-4">No recent orders found</p>
            <Link 
              to="/shop" 
              className="inline-block px-4 py-2 bg-gray-900 text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
