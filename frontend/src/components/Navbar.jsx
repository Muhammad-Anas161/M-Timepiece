import React, { useState } from 'react';
import { Search, ShoppingBag, Menu, X, User, Sun, Moon } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import CurrencySwitcher from './CurrencySwitcher';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { cartCount, toggleCart } = useCart();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
  return (
    <nav className="fixed w-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-md z-50 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center justify-center md:justify-start w-full md:w-auto">
            <Link to="/" className="flex items-center">
              <img 
                src={theme === 'dark' ? "/logo-white.png" : "/logo-black.png"} 
                alt="M Timepiece" 
                className="h-12 w-auto" 
              />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/shop" className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">COLLECTIONS</Link>
            <Link to="/shop?category=Men" className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">MEN</Link>
            <Link to="/shop?category=Women" className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">WOMEN</Link>
            <Link to="/about" className="text-sm font-medium text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">ABOUT</Link>
            <CurrencySwitcher />
            <button onClick={toggleTheme} className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>

          {/* Icons */}
          <div className="hidden md:flex items-center space-x-6">
            {isSearchOpen ? (
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  className="bg-transparent border-b border-gray-300 dark:border-gray-600 focus:border-black dark:focus:border-white outline-none px-2 py-1 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  onBlur={() => setTimeout(() => setIsSearchOpen(false), 200)}
                />
              </form>
            ) : (
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <Search size={20} />
              </button>
            )}
            
            {user && (
              <Link to="/admin" className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <User size={20} />
              </Link>
            )}

            <button 
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
              onClick={toggleCart}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Mobile Cart Icon */}
           <div className="flex items-center md:hidden">
            <button 
              className="text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-300 transition-colors relative"
              onClick={toggleCart}
            >
              <ShoppingBag size={20} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg z-40">
          <div className="px-4 pt-2 pb-6 space-y-2">
            <Link to="/shop" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">COLLECTIONS</Link>
            <Link to="/shop?category=Men" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">MEN</Link>
            <Link to="/shop?category=Women" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">WOMEN</Link>
            <Link to="/about" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">ABOUT</Link>
            {user && (
              <Link to="/admin" className="block px-3 py-2 text-base font-medium text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800">
                ADMIN DASHBOARD
              </Link>
            )}
            {/* Mobile Theme Toggle */}
             <div className="flex items-center justify-between px-3 py-2 mt-4 border-t border-gray-100 dark:border-gray-800">
              <span className="text-gray-900 dark:text-white">Theme</span>
               <button onClick={toggleTheme} className="text-gray-900 dark:text-white p-2">
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
