import React from 'react';

const About = () => {
  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-8">About Watch Junction</h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Curating timeless pieces for the modern individual.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src="https://images.unsplash.com/photo-1509941943102-10c232535736?auto=format&fit=crop&q=80&w=1000" 
                alt="Watchmaking" 
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded in 2024, Watch Junction began with a simple mission: to make luxury timepieces accessible. We believe that a watch is more than just a tool to tell time; it's a statement of style, a piece of history, and a companion for life's most important moments.
              </p>
              <p className="text-gray-600">
                Each watch in our collection is meticulously selected from trusted suppliers to ensure quality and authenticity. We source the best designs to bring you exceptional value.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
