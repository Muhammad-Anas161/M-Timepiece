import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop"
          alt="Luxury Watch"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
        <div className="text-white max-w-xl">
          <h1 className="text-4xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Timeless Elegance
          </h1>
          <p className="text-xl md:text-2xl mb-8 font-light text-gray-200">
            Discover our collection of premium timepieces designed for the modern individual.
          </p>
          <Link 
            to="/shop"
            className="inline-block bg-white text-gray-900 px-8 py-4 text-sm font-bold tracking-widest hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 uppercase"
          >
            Shop Collection
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
