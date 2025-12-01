import React from 'react';
import { Award, Heart, Shield, Zap } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Award,
      title: 'Quality First',
      description: 'Every timepiece is carefully selected and quality-checked before reaching you.'
    },
    {
      icon: Heart,
      title: 'Customer Love',
      description: 'Your satisfaction is our priority. We go the extra mile to ensure you love your purchase.'
    },
    {
      icon: Shield,
      title: 'Authenticity Guaranteed',
      description: '100% authentic products with warranty and easy returns.'
    },
    {
      icon: Zap,
      title: 'Fast Delivery',
      description: 'Quick nationwide shipping so you can enjoy your new watch sooner.'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-900 text-white py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 opacity-90"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About M Timepiece</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Your trusted destination for premium watches in Pakistan. Every Style. Every Budget. Every Timepiece.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                M Timepiece was founded with a simple mission: to make premium watches accessible to everyone in Pakistan. We believe that a great watch is more than just a timekeeper—it's a statement of style, a mark of quality, and a companion for life's important moments.
              </p>
              <p>
                What started as a passion for horology has grown into Pakistan's trusted multi-brand watch destination. We curate the finest selection of watches across all price ranges, from affordable everyday pieces to luxury statement watches.
              </p>
              <p>
                Today, we're proud to serve thousands of satisfied customers across Pakistan, delivering not just watches, but confidence, style, and reliability.
              </p>
            </div>
          </div>
          <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=800&auto=format&fit=crop" 
              alt="Watches collection" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Why Choose M Timepiece?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                  <div className="inline-flex p-3 bg-indigo-100 rounded-full mb-4">
                    <Icon className="text-indigo-600" size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-12 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-xl max-w-3xl mx-auto leading-relaxed">
            To become Pakistan's most trusted watch destination by offering authentic products, exceptional service, and unbeatable value. We're committed to making every customer feel confident in their purchase and proud of their timepiece.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-gray-400">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-gray-400">Watch Models</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50+</div>
              <div className="text-gray-400">Brands</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
