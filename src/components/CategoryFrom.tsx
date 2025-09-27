import React, { useState } from 'react';
import { X, Tag, FileText, Upload, Image as ImageIcon, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { postData } from '../redux/api/api';

interface CreateCategoryFormProps {
  onClose: () => void;
}

const CreateCategoryForm = ({ onClose }: CreateCategoryFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null as File | null,
  });
  const [loading, setLoading] = useState(false);

  // Handle text input
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle file input
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Create FormData object for file + text
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      // Call API using helper
      const res = await postData('/api/services/createCategory', submitData, { isMultipart: true });
      
      if (res?.success) {
        toast.success('Category created successfully!');
        onClose();
      } else {
        throw new Error(res?.message || 'Failed to create category');
      }
    } catch (error: any) {
      console.error('Error creating category:', error);
      toast.error(error?.message || 'Failed to create category');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-200 dark:border-gray-700 transform transition-all duration-300 scale-100">
        {/* Header with gradient */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-cyan-600 dark:from-emerald-700 dark:to-cyan-700 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Plus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Create Category</h2>
                <p className="text-emerald-100 dark:text-emerald-200 text-sm">
                  Add a new service category to organize your offerings
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              disabled={loading}
              className="p-2 hover:bg-white/20 rounded-xl transition-all duration-200 text-white hover:text-gray-200 disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-8 bg-gray-50 dark:bg-gray-900/50">
          {/* Category Name */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <Tag className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
              Category Name *
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                placeholder="Enter category name"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <FileText className="w-4 h-4 mr-2 text-cyan-600 dark:text-cyan-400" />
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:focus:ring-cyan-400 dark:focus:border-cyan-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md resize-none"
              placeholder="Describe what types of services belong to this category..."
            />
          </div>

          {/* Image Upload */}
          <div className="space-y-4">
            <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              <ImageIcon className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
              Category Image
            </label>
            
            {/* Image Preview */}
            {formData.image && (
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                  <Upload className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  Image Preview
                </p>
                <img 
                  src={URL.createObjectURL(formData.image)} 
                  alt="Category preview" 
                  className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm"
                />
              </div>
            )}
            
            {/* File Upload */}
            <div className="relative">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="category-image-upload"
              />
              <label 
                htmlFor="category-image-upload" 
                className="flex items-center justify-center w-full py-4 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-purple-400 dark:hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-700"
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {formData.image ? 'Change Image' : 'Upload Category Image'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Click to browse or drag and drop
                  </p>
                </div>
              </label>
            </div>
            
            <p className="text-xs text-gray-500 dark:text-gray-400 bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg border border-purple-200 dark:border-purple-800">
              <span className="font-medium">💡 Tip:</span> Choose an icon or image that represents this category. Recommended: 400x300px, max 2MB
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <X className="w-4 h-4" />
              <span>Cancel</span>
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-700 hover:to-cyan-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Creating...</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Create Category</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCategoryForm;
