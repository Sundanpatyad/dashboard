import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Upload, Image as ImageIcon, IndianRupee, Tag, Type, FileText, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { createService, fetchCategories } from '../redux/slices/servicesSlice';
import { getData } from '../redux/api/api';

const AddService = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { categories, actionLoading } = useAppSelector((state) => state.services);
  const isLoading = actionLoading?.save || false;
  
  const [planTypes, setPlanTypes] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subtitle: '',
    price: '',
    planType: '',
    features: [''],
    image: null as File | null,
  });

  // Fetch categories and plan types only if not already loaded
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Only fetch categories if they're empty
        if (categories.length === 0) {
          dispatch(fetchCategories());
        }
        
        // Only fetch plan types if they're empty
        if (planTypes.length === 0) {
          const planTypeRes = await getData('/api/services/planTypes');
          setPlanTypes(planTypeRes.data || []);
        }
      } catch (err) {
        console.error('Error fetching categories or plan types:', err);
      }
    };

    fetchData();
  }, [dispatch, categories.length, planTypes.length]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData((prev) => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const updatedFeatures = formData.features.filter((_, i) => i !== index);
      setFormData((prev) => ({
        ...prev,
        features: updatedFeatures,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({
        ...prev,
        image: e.target.files![0],
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('subtitle', formData.subtitle);
      submitData.append('price', formData.price);
      submitData.append('planType', formData.planType);
      submitData.append('category', formData.category);
      submitData.append('features', JSON.stringify(formData.features.filter((f) => f.trim() !== '')));
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      await dispatch(createService(submitData)).unwrap();
      toast.success('Service created successfully!');
      navigate('/services');
      
    } catch (error: any) {
      console.error('Error saving service:', error);
      toast.error(error?.message || 'Failed to save service');
    }
  };

  const handleCancel = () => {
    navigate('/services');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleCancel}
                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Services</span>
              </button>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Service</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Create a new service offering</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Service Name & Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Type className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-400" />
                  Service Name *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 pl-4 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="Enter service name"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <Tag className="w-4 h-4 mr-2 text-purple-600 dark:text-purple-400" />
                  Category *
                </label>
                <div className="relative">
                  <select
                     required
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:focus:ring-purple-400 dark:focus:border-purple-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
                  > 
                    <option value="">Select category</option> 
                     { categories.length > 0 && categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}  
                      </option>
                    ))}
                  </select>
                  <Tag className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Subtitle & Price Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <FileText className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => handleInputChange('subtitle', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 dark:focus:ring-green-400 dark:focus:border-green-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                  placeholder="Brief description or tagline"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                  <IndianRupee className="w-4 h-4 mr-2 text-emerald-600 dark:text-emerald-400" />
                  Price *
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 dark:focus:ring-emerald-400 dark:focus:border-emerald-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 shadow-sm hover:shadow-md"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
            </div>

            {/* Plan Type */}
            <div className="space-y-2">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Sparkles className="w-4 h-4 mr-2 text-indigo-600 dark:text-indigo-400" />
                Plan Type *
              </label>
              <div className="relative">
                <select
                  required
                  value={formData.planType}
                  onChange={(e) => handleInputChange('planType', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-indigo-400 dark:focus:border-indigo-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 transition-all duration-200 shadow-sm hover:shadow-md appearance-none"
                >
                  <option value="">Select plan type</option>
                  {planTypes.map((pt) => (
                    <option key={pt._id} value={pt._id}>
                      {pt.planType}
                    </option>
                  ))}
                </select>
                <Sparkles className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Service Image */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <ImageIcon className="w-4 h-4 mr-2 text-pink-600 dark:text-pink-400" />
                Service Image
              </label>
              
              {/* New image preview */}
              {formData.image && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <Upload className="w-4 h-4 mr-2 text-green-600 dark:text-green-400" />
                    Image Preview
                  </p>
                  <img 
                    src={URL.createObjectURL(formData.image)} 
                    alt="Service preview" 
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
                  id="image-upload"
                />
                <label 
                  htmlFor="image-upload" 
                  className="flex items-center justify-center w-full py-4 px-6 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-pink-400 dark:hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/20 transition-all duration-200 cursor-pointer bg-white dark:bg-gray-700"
                >
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-2" />
                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {formData.image ? 'Change Image' : 'Upload Image'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      Click to browse or drag and drop
                    </p>
                  </div>
                </label>
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-200 dark:border-blue-800">
                <span className="font-medium">💡 Tip:</span> Recommended: 800x600px, max 5MB, JPG/PNG format
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <label className="flex items-center text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                <Sparkles className="w-4 h-4 mr-2 text-amber-600 dark:text-amber-400" />
                Service Features
              </label>
              
              {/* Features Preview */}
              {formData.features.some(f => f.trim() !== '') && (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Preview:</p>
                  <div className="space-y-2">
                    {formData.features.filter(f => f.trim() !== '').map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600 shadow-sm space-y-3">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3 group">
                    <div className="flex-shrink-0 w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                        {index + 1}
                      </span>
                    </div>
                    <input
                      type="text"
                      value={feature}
                      onChange={(e) => handleFeatureChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:focus:ring-amber-400 dark:focus:border-amber-400 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200"
                    />
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all duration-200 opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button
                  type="button"
                  onClick={addFeature}
                  className="w-full flex items-center justify-center py-3 px-4 border-2 border-dashed border-amber-300 dark:border-amber-600 rounded-xl text-amber-600 dark:text-amber-400 hover:border-amber-400 dark:hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all duration-200 group"
                >
                  <Plus className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" /> 
                  Add Another Feature
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isLoading}
                className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 font-medium flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Cancel</span>
              </button>
              
              <button
                type="submit"
                disabled={isLoading}
                className="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-xl transition-all duration-200 font-semibold flex items-center space-x-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Service</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddService;
