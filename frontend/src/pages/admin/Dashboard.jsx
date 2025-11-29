import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;

  // Prepare data for charts
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'Pending').length },
    { name: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length },
    { name: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length },
    { name: 'Cancelled', value: orders.filter(o => o.status === 'Cancelled').length },
  ].filter(d => d.value > 0);

  const COLORS = ['#FBBF24', '#3B82F6', '#10B981', '#EF4444'];

  // Mock daily sales data (since we don't have dates in mock data easily accessible or consistent)
  // In a real app, we would group orders by date.
  const salesData = orders.slice(0, 5).map((order, index) => ({
    name: `Order ${order.id}`,
    amount: order.total
  }));

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">${totalRevenue.toFixed(2)}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{totalOrders}</dd>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dt className="text-sm font-medium text-gray-500 truncate">Pending Orders</dt>
            <dd className="mt-1 text-3xl font-semibold text-gray-900">{pendingOrders}</dd>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Sales</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="amount" fill="#4F46E5" name="Amount ($)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Order Status</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
