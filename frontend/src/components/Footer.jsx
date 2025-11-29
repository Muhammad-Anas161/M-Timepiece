import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <h3 className="font-serif text-2xl font-bold mb-6">M TIMEPIECE</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Crafting moments that last forever. Premium timepieces for those who value every second.
            </p>
          </div>
          
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6">SHOP</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Watches</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Watches</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">New Arrivals</Link></li>
              <li><Link to="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6">SUPPORT</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/care" className="hover:text-white transition-colors">Care Instructions</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">Subscribe to receive updates, access to exclusive deals, and more.</p>
            <form className="flex flex-col space-y-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-gray-800 text-white px-4 py-2 focus:outline-none focus:ring-1 focus:ring-white"
              />
              <button className="bg-white text-gray-900 px-4 py-2 text-sm font-bold tracking-widest hover:bg-gray-100 transition-colors">
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs">© 2024 M Timepiece. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/privacy" className="text-gray-500 hover:text-white text-xs transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-gray-500 hover:text-white text-xs transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
