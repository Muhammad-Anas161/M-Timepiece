  return (
    <footer className="bg-gray-900 border-t border-gray-800 pt-16 pb-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <img 
              src="/logo-white.png"/>
            <h3 className="font-bold text-white mb-6">Shop</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/shop" className="hover:text-white transition-colors">All Watches</Link></li>
              <li><Link to="/shop?category=Men" className="hover:text-white transition-colors">Men's Collection</Link></li>
              <li><Link to="/shop?category=Women" className="hover:text-white transition-colors">Women's Collection</Link></li>
              <li><Link to="/shop?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-white mb-6">Support</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link to="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
              <li><Link to="/shipping" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
              <li><Link to="/care" className="hover:text-white transition-colors">Watch Care</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-white mb-6">NEWSLETTER</h3>
            <p className="text-sm text-gray-400 mb-4">
              Subscribe for exclusive offers and updates!
            </p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="bg-transparent border border-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500 text-sm"
              />
              <button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} M Timepiece. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
