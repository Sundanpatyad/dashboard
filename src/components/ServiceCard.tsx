import React from 'react';
import { Edit2, Trash2, Eye, Loader } from 'lucide-react';
import { Service } from '../redux/slices/servicesSlice';

interface ServiceCardProps {
  service: Service;
  actionLoading: { [key: string]: boolean };
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  actionLoading,
  onEdit,
  onDelete
}) => {
  const formatPrice = (price: number) => {
    return price === 0 ? 'Free' : `₹${price.toLocaleString()}`;
  };

  const getStatusBadge = () => {
    return 'bg-green-100 text-green-800 border-green-200';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={service.image || 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=300&h=200&fit=crop'}
          alt={service.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 right-4">
          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge()}`}>
            Active
          </span>
        </div>
      </div>
    
      <div className="p-4 sm:p-6">
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">{service.name}</h3>
            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{service.category?.name}</p>
            {service.subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{service.subtitle}</p>
            )}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => onEdit(service)}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onDelete(service._id)}
              disabled={actionLoading[service._id]}
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
            >
              {actionLoading[service._id] ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">{formatPrice(service.price)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Plan Type</p>
            <p className="text-sm font-medium text-gray-900 dark:text-white">{service.planType?.planType || 'Standard'}</p>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</p>
          <div className="space-y-1">
            {service.features.slice(0, 3).map((feature, index) => {
              // Parse the feature if it's a JSON string, otherwise use as is
              let parsedFeature = feature;
              try {
                if (typeof feature === 'string' && feature.startsWith('[') && feature.endsWith(']')) {
                  const parsed = JSON.parse(feature);
                  if (Array.isArray(parsed)) {
                    parsedFeature = parsed[0]; // Take the first item from the array
                  }
                }
              } catch (e) {
                // If parsing fails, use the original feature
                parsedFeature = feature;
              }
              
              return (
                <div key={index} className="flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2 mt-0.5">•</span>
                  <span className="text-sm text-gray-700 dark:text-gray-300">
                    {parsedFeature.length > 50 ? `${parsedFeature.substring(0, 50)}...` : parsedFeature}
                  </span>
                </div>
              );
            })}
            {service.features.length > 3 && (
              <div className="flex items-start">
                <span className="text-gray-400 dark:text-gray-500 mr-2 mt-0.5">•</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  +{service.features.length - 3} more features
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center">
              <span className="text-amber-600 mr-1">★</span>
              4.7
            </span>
            <span>Created: {new Date(service.createdAt).toLocaleDateString()}</span>
          </div>
          <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
            <Eye className="w-4 h-4 mr-1" />
            Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
