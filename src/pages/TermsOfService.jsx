import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Terms of Service</h1>
        
        <div className="prose prose-indigo mx-auto text-gray-500 text-sm">
          <p>Last updated: November 2024</p>
          <p>
            Please read these Terms of Service carefully before using the Watch Junction website operated by us.
          </p>
          
          <h3 className="text-gray-900 mt-4">1. Conditions of Use</h3>
          <p>
            By using this website, you certify that you have read and reviewed this Agreement and that you agree to comply with its terms. If you do not want to be bound by the terms of this Agreement, you are advised to leave the website accordingly.
          </p>

          <h3 className="text-gray-900 mt-4">2. Intellectual Property</h3>
          <p>
            You agree that all materials, products, and services provided on this website are the property of Watch Junction, its affiliates, directors, officers, employees, agents, suppliers, or licensors including all copyrights, trade secrets, trademarks, patents, and other intellectual property.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
