import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Truck, Shield, Clock } from 'lucide-react';
import { getProductById } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductReviews from '../components/ProductReviews';
import RelatedProducts from '../components/RelatedProducts';
import usePrice from '../hooks/usePrice';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { formatPrice } = usePrice();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <Link to="/" className="text-indigo-600 hover:text-indigo-500 flex items-center">
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="pt-24 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <Link to="/" className="mr-4 text-sm font-medium text-gray-900 hover:text-indigo-600">
                  Home
                </Link>
                <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300">
                  <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <a href="#" aria-current="page" className="font-medium text-gray-500 hover:text-gray-600">
                {product.name}
              </a>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                <p className="text-3xl tracking-tight text-gray-900">{formatPrice(product.price)}</p>
              </div>

              {/* Stock Indicator */}
              {product.stock_quantity !== undefined && (
                <div className="mt-2">
                  {product.stock_quantity > 0 ? (
                    <p className="text-sm text-green-600">
                      {product.stock_quantity < 5 ? `Only ${product.stock_quantity} left in stock!` : 'In Stock'}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">Out of Stock</p>
                  )}
                </div>
              )}
            </div>

            {/* Image Gallery */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 lg:grid-rows-3 lg:gap-8">
                <img
                  src={product.image}
                  alt={product.name}
                  className="rounded-lg lg:col-span-2 lg:row-span-3 w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="mt-8 lg:col-span-5">
              <form>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="mt-8 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Add to cart
                </button>
              </form>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900">Description</h2>
                <div className="prose prose-sm mt-4 text-gray-500">
                  <p>{product.description}</p>
                </div>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-8">
                <h2 className="text-sm font-medium text-gray-900">Features</h2>
                <div className="prose prose-sm mt-4 text-gray-500">
                  <ul role="list">
                    {(Array.isArray(product.features) ? product.features : product.features.split('\n')).map((feature) => (
                      <li key={feature}>{feature.trim()}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 id="policies-heading" className="sr-only">
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                    <dt>
                      <Truck className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="mt-4 text-sm font-medium text-gray-900">Fast Delivery</span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">Nationwide shipping available</dd>
                  </div>
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
                    <dt>
                      <Shield className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="mt-4 text-sm font-medium text-gray-900">7-Day Return</span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500">For defective items only</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>

          {/* Product Reviews */}
          <ProductReviews productId={id} />

          {/* Related Products */}
          <RelatedProducts productId={id} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
