import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts } from '../services/api';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import usePrice from '../hooks/usePrice';
import { Filter, SlidersHorizontal } from 'lucide-react';
import FilterSidebar from '../components/shop/FilterSidebar';

const Shop = () => {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const searchParam = searchParams.get('search');

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { formatPrice } = usePrice();

  // Filter States
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [sortBy, setSortBy] = useState('newest');

  // Initialize categories from URL param
  useEffect(() => {
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    } else {
      setSelectedCategories([]);
    }
  }, [categoryParam]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Fetch all products and filter client-side for better UX
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Derived Data: Unique Categories
  const allCategories = useMemo(() => {
    const cats = new Set();
    products.forEach(p => {
      if (Array.isArray(p.category)) {
        p.category.forEach(c => {
           if (typeof c === 'string') {
             c.split(',').forEach(subC => cats.add(subC.trim()));
           } else {
             cats.add(c);
           }
        });
      } else if (p.category) {
        p.category.split(',').forEach(c => cats.add(c.trim()));
      }
    });
    return Array.from(cats).sort();
  }, [products]);

  // Derived Data: Unique Brands
  const allBrands = useMemo(() => {
    // Filter out null/undefined brands and default 'M Timepiece' if desired, or keep all
    const brands = new Set(products.map(p => p.brand).filter(Boolean));
    return Array.from(brands).sort();
  }, [products]);

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search Filter
      if (searchParam && !product.name.toLowerCase().includes(searchParam.toLowerCase())) {
        return false;
      }

      // Category Filter
      if (selectedCategories.length > 0) {
        // Handle both array and string (legacy) category structure
        const productCats = Array.isArray(product.category) ? product.category : [product.category];
        const hasCategory = productCats.some(cat => selectedCategories.includes(cat));
        if (!hasCategory) return false;
      }

      // Brand Filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(product.brand)) {
        return false;
      }

      // Price Filter
      if (priceRange.min && product.price < Number(priceRange.min)) return false;
      if (priceRange.max && product.price > Number(priceRange.max)) return false;

      return true;
    }).sort((a, b) => {
      // Sorting Logic
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'newest':
        default:
          return b.id - a.id; // Assuming higher ID is newer
      }
    });
  }, [products, searchParam, selectedCategories, selectedBrands, priceRange, sortBy]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const handleBrandChange = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) 
        ? prev.filter(b => b !== brand)
        : [...prev, brand]
    );
  };

  const handlePriceChange = (type, value) => {
    setPriceRange(prev => ({ ...prev, [type]: value }));
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceRange({ min: '', max: '' });
    setSortBy('newest');
  };

  const getTitle = () => {
    if (searchParam) return `Search Results for "${searchParam}"`;
    if (selectedCategories.length === 1) return `${selectedCategories[0]} Collection`;
    return 'All Collections';
  };

  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen pt-20 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header & Mobile Filter Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-gray-900">{getTitle()}</h1>
            <p className="text-gray-500 mt-1">{filteredProducts.length} products found</p>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50 flex-1 justify-center"
            >
              <Filter size={18} /> Filters
            </button>

            <div className="relative flex-1 md:flex-none">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-4 lg:gap-x-8">
          {/* Sidebar Filters */}
          <FilterSidebar 
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            categories={allCategories}
            selectedCategories={selectedCategories}
            onCategoryChange={handleCategoryChange}
            brands={allBrands}
            selectedBrands={selectedBrands}
            onBrandChange={handleBrandChange}
            priceRange={priceRange}
            onPriceChange={handlePriceChange}
            onClearFilters={clearFilters}
          />

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i}>
                    <div className="h-80 w-full mb-4 bg-gray-200 animate-pulse rounded-lg"></div>
                    <div className="h-4 w-3/4 mb-2 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                <p className="text-gray-500 mt-1">Try adjusting your filters or search query.</p>
                <button 
                  onClick={clearFilters}
                  className="mt-6 text-indigo-600 hover:text-indigo-500 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-6">
                {filteredProducts.map((product) => (
                  <div key={product._id || product.id} className="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-90 lg:aspect-none lg:h-80 relative">
                      <Link to={`/product/${product._id || product.id}`}>
                        <img
                          src={product.image}
                          alt={product.name}

                          className="h-full w-full object-cover object-center lg:h-full lg:w-full transition-all duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                      </Link>
                      {/* Quick Add Button (Desktop) */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          addToCart(product);
                        }}
                        className="absolute bottom-4 right-4 bg-white text-gray-900 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hover:bg-black hover:text-white hidden lg:block"
                        title="Add to Cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                      </button>
                    </div>
                    <div className="p-4 bg-white dark:bg-gray-800">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                            {Array.isArray(product.category) ? product.category[0] : product.category}
                          </p>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                            <Link to={`/product/${product._id || product.id}`}>
                              <span aria-hidden="true" className="absolute inset-0" />
                              {product.name}
                            </Link>
                          </h3>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-medium text-gray-900 dark:text-white">{formatPrice(product.price)}</p>
                        <div className="flex items-center text-yellow-400 text-xs">
                          <span>★</span>
                          <span className="text-gray-400 ml-1">4.5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shop;
