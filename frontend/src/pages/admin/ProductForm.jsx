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
    brand: '',
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
            brand: product.brand || '',
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
    setVariants([...variants, { color: '', color_code: '#000000', stock: 0, price_modifier: 0, imageFile: null, image: '' }]);
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
    data.append('feature', formData.features);
    data.append('category', formData.category);
    data.append('brand', formData.brand);
    
    // Append variants as JSON string (metadata only)
    // We send the variants JSON. Note: imageFile objects are stripped by JSON.stringify anyway, 
    // but we need to ensure we send the 'image' URL if it exists (for edits)
    // We send the variants JSON.
    // If image is cleared in UI (variant.image is empty), it will represent removal if we handle it in backend.
    data.append('variants', JSON.stringify(variants.map(v => ({
      ...v,
      imageFile: undefined // distinct file upload, not in JSON
    }))));
    
    // Append variant images with specific keys
    variants.forEach((variant, index) => {
        if (variant.imageFile) {
            data.append(`variant_image_${index}`, variant.imageFile);
        }
    });
    
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

          <div className="sm:col-span-4">
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700">Brand</label>
            <div className="mt-1">
              <input type="text" name="brand" id="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Rolex" className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2" />
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

          <div className="sm:col-span-3">
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Thumbnail Image (For Shop Card)</label>
            <div className="mt-1 flex items-center gap-4">
               <input type="file" name="image" id="image" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
               {currentImageUrl && !imageFile && (
                <img src={currentImageUrl} alt="Current Thumbnail" className="h-16 w-16 object-cover rounded-md border" />
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
                <div key={index} className="bg-gray-50 p-4 rounded-md border border-gray-200 relative">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Color Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Midnight Blue"
                        value={variant.color}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Color Code</label>
                      <div className="flex items-center gap-2 h-9">
                        <input
                          type="color"
                          value={variant.color_code}
                          onChange={(e) => handleVariantChange(index, 'color_code', e.target.value)}
                          className="h-8 w-8 p-0 border-0 rounded cursor-pointer"
                        />
                        <span className="text-xs text-gray-500">{variant.color_code}</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={variant.stock}
                        onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                    <div>
                       <label className="block text-xs font-medium text-gray-500 mb-1">Price Modifier (+/-)</label>
                       <input
                        type="number"
                        step="0.01"
                        value={variant.price_modifier}
                        onChange={(e) => handleVariantChange(index, 'price_modifier', parseFloat(e.target.value) || 0)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm border p-2"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Variant Image (Required)</label>
                      <div className="flex items-center gap-4">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleVariantChange(index, 'imageFile', e.target.files[0])}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        />
                         {variant.image && !variant.imageFile && (
                            <div className="flex items-center gap-2 bg-white px-2 py-1 rounded border">
                                <span className="text-xs text-gray-500">Current:</span>
                                <img src={variant.image} alt={variant.color} className="h-8 w-8 object-cover rounded" />
                                <button
                                  type="button"
                                  onClick={() => handleVariantChange(index, 'image', '')}
                                  className="text-red-500 hover:text-red-700 ml-1"
                                  title="Remove Image"
                                >
                                  <Trash2 size={14} />
                                </button>
                            </div>
                         )}
                      </div>
                   </div>

                  <button 
                    type="button" 
                    onClick={() => removeVariant(index)} 
                    className="absolute top-2 right-2 text-red-600 hover:text-red-800 p-1 bg-white rounded-full shadow-sm"
                    title="Remove Variant"
                  >
                    <Trash2 size={16} />
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
