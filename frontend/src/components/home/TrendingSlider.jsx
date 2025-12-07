import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getProducts } from '../../services/api';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const TrendingSlider = () => {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        // Simulate trending by taking random or first 8 products
        setProducts(data.slice(0, 8));
      } catch (error) {
        console.error('Failed to fetch trending products', error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    addToCart(product);
    toast.success('Added to cart');
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Trending Now</h2>
            <p className="text-gray-500 dark:text-gray-400 mt-2">Top picks from our premium collection</p>
          </motion.div>
          <Link to="/shop" className="hidden md:block text-indigo-600 font-medium hover:text-indigo-800 transition-colors">
            View All Products &rarr;
          </Link>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          spaceBetween={24}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
          }}
                  />
                  
                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                    <button 
                      onClick={(e) => handleAddToCart(e, product)}
                      className="p-3 bg-white text-gray-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300"
                      title="Add to Cart"
                    >
                      <ShoppingBag size={20} />
                    </button>
                    <Link 
                      to={`/product/${product.id}`}
                      className="p-3 bg-white text-gray-900 rounded-full hover:bg-indigo-600 hover:text-white transition-colors shadow-lg transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75"
                      title="View Details"
                    >
                      <Eye size={20} />
                    </Link>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.price < 5000 && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">HOT</span>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.category}</p>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 truncate hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">Rs. {product.price.toLocaleString()}</span>
                    <div className="flex items-center text-yellow-400 text-sm">
                      <span>★</span>
                      <span className="text-gray-400 ml-1">(4.5)</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default TrendingSlider;
