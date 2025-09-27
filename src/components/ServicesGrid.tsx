import React from 'react';
import { Service } from '../redux/slices/servicesSlice';
import ServiceCard from './ServiceCard';
import { ServiceCardSkeleton } from './LoadingSkeleton';

interface ServicesGridProps {
  services: Service[];
  actionLoading: { [key: string]: boolean };
  loading: boolean;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
}

const ServicesGrid: React.FC<ServicesGridProps> = ({
  services,
  actionLoading,
  loading,
  onEdit,
  onDelete
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {[...Array(6)].map((_, index) => (
          <ServiceCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
      {services.map((service) => (
        <ServiceCard
          key={service._id}
          service={service}
          actionLoading={actionLoading}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default ServicesGrid;
