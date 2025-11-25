import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import usePrice from '../hooks/usePrice';

const RelatedProducts = ({ productId }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { formatPrice } = usePrice();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}/related`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelated();
  }, [productId]);

  if (loading || products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16 border-t border-gray-200 pt-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="group">
            <div className="relative overflow-hidden bg-white aspect-[3/4] mb-4 rounded-lg shadow-sm">
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
                className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-gray-900 px-4 py-2 text-xs font-medium opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-lg cursor-pointer whitespace-nowrap"
              >
                ADD TO CART
              </button>
            </div>
            <div className="text-center">
              <Link to={`/product/${product.id}`}>
                <h3 className="text-sm font-medium text-gray-900 mb-1 hover:text-gray-600 transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-sm text-gray-500">{formatPrice(product.price)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
