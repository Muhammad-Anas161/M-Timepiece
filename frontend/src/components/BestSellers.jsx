import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getProducts } from '../services/api';
import usePrice from '../hooks/usePrice';

const BestSellers = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const { formatPrice } = usePrice();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      // Get first 4 products as best sellers
      setProducts(data.slice(0, 4));
    };
    fetchProducts();
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">Best Sellers</h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our most loved timepieces, chosen by watch enthusiasts worldwide.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="group">
              <div className="relative overflow-hidden bg-white aspect-[3/4] mb-6 rounded-lg shadow-sm">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                  />
                </Link>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 pointer-events-none"></div>
                <button 
                  onClick={() => addToCart(product)}
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-6 py-3 text-sm font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap"
                >
                  ADD TO CART
                </button>
              </div>
              <div className="text-center">
                <Link to={`/product/${product.id}`}>
                  <h3 className="text-lg font-medium text-gray-900 mb-1 font-serif hover:text-gray-600 transition-colors">{product.name}</h3>
                </Link>
                <p className="text-gray-500">{formatPrice(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestSellers;
