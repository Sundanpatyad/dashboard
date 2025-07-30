import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, Wrench, Grid3X3, List } from 'lucide-react';
import ServiceForm from '../components/ServiceForm';

const Services = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const services = [
    {
      id: 1,
      name: 'Laptop Repair',
      category: 'Electronics',
      description: 'Complete laptop diagnosis and repair service including hardware and software issues',
      basePrice: '₹1,500',
      estimatedTime: '2-4 hours',
      status: 'active',
      features: ['Hardware Diagnosis', 'Software Troubleshooting', 'Data Recovery', 'Screen Replacement'],
      bookingsCount: 145,
      rating: 4.8,
      image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 2,
      name: 'AC Installation & Repair',
      category: 'Home Appliances',
      description: 'Professional AC installation, maintenance, and repair services',
      basePrice: '₹2,500',
      estimatedTime: '3-6 hours',
      status: 'active',
      features: ['Installation', 'Gas Refilling', 'Cleaning', 'Maintenance'],
      bookingsCount: 89,
      rating: 4.9,
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 3,
      name: 'Mobile Phone Repair',
      category: 'Electronics',
      description: 'Screen replacement, battery change, and other mobile repair services',
      basePrice: '₹800',
      estimatedTime: '1-2 hours',
      status: 'active',
      features: ['Screen Replacement', 'Battery Change', 'Water Damage Repair', 'Software Issues'],
      bookingsCount: 234,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      name: 'Washing Machine Repair',
      category: 'Home Appliances',
      description: 'Complete washing machine repair and maintenance service',
      basePrice: '₹1,200',
      estimatedTime: '2-3 hours',
      status: 'active',
      features: ['Motor Repair', 'Drum Cleaning', 'Pipe Replacement', 'Control Panel Fix'],
      bookingsCount: 67,
      rating: 4.6,
      image: 'https://images.pexels.com/photos/3746957/pexels-photo-3746957.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 5,
      name: 'TV Repair',
      category: 'Electronics',
      description: 'LED, LCD, and Smart TV repair services',
      basePrice: '₹2,000',
      estimatedTime: '2-4 hours',
      status: 'inactive',
      features: ['Screen Repair', 'Sound Issues', 'Smart TV Setup', 'Remote Programming'],
      bookingsCount: 45,
      rating: 4.5,
      image: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?w=300&h=200&fit=crop'
    },
    {
      id: 6,
      name: 'Refrigerator Repair',
      category: 'Home Appliances',
      description: 'Complete refrigerator repair and maintenance service',
      basePrice: '₹1,800',
      estimatedTime: '2-5 hours',
      status: 'active',
      features: ['Cooling Issues', 'Compressor Repair', 'Thermostat Fix', 'Gas Refilling'],
      bookingsCount: 78,
      rating: 4.7,
      image: 'https://images.pexels.com/photos/2343468/pexels-photo-2343468.jpeg?w=300&h=200&fit=crop'
    }
  ];

  const categories = ['all', 'Electronics', 'Home Appliances', 'Software', 'Hardware'];

  const handleAddService = () => {
    setEditingService(null);
    setShowForm(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingService(null);
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800 border-green-200'
      : 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Service Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your repair services, pricing, and availability.</p>
      </div>

      {/* Stats Overview */}
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
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Services</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{services.filter(s => s.status === 'active').length}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{services.reduce((sum, s) => sum + s.bookingsCount, 0)}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-amber-600">4.7</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <span className="text-amber-600 text-lg">★</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          <div className="flex-1 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-blue-600 shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddService}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Service</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {/* Services Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredServices.map((service) => (
            <div key={service.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-1">{service.name}</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{service.category}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditService(service)}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">{service.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Base Price</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">{service.basePrice}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Est. Time</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{service.estimatedTime}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {service.features.slice(0, 3).map((feature, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                        {feature}
                      </span>
                    ))}
                    {service.features.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                        +{service.features.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                    <span>{service.bookingsCount} bookings</span>
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">★</span>
                      {service.rating}
                    </span>
                  </div>
                  <button className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium">
                    <Eye className="w-4 h-4 mr-1" />
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                <tr>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Price</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Bookings</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredServices.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <img className="h-12 w-12 rounded-lg object-cover mr-4" src={service.image} alt={service.name} />
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{service.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{service.estimatedTime}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 font-medium">
                      {service.category}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {service.basePrice}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {service.bookingsCount}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-amber-600 mr-1">★</span>
                        <span className="text-sm text-gray-900 dark:text-white">{service.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(service.status)}`}>
                        {service.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Form Modal */}
      {showForm && (
        <ServiceForm
          service={editingService}
          onClose={handleCloseForm}
          onSave={(serviceData) => {
            console.log('Saving service:', serviceData);
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

export default Services;