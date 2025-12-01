import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

const reviews = [
  {
    id: 1,
    name: "Ahmed Khan",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Absolutely love my new watch! The quality is premium and delivery was super fast. Will definitely buy again.",
    verified: true
  },
  {
    id: 2,
    name: "Sarah Ali",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "Best place to buy watches in Pakistan. The customer service is amazing and the packaging was beautiful.",
    verified: true
  },
  {
    id: 3,
    name: "Bilal Ahmed",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop",
    rating: 4,
    text: "Great collection of smart watches. Prices are very reasonable compared to market.",
    verified: true
  },
  {
    id: 4,
    name: "Zainab Malik",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    rating: 5,
    text: "I ordered a gift for my husband and he loved it. The quality is top notch!",
    verified: true
  }
];

const Reviews = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
          <p className="text-gray-500 mt-2">Trusted by thousands of happy customers across Pakistan</p>
        </div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {reviews.map((review) => (
            <SwiperSlide key={review.id}>
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 h-full relative"
              >
                <Quote className="absolute top-6 right-6 text-indigo-100" size={40} />
                
                <div className="flex items-center gap-4 mb-6">
                  <img 
                    src={review.image} 
                    alt={review.name} 
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{review.name}</h4>
                    {review.verified && (
                      <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-medium">
                        Verified Buyer
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
                    />
                  ))}
                </div>

                <p className="text-gray-600 leading-relaxed">"{review.text}"</p>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Reviews;
