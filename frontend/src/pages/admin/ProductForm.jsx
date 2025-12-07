import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById, addProduct, updateProduct } from '../../services/api';
import { Plus, Trash2, HelpCircle } from 'lucide-react';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    features: '',
    category: 'Unisex',
  });
  const [variants, setVariants] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          const product = await getProductById(id);
          setFormData({
            name: product.name,
            price: product.price,
            description: product.description,
            features: product.features,
            category: product.category || 'Unisex',
          });
          setCurrentImageUrl(product.image);
          if (product.variants) {
            setVariants(product.variants);
          }
        } catch (error) {
          console.error('Failed to fetch product', error);
        }
      };
      fetchProduct();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  // Variant Handlers
  const addVariant = () => {
    setVariants([...variants, { color: '', color_code: '#000000', stock: 0, price_modifier: 0 }]);
  };

  const removeVariant = (index) => {
    const newVariants = [...variants];
    newVariants.splice(index, 1);
    setVariants(newVariants);
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price);
    data.append('description', formData.description);
    data.append('features', formData.features);
    data.append('category', formData.category);
    
    // Append variants as JSON string
    data.append('variants', JSON.stringify(variants));
    
    if (imageFile) {
      data.append('image', imageFile);
    } else if (isEditMode) {
      data.append('imageUrl', currentImageUrl);
    }

    try {
      if (isEditMode) {
        await updateProduct(id, data);
      } else {
        await addProduct(data);
      }
      navigate('/admin/products');
    } catch (error) {
      console.error('Failed to save product', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditMode ? 'Edit Product' : 'Add New Product'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Product Name</label>
            <div className="mt-1">
              <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Price (PKR)</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <span className="text-gray-500 sm:text-sm">Rs.</span>
              </div>
              <input type="number" name="price" id="price" required min="0" step="1" value={formData.price} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" placeholder="0" />
            </div>
          </div>
          
          <div className="sm:col-span-6">
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
            <input 
              type="text" 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              placeholder="e.g. Men, Women, Unisex, Luxury"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" 
            />
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Product Image</label>
            <div className="mt-1 flex items-center gap-4">
               <input type="file" name="image" id="image" accept="image/*" onChange={handleFileChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
               {currentImageUrl && !imageFile && (
                <img src={currentImageUrl} alt="Current" className="h-16 w-16 object-cover rounded-md border" />
              )}
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <div className="mt-1">
              <textarea id="description" name="description" rows={3} required value={formData.description} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>
          </div>

          <div className="sm:col-span-6">
            <label htmlFor="features" className="block text-sm font-medium text-gray-700">Features (one per line)</label>
            <div className="mt-1">
              <textarea id="features" name="features" rows={3} value={formData.features} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
            </div>
          </div>
        </div>

        {/* Variants Section */}
        <div className="border-t pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-900">Color Variants & Stock</h3>
            <button type="button" onClick={addVariant} className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              <Plus size={16} className="mr-1" /> Add Variant
            </button>
          </div>
          
          {variants.length === 0 ? (
             <p className="text-sm text-gray-500 italic">No variants added. Standard product with shared stock.</p>
          ) : (
            <div className="space-y-3">
              {variants.map((variant, index) => (
                <div key={index} className="flex flex-wrap items-end gap-3 bg-gray-50 p-3 rounded-md border border-gray-200">
                  <div className="flex-1 min-w-[150px]">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Color Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Midnight Blue"
                      value={variant.color}
                      onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Color Code</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={variant.color_code}
                        onChange={(e) => handleVariantChange(index, 'color_code', e.target.value)}
                        className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                      />
                      <span className="text-xs text-gray-500">{variant.color_code}</span>
                    </div>
                  </div>
                  <div className="w-24">
                    <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                    <input
                      type="number"
                      min="0"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1"
                    />
                  </div>
                  <div className="w-28">
                     <label className="block text-xs font-medium text-gray-500 mb-1">Price (+/-)</label>
                     <input
                      type="number"
                      step="0.01"
                      value={variant.price_modifier}
                      onChange={(e) => handleVariantChange(index, 'price_modifier', parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-1"
                    />
                  </div>
                  <button type="button" onClick={() => removeVariant(index)} className="text-red-600 hover:text-red-800 p-1">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-3"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;
