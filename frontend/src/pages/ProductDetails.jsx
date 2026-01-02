import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Truck, Shield, Clock, ZoomIn, Package, Check } from 'lucide-react';
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
  const [isZoomed, setIsZoomed] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  
  const { addToCart } = useCart();
  const { formatPrice } = usePrice();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const data = await getProductById(id);
        setProduct(data);
        
        // Auto-select first variant if available
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
          setCurrentImage(data.variants[0].image || data.image);
        } else {
          setCurrentImage(data.image);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Calculate dynamic price (Safe to execute even if product is null, just guard access)
  const currentPrice = selectedVariant 
    ? (product?.price || 0) + (selectedVariant.price_modifier || 0)
    : (product?.price || 0);

  // Determine stock to show
  const displayStock = selectedVariant ? selectedVariant.stock : (product?.stock_quantity || 0);

  const uniqueImages = React.useMemo(() => {
    if (!product) return [];
    const images = [
      product.image,
      ...(product.images || [])
    ].filter(Boolean);
    return [...new Set(images)];
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    // If variants exist but none selected (shouldn't happen with auto-select, but safe guard)
    if (product.variants && product.variants.length > 0 && !selectedVariant) {
      alert('Please select a color');
      return;
    }

    // Check stock for variant
    const currentStock = selectedVariant ? selectedVariant.stock : product.stock_quantity;
    if (currentStock < quantity) {
      alert(`Only ${currentStock} items available in stock`);
      return;
    }

    addToCart(product, quantity, selectedVariant);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !product) {

  return (
    <div className="bg-white dark:bg-gray-900 transition-colors duration-200 min-h-screen">
      <div className="pt-24 pb-16 sm:pb-24">
        <nav aria-label="Breadcrumb" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ol role="list" className="flex items-center space-x-4">
            <li>
              <div className="flex items-center">
                <Link to="/" className="mr-4 text-sm font-medium text-gray-900 dark:text-white hover:text-indigo-600">
                  Home
                </Link>
                <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300">
                  <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
                </svg>
              </div>
            </li>
            <li className="text-sm">
              <Link to="/shop" className="mr-4 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-600">
                Shop
              </Link>
              <svg viewBox="0 0 6 20" aria-hidden="true" className="h-5 w-auto text-gray-300 inline">
                <path d="M4.878 4.34H3.551L.27 16.532h1.327l3.281-12.19z" fill="currentColor" />
              </svg>
            </li>
            <li className="text-sm">
              <span className="font-medium text-gray-500 dark:text-gray-400">{product.name}</span>
            </li>
          </ol>
        </nav>

        <div className="mx-auto mt-8 max-w-2xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:auto-rows-min lg:grid-cols-12 lg:gap-x-8">
            <div className="lg:col-span-5 lg:col-start-8">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                    {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                  </p>
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">{product.name}</h1>
                </div>
              </div>
              
              <div className="mt-4 flex items-center gap-4">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{formatPrice(currentPrice)}</p>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                  <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">(4.5)</span>
                </div>
              </div>

              {/* Stock Indicator */}
              <div className="mt-4">
                {displayStock > 0 ? (
                  <p className="text-sm text-green-600 flex items-center gap-2">
                    <Package size={16} />
                    {displayStock < 5 ? `Only ${displayStock} left in stock!` : 'In Stock'}
                  </p>
                ) : (
                  <p className="text-sm text-red-600 font-medium">Out of Stock</p>
                )}
              </div>

              <div className="mt-8 border-t border-b py-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-900">Brand:</span>
                  <span className="ml-2 text-gray-600">{product.brand || 'M Timepiece'}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-900">Category:</span>
                  <span className="ml-2 text-gray-600">
                    {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                  </span>
                </div>
              </div>
            </div>

              {/* Variants Selector */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Color</h3>
                  <div className="flex items-center space-x-3 mt-2">
                    {product.variants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => {
                          setSelectedVariant(variant);
                          if (variant.image) setCurrentImage(variant.image);
                        }}
                        className={`relative w-8 h-8 rounded-full focus:outline-none ring-2 ring-offset-2 ${
                          selectedVariant && selectedVariant.id === variant.id ? 'ring-indigo-500' : 'ring-transparent border border-gray-200'
                        }`}
                        style={{ backgroundColor: variant.color_code || '#000' }}
                        title={`${variant.color} ${variant.price_modifier ? `(${formatPrice(variant.price_modifier)} extra)` : ''}`}
                      >
                         {selectedVariant && selectedVariant.id === variant.id && (
                           <span className="absolute inset-0 flex items-center justify-center text-white mix-blend-difference">
                             <Check size={14} />
                           </span>
                         )}
                      </button>
                    ))}
                    <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
                      {selectedVariant ? selectedVariant.color : 'Select a color'}
                    </span>
                  </div>
                </div>
              )}

            </div>

            {/* Image Gallery with Zoom */}
            <div className="mt-8 lg:col-span-7 lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:mt-0">
              <h2 className="sr-only">Images</h2>
              <div class="flex flex-col-reverse lg:flex-row gap-4">
                {/* Thumbnails */}
                 <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:max-h-[600px] scrollbar-hide">
                    {uniqueImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setCurrentImage(img);
                          // Auto-select variant if image matches
                          const variant = product.variants?.find(v => v.image === img);
                          setSelectedVariant(variant || null);
                        }}
                        className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${currentImage === img ? 'border-indigo-500' : 'border-transparent'}`}
                      >
                        <img src={img} alt={`${product.name} view ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                      </button>
                    ))}
                 </div>

                <div className="relative group flex-1 aspect-square lg:aspect-auto lg:h-[600px] bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentImage || product.image || 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80'}
                    alt={product.name}
                    className="w-full h-full object-cover cursor-zoom-in transition-transform duration-300"
                    onClick={() => setIsZoomed(true)}
                    loading="lazy"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80'; }}
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <ZoomIn size={20} className="text-gray-700" />
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 lg:col-span-5">
              <form>
                {/* Quantity Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      -
                    </button>
                    <span className="text-lg font-medium w-12 text-center dark:text-white">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={displayStock === 0}
                  className={`flex w-full items-center justify-center rounded-md border border-transparent px-8 py-3 text-base font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    displayStock > 0 
                      ? 'bg-gray-900 hover:bg-gray-800 focus:ring-gray-500 dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-500' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {displayStock > 0 ? 'Add to cart' : 'Out of Stock'}
                </button>
              </form>

              {/* Product details */}
              <div className="mt-10">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white">Description</h2>
                <div className="prose prose-sm mt-4 text-gray-500 dark:text-gray-400">
                  <p>{product.description}</p>
                </div>
              </div>

              {/* Specifications Table */}
              <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                <h2 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Specifications</h2>
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-500">Brand</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.brand || 'M Timepiece'}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-500">Category</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">
                        {Array.isArray(product.category) ? product.category.join(', ') : product.category}
                      </dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-500">Material</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.material || 'Stainless Steel'}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-500">Water Resistance</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.waterResistance || '3 ATM'}</dd>
                    </div>
                    <div className="py-3 flex justify-between">
                      <dt className="text-sm text-gray-500">Movement</dt>
                      <dd className="text-sm font-medium text-gray-900 dark:text-white">{product.movement || 'Quartz'}</dd>
                    </div>
                  </dl>
                </div>
              </div>

              {/* Features */}
              {product.features && (
                <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
                  <h2 className="text-sm font-medium text-gray-900 dark:text-white">Features</h2>
                  <div className="prose prose-sm mt-4 text-gray-500 dark:text-gray-400">
                    <ul role="list">
                      {(Array.isArray(product.features) ? product.features : product.features.split('\n')).map((feature, idx) => (
                        <li key={idx}>{feature.trim()}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Policies */}
              <section aria-labelledby="policies-heading" className="mt-10">
                <h2 id="policies-heading" className="sr-only">
                  Our Policies
                </h2>

                <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-center">
                    <dt>
                      <Truck className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="mt-4 text-sm font-medium text-gray-900 dark:text-white">Fast Delivery</span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">Nationwide shipping available</dd>
                  </div>
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 text-center">
                    <dt>
                      <Shield className="mx-auto h-6 w-6 flex-shrink-0 text-gray-400" aria-hidden="true" />
                      <span className="mt-4 text-sm font-medium text-gray-900 dark:text-white">7-Day Return</span>
                    </dt>
                    <dd className="mt-1 text-sm text-gray-500 dark:text-gray-400">For defective items only</dd>
                  </div>
                </dl>
              </section>
            </div>
          </div>

          {/* Product Reviews */}
          <ProductReviews productId={id} />

          {/* Related Products */}
          <RelatedProducts productId={id} category={product.category} currentPrice={product.price} />
        </div>
      </div>

      {/* Image Zoom Modal */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <img
            src={currentImage}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
