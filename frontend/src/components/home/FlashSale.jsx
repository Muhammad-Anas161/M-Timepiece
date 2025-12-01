import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Timer, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const FlashSale = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Set deadline to 2 days from now
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 2);

    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline - now;

      if (difference <= 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeUnit = ({ value, label }) => (
    <div className="flex flex-col items-center bg-white/10 backdrop-blur-sm rounded-lg p-3 min-w-[70px]">
      <span className="text-3xl font-bold text-white">{String(value).padStart(2, '0')}</span>
      <span className="text-xs text-white/70 uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <section className="py-16 bg-gradient-to-r from-indigo-900 to-purple-900 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-white"
          >
            <div className="flex items-center gap-2 text-red-400 font-bold tracking-wider uppercase mb-4">
              <Timer className="animate-pulse" />
              <span>Limited Time Offer</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Deal of the Week
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Up to 50% OFF
              </span>
            </h2>
            <p className="text-indigo-200 text-lg mb-8 max-w-md">
              Grab our premium luxury watches at unbeatable prices. Don't miss out on these exclusive time-limited deals.
            </p>

            <div className="flex gap-4 mb-10">
              <TimeUnit value={timeLeft.days} label="Days" />
              <TimeUnit value={timeLeft.hours} label="Hours" />
              <TimeUnit value={timeLeft.minutes} label="Mins" />
              <TimeUnit value={timeLeft.seconds} label="Secs" />
            </div>

            <Link 
              to="/shop?sort=price-asc" 
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg hover:shadow-white/20"
            >
              Shop Deals <ArrowRight size={20} />
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Floating Product Image */}
            <div className="relative z-10">
              <img 
                src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2459&auto=format&fit=crop" 
                alt="Luxury Watch" 
                className="rounded-2xl shadow-2xl transform rotate-[-5deg] hover:rotate-0 transition-transform duration-500 border-4 border-white/10"
              />
              
              {/* Floating Price Tag */}
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl transform rotate-[5deg] animate-bounce">
                <p className="text-gray-500 text-sm line-through">Rs. 15,000</p>
                <p className="text-3xl font-bold text-indigo-600">Rs. 7,499</p>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-indigo-500/20 rounded-full blur-3xl -z-10"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FlashSale;
