import React from 'react';
import { Link } from 'react-router-dom';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div>
            <img src="/logo-white.png" alt="M Timepiece" className="h-16 w-auto mb-6" />
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
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-bold tracking-widest mb-6">NEWSLETTER</h4>
            <p className="text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers and updates!
            </p>
            <NewsletterSignup />
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} M Timepiece. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm text-gray-400">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
