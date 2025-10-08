import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Phone, Mail, Clock, Grid3X3, List, Edit2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import {  
  addEngineer, 
  updateEngineer, 
  verifyEngineer,
  setSearchTerm,
  setAvailabilityFilter,
  setStatusFilter,
  clearFilters,
  Engineer,
  EngineerFormData,
  getAllEngineers
} from '../redux/slices/engineerSlice';
import { AppDispatch, RootState } from '../redux/store';
import EngineerForm from '../components/EngineerForm';

type ViewMode = 'grid' | 'list';

const Engineers: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { engineers, availableEngineers, loading, error, filters } = useSelector((state: RootState) => state.engineers);
  console.log("Engineers state:", { engineers, availableEngineers, loading, error, filters });
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingEngineer, setEditingEngineer] = useState<Engineer | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  useEffect(() => {
    dispatch(getAllEngineers());
  }, [dispatch]);

  const handleAddEngineer = (): void => {
    setEditingEngineer(null);
    setShowForm(true);
  };

  const handleEditEngineer = (engineer: Engineer): void => {
    setEditingEngineer(engineer);
    setShowForm(true);
  };

  const handleCloseForm = (): void => {
    setShowForm(false);
    setEditingEngineer(null);
  };

  const handleSaveEngineer = async (engineerData: EngineerFormData): Promise<void> => {
    try {
      if (editingEngineer) {
        await dispatch(updateEngineer({ 
          id: editingEngineer._id, 
          engineerData 
        })).unwrap();
      } else {
        await dispatch(addEngineer(engineerData)).unwrap();
      }
      handleCloseForm();
      dispatch(getAllEngineers());
    } catch (error) {
      console.error('Error saving engineer:', error);
    }
  };

  // const handleToggleAvailability = async (id: string, currentStatus: boolean): Promise<void> => {
  //   try {
  //     await dispatch(toggleEngineerStatus({
  //       id,
  //       status: 'isAvailable',
  //       value: !currentStatus
  //     })).unwrap();
  //   } catch (error) {
  //     console.error('Error toggling availability:', error);
  //   }
  // };

  const handleVerifyEngineer = async (id: string): Promise<void> => {
    try {
      await dispatch(verifyEngineer(id)).unwrap();
    } catch (error) {
      console.error('Error verifying engineer:', error);
    }
  };

  const getStatusBadge = (engineer: Engineer): string => {
    if (engineer.isBlocked) return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400';
    if (engineer.isSuspended) return 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400';
    if (!engineer.isActive) return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-400';
    if (engineer.isAvailable) return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400';
    return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400';
  };

  const getStatusText = (engineer: Engineer): string => {
    if (engineer.isBlocked) return 'Blocked';
    if (engineer.isSuspended) return 'Suspended';
    if (!engineer.isActive) return 'Inactive';
    if (engineer.isAvailable) return 'Available';
    return 'Busy';
  };

  const getStatusIcon = (engineer: Engineer): string => {
    if (engineer.isBlocked || engineer.isSuspended || !engineer.isActive) return 'bg-red-500';
    if (engineer.isAvailable) return 'bg-green-500';
    return 'bg-amber-500';
  };

  const filteredEngineers = (engineers || []).filter((engineer: Engineer) => {
    const searchLower = filters.searchTerm.toLowerCase();
    const matchesSearch = 
      engineer.name.toLowerCase().includes(searchLower) ||
      engineer.email.toLowerCase().includes(searchLower) ||
      engineer.phone.includes(searchLower) ||
      engineer.skills.some((skill: string) => skill.toLowerCase().includes(searchLower));

    const matchesAvailability = 
      filters.availability === 'all' ||
      (filters.availability === 'available' && engineer.isAvailable) ||
      (filters.availability === 'unavailable' && !engineer.isAvailable);

    const matchesStatus = 
      filters.status === 'all' ||
      (filters.status === 'active' && engineer.isActive && !engineer.isBlocked && !engineer.isSuspended) ||
      (filters.status === 'inactive' && !engineer.isActive) ||
      (filters.status === 'blocked' && engineer.isBlocked) ||
      (filters.status === 'suspended' && engineer.isSuspended);

    return matchesSearch && matchesAvailability && matchesStatus;
  });

  const stats = {
    total: (engineers || []).length,
    available: (engineers || []).filter((e: Engineer) => e.isAvailable && e.isActive && !e.isBlocked && !e.isSuspended).length,
    busy: (engineers || []).filter((e: Engineer) => !e.isAvailable && e.isActive && !e.isBlocked && !e.isSuspended).length,
    verified: (engineers || []).filter((e: Engineer) => e.isVerified).length
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Engineer Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your team of service engineers and their assignments.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-start">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-red-800 dark:text-red-300 font-medium">Error</p>
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engineers</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Available</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.available}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Busy</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{stats.busy}</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-amber-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Verified</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{stats.verified}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-purple-600" />
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
                placeholder="Search engineers by name, email, phone, or skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={filters.searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.availability}
              onChange={(e) => dispatch(setAvailabilityFilter(e.target.value as 'all' | 'available' | 'unavailable'))}
            >
              <option value="all">All Availability</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value as 'all' | 'active' | 'inactive' | 'blocked' | 'suspended'))}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="blocked">Blocked</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <div className="flex items-center gap-3">
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
              onClick={handleAddEngineer}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">Add Engineer</span>
              <span className="sm:hidden">Add</span>
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 dark:border-gray-700"></div>
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-medium text-gray-900 dark:text-white">Loading Engineers</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Please wait while we fetch the data...</p>
            </div>
          </div>
        </div>
      ) : !engineers || engineers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Engineers Yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                Get started by adding your first engineer to the system. They will appear here once added.
              </p>
              <button
                onClick={handleAddEngineer}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Your First Engineer
              </button>
            </div>
          </div>
        </div>
      ) : filteredEngineers.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <Search className="w-10 h-10 text-gray-400 dark:text-gray-500" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Results Found</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
                We couldn't find any engineers matching your search criteria. Try adjusting your filters or search terms.
              </p>
              <button
                onClick={() => dispatch(clearFilters())}
                className="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors font-medium"
              >
                <XCircle className="w-5 h-5 mr-2" />
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredEngineers.map((engineer: Engineer) => (
            <div key={engineer._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                      {engineer.name.charAt(0).toUpperCase()}
                    </div>
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusIcon(engineer)}`}></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{engineer.name}</h3>
                      {engineer.isVerified && (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{engineer.assignedOrders.length} active orders</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(engineer)}`}>
                  {getStatusText(engineer)}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Mail className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {engineer.email}
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <Phone className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {engineer.phone}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Skills</p>
                <div className="flex flex-wrap gap-1">
                  {engineer.skills.map((skill: string, index: number) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-md">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Joined {new Date(engineer.createdAt).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  {!engineer.isVerified && (
                    <button
                      onClick={() => handleVerifyEngineer(engineer._id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 text-sm font-medium"
                    >
                      Verify
                    </button>
                  )}
                  <button
                    onClick={() => handleEditEngineer(engineer)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Edit
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Contact</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Skills</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Orders</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEngineers.map((engineer: Engineer) => (
                  <tr key={engineer._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {engineer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusIcon(engineer)}`}></div>
                        </div>
                        <div>
                          <div className="flex items-center gap-1">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{engineer.name}</div>
                            {engineer.isVerified && (
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            Joined {new Date(engineer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{engineer.phone}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{engineer.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {engineer.skills.slice(0, 2).map((skill: string, index: number) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-md">
                            {skill}
                          </span>
                        ))}
                        {engineer.skills.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                            +{engineer.skills.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{engineer.assignedOrders.length} active</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(engineer)}`}>
                        {getStatusText(engineer)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        {!engineer.isVerified && (
                          <button
                            onClick={() => handleVerifyEngineer(engineer._id)}
                            className="text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300 transition-colors"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => handleEditEngineer(engineer)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
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

      {/* Engineer Form Modal */}
      {showForm && (
        <EngineerForm
          engineer={editingEngineer}
          onClose={handleCloseForm}
          onSave={handleSaveEngineer}
        />
      )}
    </div>
  );
};

export default Engineers;