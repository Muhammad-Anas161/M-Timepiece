import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const categories = [
  {
    id: 1,
    name: "Men's Watches",
    image: "https://images.unsplash.com/photo-1619134778706-7015533a6150?q=80&w=800&auto=format&fit=crop",
    link: "/shop?category=Men",
    size: "large"
  },
  {
    id: 2,
    name: "Women's Watches",
    image: "https://images.unsplash.com/photo-1590736969955-71cc94801759?q=80&w=800&auto=format&fit=crop",
    link: "/shop?category=Women",
    size: "large"
  },
  {
    id: 3,
    name: "Smart Watches",
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?q=80&w=800&auto=format&fit=crop",
    link: "/shop?category=Smart",
    size: "small"
  },
  {
    id: 4,
    name: "Luxury Copies",
    image: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=800&auto=format&fit=crop",
    link: "/shop?category=Luxury",
    size: "small"
  },
  {
    id: 5,
    name: "Digital & LED",
    image: "https://images.unsplash.com/photo-1557531383-a69888d31327?q=80&w=800&auto=format&fit=crop",
    link: "/shop?category=Digital",
    size: "small"
  }
];

const Categories = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Shop by Category</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explore our wide range of timepieces designed for every occasion and style.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-auto md:h-[600px]">
          {/* First Large Item */}
          <Link to={categories[0].link} className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-2xl cursor-pointer">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${categories[0].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-2xl font-bold text-white mb-2 transform translate-y-0 transition-transform">{categories[0].name}</h3>
              <span className="text-white/80 text-sm uppercase tracking-wider border-b border-white/30 pb-1 group-hover:border-white transition-colors">Explore Collection</span>
            </div>
          </Link>

          {/* Second Large Item */}
          <Link to={categories[1].link} className="md:col-span-2 md:row-span-1 relative group overflow-hidden rounded-2xl cursor-pointer min-h-[250px]">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
              style={{ backgroundImage: `url(${categories[1].image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-6">
              <h3 className="text-xl font-bold text-white mb-1">{categories[1].name}</h3>
              <span className="text-white/80 text-xs uppercase tracking-wider">Shop Now</span>
            </div>
          </Link>

          {/* Small Items */}
          {categories.slice(2).map((cat) => (
            <Link key={cat.id} to={cat.link} className="relative group overflow-hidden rounded-2xl cursor-pointer min-h-[200px]">
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${cat.image})` }}
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-lg font-bold text-white text-center px-4 border-2 border-white/30 py-2 backdrop-blur-sm rounded-lg group-hover:bg-white group-hover:text-black transition-all">
                  {cat.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Categories;
