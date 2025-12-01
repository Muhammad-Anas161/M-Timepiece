import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  // Mock wishlist data for now
  const wishlistItems = [];

  if (wishlistItems.length === 0) {
    return (
      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center">
        <div className="bg-pink-50 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-400">
          <Heart size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-6">Save items you love to buy later.</p>
        <Link 
          to="/shop" 
          className="inline-block px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Wishlist items will go here */}
      </div>
    </div>
  );
};

export default Wishlist;
