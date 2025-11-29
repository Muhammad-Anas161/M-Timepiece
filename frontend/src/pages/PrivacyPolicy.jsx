import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Privacy Policy</h1>
        
        <div className="prose prose-indigo mx-auto text-gray-500 text-sm">
          <p>Last updated: November 2024</p>
          <p>
            At Watch Junction, we respect your privacy and are committed to protecting your personal data. This privacy policy will inform you as to how we look after your personal data when you visit our website and tell you about your privacy rights and how the law protects you.
          </p>
          
          <h3 className="text-gray-900 mt-4">1. Information We Collect</h3>
          <p>
            We may collect, use, store and transfer different kinds of personal data about you which we have grouped together follows: Identity Data, Contact Data, Financial Data, Transaction Data, and Technical Data.
          </p>

          <h3 className="text-gray-900 mt-4">2. How We Use Your Information</h3>
          <p>
            We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
          </p>
          <ul className="list-disc pl-5">
            <li>Where we need to perform the contract we are about to enter into or have entered into with you.</li>
            <li>Where it is necessary for our legitimate interests (or those of a third party) and your interests and fundamental rights do not override those interests.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
