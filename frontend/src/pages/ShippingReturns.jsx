import React from 'react';
import { Truck, Package, RotateCcw, Shield, Clock, MapPin } from 'lucide-react';

const ShippingReturns = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Shipping & Returns</h1>
          <p className="text-gray-600">Everything you need to know about delivery and returns</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-blue-50 p-6 rounded-xl text-center">
            <Truck className="mx-auto text-blue-600 mb-3" size={32} />
            <h3 className="font-bold text-gray-900 mb-1">Free Shipping</h3>
            <p className="text-sm text-gray-600">On orders above Rs. 2,999</p>
          </div>
          <div className="bg-green-50 p-6 rounded-xl text-center">
            <Clock className="mx-auto text-green-600 mb-3" size={32} />
            <h3 className="font-bold text-gray-900 mb-1">Fast Delivery</h3>
            <p className="text-sm text-gray-600">3-5 business days nationwide</p>
          </div>
          <div className="bg-purple-50 p-6 rounded-xl text-center">
            <RotateCcw className="mx-auto text-purple-600 mb-3" size={32} />
            <h3 className="font-bold text-gray-900 mb-1">7-Day Returns</h3>
            <p className="text-sm text-gray-600">For defective items</p>
          </div>
        </div>

        {/* Shipping Policy */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <Package className="text-indigo-600" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">Shipping Policy</h2>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Delivery Timeline</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-600" />
                  <span><strong>Major Cities</strong> (Karachi, Lahore, Islamabad): 2-3 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-600" />
                  <span><strong>Other Cities</strong>: 3-5 business days</span>
                </li>
                <li className="flex items-start gap-2">
                  <MapPin size={16} className="mt-1 flex-shrink-0 text-indigo-600" />
                  <span><strong>Remote Areas</strong>: 5-7 business days</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Shipping Charges</h3>
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">Orders above Rs. 2,999</span>
                  <span className="font-bold text-green-600">FREE</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Orders below Rs. 2,999</span>
                  <span className="font-bold text-gray-900">Rs. 150</span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cash on Delivery (COD)</h3>
              <p className="text-gray-600">
                We offer COD across Pakistan. Pay when you receive your order. 
                Please ensure someone is available to receive the package and make payment.
              </p>
            </div>
          </div>
        </div>

        {/* Returns Policy */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-indigo-600" size={28} />
            <h2 className="text-3xl font-bold text-gray-900">Returns & Exchange Policy</h2>
          </div>
          
          <div className="bg-gray-50 rounded-xl p-8 space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">7-Day Return Policy</h3>
              <p className="text-gray-600 mb-4">
                We offer a 7-day return policy from the date of delivery for defective or damaged items.
              </p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Important:</strong> The watch must be unused, unworn, and in original packaging with all tags and accessories intact.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How to Return</h3>
              <ol className="space-y-3 text-gray-600">
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
                  <span>Contact us on WhatsApp (0317-1067090) within 7 days of delivery</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
                  <span>Provide your order number and reason for return</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
                  <span>We'll arrange pickup or provide return shipping instructions</span>
                </li>
                <li className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
                  <span>Once we receive and inspect the item, we'll process your refund or exchange</span>
                </li>
              </ol>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Refund Timeline</h3>
              <p className="text-gray-600">
                Refunds are processed within 5-7 business days after we receive the returned item. 
                The amount will be credited to your original payment method.
              </p>
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-2">Need Help?</h3>
          <p className="mb-6 opacity-90">Our customer support team is here to assist you</p>
          <a
            href="https://wa.me/923171067090"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-gray-100 transition-colors"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
