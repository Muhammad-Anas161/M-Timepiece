import React from 'react';

const CareInstructions = () => {
  return (
    <div className="bg-white min-h-screen pt-20 pb-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">Care Instructions</h1>
        
        <div className="prose prose-indigo mx-auto text-gray-500">
          <p>
            A Watch Junction watch is a precision instrument designed to last a lifetime. Proper care and maintenance will ensure its longevity and performance.
          </p>

          <h3 className="text-gray-900 mt-6">Cleaning</h3>
          <p>
            Clean your watch regularly with a soft, dry cloth. For water-resistant models, you can use a soft brush and soapy water to clean the case and metal bracelet. Rinse with fresh water afterwards. Avoid using chemicals or solvents.
          </p>

          <h3 className="text-gray-900 mt-6">Water Resistance</h3>
          <p>
            Ensure the crown is fully pushed in or screwed down before exposing your watch to water. Do not operate pushers or the crown while underwater. We recommend having the water resistance checked annually.
          </p>

          <h3 className="text-gray-900 mt-6">Magnetism</h3>
          <p>
            Avoid placing your watch near strong magnetic fields (speakers, refrigerators, etc.) as this can affect the accuracy of the movement.
          </p>

          <h3 className="text-gray-900 mt-6">Service</h3>
          <p>
            We recommend a full service every 3-5 years by a professional watchmaker to clean, oil, and adjust the movement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CareInstructions;
