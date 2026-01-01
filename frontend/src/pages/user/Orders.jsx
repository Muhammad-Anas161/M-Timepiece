import React, { useState, useEffect } from 'react';
import { getOrders } from '../../services/api';
import { Package, ChevronRight } from 'lucide-react';
import usePrice from '../../hooks/usePrice';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = usePrice();

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

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 animate-pulse">
            <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="bg-gray-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
          <Package size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
        <p className="text-gray-500 mb-6">You haven't placed any orders yet.</p>
        <a 
          href="/shop" 
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Browse Collection
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
      
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Order {order.order_number ? `#${order.order_number}` : `#${order.id}`}</p>
                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className={`
                  px-3 py-1 rounded-full text-xs font-medium capitalize
                  ${order.status === 'delivered' ? 'bg-green-100 text-green-700' : 
                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' : 
                    'bg-yellow-100 text-yellow-700'}
                `}>
                  {order.status}
                </span>
                <p className="font-bold text-gray-900">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
            
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  {order.items?.length || 0} items
                </p>
                <button className="text-indigo-600 hover:text-indigo-500 text-sm font-medium flex items-center gap-1">
                  View Details <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
