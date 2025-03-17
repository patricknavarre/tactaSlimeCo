import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

const ProductForm = ({ product, onSubmit, isSubmitting }) => {
  const [previewImage, setPreviewImage] = useState(product?.images?.[0]?.url || '');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch
  } = useForm({
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price || '',
      inventory: product?.inventory || 0,
      category: product?.category || '',
      featured: product?.featured || false
    }
  });
  
  const watchPrice = watch('price');
  const watchName = watch('name');
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left column - Main info */}
        <div className="md:col-span-2 space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Product Name*
            </label>
            <input
              id="name"
              type="text"
              {...register('name', { required: 'Product name is required' })}
              className={`input-field mt-1 ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description*
            </label>
            <textarea
              id="description"
              rows={5}
              {...register('description', { required: 'Description is required' })}
              className={`input-field mt-1 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Price (USD)*
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('price', { 
                    required: 'Price is required',
                    min: { value: 0, message: 'Price must be positive' },
                    valueAsNumber: true
                  })}
                  className={`input-field pl-7 ${errors.price ? 'border-red-500' : ''}`}
                />
              </div>
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
              {watchPrice && !errors.price && (
                <p className="mt-1 text-sm text-gray-500">
                  Display price: ${parseFloat(watchPrice).toFixed(2)}
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700">
                Inventory*
              </label>
              <input
                id="inventory"
                type="number"
                min="0"
                inputMode="numeric"
                pattern="[0-9]*"
                {...register('inventory', { 
                  required: 'Inventory is required',
                  min: { value: 0, message: 'Inventory must be 0 or higher' },
                  valueAsNumber: true,
                  setValueAs: v => parseInt(v, 10) || 0
                })}
                className={`input-field mt-1 ${errors.inventory ? 'border-red-500' : ''}`}
              />
              {errors.inventory && (
                <p className="mt-1 text-sm text-red-600">{errors.inventory.message}</p>
              )}
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category*
            </label>
            <select
              id="category"
              {...register('category', { required: 'Category is required' })}
              className={`input-field mt-1 ${errors.category ? 'border-red-500' : ''}`}
            >
              <option value="">Select a category</option>
              <option value="Cloud Slime">Cloud Slime</option>
              <option value="Butter Slime">Butter Slime</option>
              <option value="Glitter Slime">Glitter Slime</option>
              <option value="Crunchy Slime">Crunchy Slime</option>
              <option value="Clear Slime">Clear Slime</option>
              <option value="Foam Slime">Foam Slime</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
            )}
          </div>
          
          <div className="flex items-center">
            <input
              id="featured"
              type="checkbox"
              {...register('featured')}
              className="h-4 w-4 text-tacta-pink focus:ring-tacta-pink-light border-gray-300 rounded"
            />
            <label htmlFor="featured" className="ml-2 block text-sm text-gray-700">
              Featured product
            </label>
          </div>
          
          <div>
            <label htmlFor="specifications" className="block text-sm font-medium text-gray-700">
              Specifications (JSON format)
            </label>
            <textarea
              id="specifications"
              rows={3}
              placeholder='{"texture": "Fluffy", "scent": "Bubblegum", "color": "Pink"}'
              {...register('specifications')}
              className="input-field mt-1"
            />
            <p className="mt-1 text-xs text-gray-500">
              Enter product specifications in JSON format (optional)
            </p>
          </div>
        </div>
        
        {/* Right column - Image */}
        <div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">
              Product Image
            </label>
            <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-4 text-center">
                {previewImage ? (
                  <div className="relative mx-auto w-full h-48 rounded-md overflow-hidden bg-gray-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewImage}
                      alt={watchName || 'Product preview'}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage('')}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                    >
                      <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-tacta-pink hover:text-tacta-pink-light"
                  >
                    <span>Upload an image</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Shopify Integration
            </label>
            <div className="bg-gray-50 p-4 rounded-md">
              <div className="mb-4">
                <label htmlFor="shopifyProductId" className="block text-sm font-medium text-gray-700">
                  Shopify Product ID
                </label>
                <input
                  id="shopifyProductId"
                  type="text"
                  {...register('shopifyProductId')}
                  className="input-field mt-1 text-sm"
                  placeholder="Optional"
                />
              </div>
              
              <p className="text-xs text-gray-500">
                Connect this product to an existing Shopify product (optional)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="pt-6 border-t border-gray-200 flex justify-end space-x-3">
        <button
          type="button"
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary inline-flex justify-center items-center"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : product ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm; 