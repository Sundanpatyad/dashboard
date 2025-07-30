import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Upload } from 'lucide-react';

interface ServiceFormProps {
  service?: any;
  onClose: () => void;
  onSave: (serviceData: any) => void;
}

const ServiceForm = ({ service, onClose, onSave }: ServiceFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    basePrice: '',
    estimatedTime: '',
    status: 'active',
    features: [''],
    image: ''
  });

  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        category: service.category || '',
        description: service.description || '',
        basePrice: service.basePrice || '',
        estimatedTime: service.estimatedTime || '',
        status: service.status || 'active',
        features: service.features || [''],
        image: service.image || ''
      });
    }
  }, [service]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }));
  };

  const removeFeature = (index: number) => {
    if (formData.features.length > 1) {
      const updatedFeatures = formData.features.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        features: updatedFeatures
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredFeatures = formData.features.filter(feature => feature.trim() !== '');
    onSave({
      ...formData,
      features: filteredFeatures
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {service ? 'Edit Service' : 'Add New Service'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Service Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter service name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                <option value="">Select category</option>
                <option value="Electronics">Electronics</option>
                <option value="Home Appliances">Home Appliances</option>
                <option value="Software">Software</option>
                <option value="Hardware">Hardware</option>
                <option value="Installation">Installation</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe the service in detail"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Base Price *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.basePrice}
                onChange={(e) => handleInputChange('basePrice', e.target.value)}
                placeholder="₹0,000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estimated Time *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                placeholder="2-3 hours"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Image URL
            </label>
            <input
              type="url"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={formData.image}
              onChange={(e) => handleInputChange('image', e.target.value)}
              placeholder="https://example.com/image.jpg"
            />
            <p className="text-xs text-gray-500 mt-1">Enter a URL for the service image</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Features
            </label>
            <div className="space-y-3">
              {formData.features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={feature}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    placeholder="Enter feature"
                  />
                  {formData.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Feature
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors"
            >
              {service ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;