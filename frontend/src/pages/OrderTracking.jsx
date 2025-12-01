import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderTracking = () => {
  const [trackingId, setTrackingId] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      if (trackingId.trim()) {
        // Mock order data
        setOrder({
          id: trackingId,
          status: 'shipped',
          createdAt: '2024-12-01',
          estimatedDelivery: '2024-12-05',
          items: [
            { name: 'Classic Leather Watch', quantity: 1, price: 4999 }
          ],
          timeline: [
            { status: 'confirmed', date: '2024-12-01 10:30 AM', completed: true },
            { status: 'processing', date: '2024-12-01 02:15 PM', completed: true },
            { status: 'shipped', date: '2024-12-02 09:00 AM', completed: true },
            { status: 'out_for_delivery', date: 'Expected: 2024-12-05', completed: false },
            { status: 'delivered', date: 'Pending', completed: false }
          ]
        });
      } else {
        setError('Please enter a valid tracking ID');
      }
      setLoading(false);
    }, 1000);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
      case 'processing':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'shipped':
        return <Truck className="text-blue-500" size={24} />;
      case 'out_for_delivery':
        return <Package className="text-orange-500" size={24} />;
      case 'delivered':
        return <CheckCircle className="text-green-600" size={24} />;
      default:
        return <Clock className="text-gray-400" size={24} />;
    }
  };

  const getStatusLabel = (status) => {
    return status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-gray-600">Enter your order ID to track your shipment</p>
        </div>

        {/* Tracking Form */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
          <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="Enter Order ID (e.g., ORD-12345)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Tracking...' : 'Track Order'}
            </button>
          </form>
          {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
        </div>

        {/* Order Status */}
        {order && (
          <div className="space-y-6">
            {/* Order Info */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order #{order.id}</h2>
                  <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Estimated Delivery</p>
                  <p className="text-lg font-bold text-gray-900">{new Date(order.estimatedDelivery).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                <Truck size={16} />
                {getStatusLabel(order.status)}
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Timeline</h3>
              <div className="space-y-6">
                {order.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-full ${item.completed ? 'bg-green-50' : 'bg-gray-50'}`}>
                        {getStatusIcon(item.status)}
                      </div>
                      {index < order.timeline.length - 1 && (
                        <div className={`w-0.5 h-12 ${item.completed ? 'bg-green-200' : 'bg-gray-200'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <h4 className={`font-medium ${item.completed ? 'text-gray-900' : 'text-gray-400'}`}>
                        {getStatusLabel(item.status)}
                      </h4>
                      <p className="text-sm text-gray-500 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900">Rs. {item.price.toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 rounded-xl p-6 text-center">
              <p className="text-gray-700 mb-4">Need help with your order?</p>
              <a
                href="#"
                className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                Contact Support
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
