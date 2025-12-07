import React from 'react';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import NewsletterSignup from './NewsletterSignup';

const Footer = () => {
  const { theme } = useTheme();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <img 
              src={theme === 'dark' ? "/logo-white.png" : "/logo-black.png"} 
              alt="M Timepiece" 
              className="h-10 w-auto text-gray-900 dark:text-white" 
            />
            <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
              Crafting moments into memories with distinct elegance and timeless precision.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
            
            {/* Added Contact Info here to save space in col 4 */}
            <div className="pt-4 space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <MapPin size={16} />
                <span>Horology District, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={16} />
                <span>concierge@m-timepiece.com</span>
              </div>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/shop" className="hover:text-black dark:hover:text-white transition-colors">All Watches</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-black dark:hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-black dark:hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-black dark:hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/faq" className="hover:text-black dark:hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-black dark:hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/care" className="hover:text-black dark:hover:text-white transition-colors">Watch Care</Link></li>
              <li><Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white mb-6">Stay Updated</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
              Subscribe for exclusive offers, new arrivals, and watch care tips.
            </p>
            <NewsletterSignup />
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            © {new Date().getFullYear()} M Timepiece. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400 dark:text-gray-500">
            <Link to="/privacy" className="hover:text-black dark:hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-black dark:hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
