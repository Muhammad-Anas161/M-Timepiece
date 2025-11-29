import React from 'react';
import { Shield, Lock, Truck, RefreshCw } from 'lucide-react';

const TrustBadges = () => {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Shield className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Secure Payment</h3>
            <p className="text-xs text-gray-500">SSL Encrypted</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Truck className="h-10 w-10 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Fast Shipping</h3>
            <p className="text-xs text-gray-500">Nationwide Delivery</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <RefreshCw className="h-10 w-10 text-indigo-600" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">7-Day Return</h3>
            <p className="text-xs text-gray-500">For Defective Items</p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-3">
              <Lock className="h-10 w-10 text-gray-700" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">100% Authentic</h3>
            <p className="text-xs text-gray-500">Verified Products</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBadges;
