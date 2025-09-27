import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import {
  fetchServices,
  fetchCategories,
  deleteService,
  setSearchTerm,
  setCategoryFilter,
  setViewMode,
  clearError,
  Service
} from '../redux/slices/servicesSlice';
import ServicesStatsOverview from '../components/ServicesStatsOverview';
import ServicesSearchFilters from '../components/ServicesSearchFilters';
import ServicesGrid from '../components/ServicesGrid';
import ServicesList from '../components/ServicesList';
import ServicesEmptyState from '../components/ServicesEmptyState';
import { ServicesPageSkeleton } from '../components/LoadingSkeleton';
import ConfirmModal from '../components/ConfirmModal';

const Services = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    services,
    categories,
    loading,
    actionLoading,
    error,
    searchTerm,
    categoryFilter,
    viewMode
  } = useAppSelector((state) => state.services);

  // Modal state for delete confirmation only
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchServices({ searchTerm, categoryFilter }));
    dispatch(fetchCategories());
  }, []);

  // Refetch when search or filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      dispatch(fetchServices({ searchTerm, categoryFilter }));
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, categoryFilter, dispatch]);

  // Delete service
  const handleDeleteService = (serviceId: string) => {
    setServiceToDelete(serviceId);
    setShowDeleteModal(true);
  };

  const confirmDeleteService = async () => {
    if (!serviceToDelete) return;
    
    setDeleteLoading(true);
    try {
      await dispatch(deleteService(serviceToDelete)).unwrap();
      toast.success('Service deleted successfully!');
      setShowDeleteModal(false);
      setServiceToDelete(null);
    } catch (error: any) {
      toast.error(error || 'Failed to delete service');
    } finally {
      setDeleteLoading(false);
    }
  };

  const closeDeleteModal = () => {
    if (!deleteLoading) {
      setShowDeleteModal(false);
      setServiceToDelete(null);
    }
  };

  const handleAddCategory = () => {
    navigate('/categories/add');
  };

  const handleAddService = () => {
    navigate('/services/add');
  };

  const handleEditService = (service: Service) => {
    navigate(`/services/edit/${service._id}`);
  };



  // Filter services based on search term and category
  const filteredServices = services.filter(service => {
    const matchesSearch = searchTerm === '' || 
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = categoryFilter === 'all' || 
      service.category?.name === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Show loading skeleton for initial load
  if (loading && services.length === 0) {
    return <ServicesPageSkeleton />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Service Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your repair services, pricing, and availability.</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" />
            <span className="text-red-700 dark:text-red-400">{error}</span>
            <button
              onClick={() => dispatch(clearError())}
              className="ml-auto text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <ServicesStatsOverview
        services={services}
        categories={categories}
        loading={loading && services.length === 0}
      />

            {/* Search and Filters */}
            <ServicesSearchFilters
              searchTerm={searchTerm}
              categoryFilter={categoryFilter}
              viewMode={viewMode}
              categories={categories}
              actionLoading={actionLoading}
              loading={loading && services.length === 0}
              onSearchChange={(value) => dispatch(setSearchTerm(value))}
              onCategoryChange={(value) => dispatch(setCategoryFilter(value))}
              onViewModeChange={(mode) => dispatch(setViewMode(mode))}
              onAddCategory={handleAddCategory}
              onAddService={handleAddService}
            />

      {/* Services Content */}
      {filteredServices.length === 0 && !loading ? (
        <ServicesEmptyState
          hasFilters={searchTerm !== '' || categoryFilter !== 'all'}
          onAddService={handleAddService}
        />
      ) : viewMode === 'grid' ? (
        <ServicesGrid
          services={filteredServices}
          actionLoading={actionLoading}
          loading={loading}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      ) : (
        <ServicesList
          services={filteredServices}
          actionLoading={actionLoading}
          loading={loading}
          onEdit={handleEditService}
          onDelete={handleDeleteService}
        />
      )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
              isOpen={showDeleteModal}
              onClose={closeDeleteModal}
              onConfirm={confirmDeleteService}
              title="Delete Service"
              message="Are you sure you want to delete this service? This action cannot be undone."
              confirmText="Delete"
              cancelText="Cancel"
              type="danger"
              loading={deleteLoading}
            />
    </div>
  );
};

export default Services;