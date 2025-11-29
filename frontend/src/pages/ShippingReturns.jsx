import React from 'react';

const ShippingReturns = () => {
  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Shipping & Returns</h1>
        
        <div className="prose prose-indigo mx-auto text-gray-500">
          <h2 className="text-gray-900">Shipping Policy</h2>
          <p>
            We are pleased to offer complimentary express shipping on all orders worldwide. All shipments are fully insured and trackable.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Domestic (USA):</strong> 1-2 business days via FedEx Overnight.</li>
            <li><strong>International:</strong> 3-5 business days via DHL Express.</li>
          </ul>
          <ul className="list-disc pl-5 space-y-2">
            <li>The watch must be unworn, unaltered, and in its original condition.</li>
            <li>All original packaging, tags, and warranty cards must be included.</li>
          </ul>
          <p>
            To initiate a return, please contact our support team at returns@watchjunction.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingReturns;
