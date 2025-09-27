import React from 'react';
import { Wrench, Plus } from 'lucide-react';

interface ServicesEmptyStateProps {
  hasFilters: boolean;
  onAddService: () => void;
}

const ServicesEmptyState: React.FC<ServicesEmptyStateProps> = ({
  hasFilters,
  onAddService
}) => {
  return (
    <div className="text-center py-12">
      <Wrench className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No services found</h3>
      <p className="text-gray-500 dark:text-gray-400 mb-4">
        {hasFilters 
          ? 'Try adjusting your search or filters' 
          : 'Get started by adding your first service'}
      </p>
      <button
        onClick={onAddService}
        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Service
      </button>
    </div>
  );
};

export default ServicesEmptyState;
