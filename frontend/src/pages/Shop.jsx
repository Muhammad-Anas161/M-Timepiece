import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import usePrice from '../hooks/usePrice';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { formatPrice } = usePrice();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryParam) params.category = categoryParam;
        if (searchParam) params.search = searchParam;
        
        const data = await getProducts(params);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryParam, searchParam]);

  const getTitle = () => {
    if (searchParam) return `Search Results for "${searchParam}"`;
    if (categoryParam) return `${categoryParam}'s Collection`;
    return 'All Collections';
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-serif font-bold text-gray-900 mb-8">{getTitle()}</h1>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="h-80 w-full mb-4 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-3/4 mb-2 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No products found.</p>
            <Link to="/shop" className="text-indigo-600 hover:text-indigo-500 mt-4 inline-block">
              View all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6 xl:gap-x-8">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </Link>
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link to={`/product/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{formatPrice(product.price)}</p>
                </div>
                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors relative z-10"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
