import React from 'react';
import { X } from 'lucide-react';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  categories, 
  selectedCategories, 
  onCategoryChange,
  priceRange,
  onPriceChange,
  onClearFilters
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:shadow-none lg:z-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full overflow-y-auto p-6">
          <div className="flex justify-between items-center mb-8 lg:hidden">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X size={24} />
            </button>
          </div>

          {/* Categories */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Categories
            </h3>
            <div className="space-y-3">
              {categories.map((category) => (
                <label key={category} className="flex items-center cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category)}
                    onChange={() => onCategoryChange(category)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-3 text-gray-600 group-hover:text-indigo-600 transition-colors">
                    {category}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-8">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">
              Price Range (PKR)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Rs.</span>
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => onPriceChange('min', e.target.value)}
                    placeholder="Min"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <span className="text-gray-400">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">Rs.</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => onPriceChange('max', e.target.value)}
                    placeholder="Max"
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={onClearFilters}
            className="w-full py-2 px-4 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
