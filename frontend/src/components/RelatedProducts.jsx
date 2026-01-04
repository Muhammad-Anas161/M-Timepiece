import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts } from '../services/api';
import usePrice from '../hooks/usePrice';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';

const RelatedProducts = ({ productId, category, currentPrice }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { formatPrice } = usePrice();
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        // Fetch products from same category
        const data = await getProducts({ category });
        
        // Filter out current product and get similar price range
        const priceRange = currentPrice * 0.3; // 30% price range
        const related = data
          .filter(p => 
            (p._id || p.id) !== productId && 
            Math.abs(p.price - currentPrice) <= priceRange
          )
          .slice(0, 4); // Show max 4 products
        
        setProducts(related);
      } catch (error) {
        console.error('Failed to fetch related products:', error);
      } finally {
        setLoading(false);
      }
    };

    if (category && currentPrice) {
      fetchRelated();
    }
  }, [productId, category, currentPrice]);

  if (loading) {
    return null;
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product._id || product.id} className="group">
            <Link to={`/product/${product._id || product.id}`} className="block">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    addToCart(product);
                  }}
                  className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-gray-100"
                >
                  <ShoppingCart size={18} />
                </button>
              </div>
              <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mb-1">
                {Array.isArray(product.category) ? product.category[0] : (product.category?.split(',')[0] || 'Category')}
              </p>
              <p className="font-bold text-gray-900">{formatPrice(product.price)}</p>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
