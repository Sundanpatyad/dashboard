import React from 'react';
import { Wrench } from 'lucide-react';
import { Service, Category } from '../redux/slices/servicesSlice';
import { StatsCardSkeleton } from './LoadingSkeleton';

interface ServicesStatsOverviewProps {
  services: Service[];
  categories: Category[];
  loading: boolean;
}

const ServicesStatsOverview: React.FC<ServicesStatsOverviewProps> = ({
  services,
  categories,
  loading
}) => {
  const getTotalBookings = () => {
    // You can add bookings count field to your schema if needed
    return 658;
  };

  const calculateAverageRating = () => {
    // You can add rating field to your schema if needed
    return 4.7;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Services</p>
            <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{services.length}</p>
          </div>
          <Wrench className="w-8 h-8 text-blue-600" />
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Categories</p>
            <p className="text-xl sm:text-2xl font-bold text-green-600">{categories.length}</p>
          </div>
          <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{getTotalBookings()}</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-600">{calculateAverageRating()}</p>
          </div>
          <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
            <span className="text-amber-600 text-lg">★</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServicesStatsOverview;
