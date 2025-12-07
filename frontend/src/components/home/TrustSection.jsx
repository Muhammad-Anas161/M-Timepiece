import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Truck size={32} />,
    title: "Fast Delivery",
    description: "Across all Pakistan within 3-5 days"
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Payment",
    description: "Cash on Delivery & Bank Transfer"
  },
  {
    icon: <RefreshCw size={32} />,
    title: "7-Day Return",
    description: "Easy returns & exchange policy"
  },
  {
    icon: <Award size={32} />,
    title: "Quality Guarantee",
    description: "100% authentic & checked products"
  }
];

const TrustSection = () => {
  return (
    <section className="py-12 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
            >
              <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
