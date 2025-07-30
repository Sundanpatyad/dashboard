import React, { useState } from 'react';
import { Plus, Search, MapPin, Phone, Mail, Star, Clock, Grid3X3, List, Edit2, Eye } from 'lucide-react';
import EngineerForm from '../components/EngineerForm';

const Engineers = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingEngineer, setEditingEngineer] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const engineers = [
    {
      id: 1,
      name: 'Amit Sharma',
      email: 'amit.sharma@repairhub.com',
      phone: '+91 9876543210',
      specialization: ['Electronics', 'Laptop Repair', 'Mobile Repair'],
      location: 'Sector 15, Noida',
      status: 'available',
      rating: 4.8,
      completedJobs: 145,
      activeJobs: 2,
      joinDate: '2023-01-15',
      avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150&h=150&fit=crop&crop=face',
      experience: '5 years',
      certifications: ['Electronics Repair', 'Mobile Technician']
    },
    {
      id: 2,
      name: 'Vikash Yadav',
      email: 'vikash.yadav@repairhub.com',
      phone: '+91 9876543211',
      specialization: ['Home Appliances', 'AC Repair', 'Refrigerator'],
      location: 'Lajpat Nagar, Delhi',
      status: 'busy',
      rating: 4.9,
      completedJobs: 89,
      activeJobs: 4,
      joinDate: '2023-03-20',
      avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?w=150&h=150&fit=crop&crop=face',
      experience: '7 years',
      certifications: ['HVAC Certified', 'Appliance Repair']
    },
    {
      id: 3,
      name: 'Rohit Verma',
      email: 'rohit.verma@repairhub.com',
      phone: '+91 9876543212',
      specialization: ['Home Appliances', 'Washing Machine', 'Microwave'],
      location: 'Gurgaon Sector 21',
      status: 'available',
      rating: 4.7,
      completedJobs: 67,
      activeJobs: 1,
      joinDate: '2023-02-10',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150&h=150&fit=crop&crop=face',
      experience: '4 years',
      certifications: ['Home Appliance Repair']
    },
    {
      id: 4,
      name: 'Pradeep Kumar',
      email: 'pradeep.kumar@repairhub.com',
      phone: '+91 9876543213',
      specialization: ['Electronics', 'TV Repair', 'Audio Systems'],
      location: 'Karol Bagh, Delhi',
      status: 'offline',
      rating: 4.6,
      completedJobs: 123,
      activeJobs: 0,
      joinDate: '2022-11-05',
      avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?w=150&h=150&fit=crop&crop=face',
      experience: '6 years',
      certifications: ['Electronics Repair', 'Audio Systems']
    }
  ];

  const handleAddEngineer = () => {
    setEditingEngineer(null);
    setShowForm(true);
  };

  const handleEditEngineer = (engineer: any) => {
    setEditingEngineer(engineer);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEngineer(null);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      available: 'bg-green-100 text-green-800 border-green-200',
      busy: 'bg-amber-100 text-amber-800 border-amber-200',
      offline: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return config[status as keyof typeof config] || config.offline;
  };

  const getStatusIcon = (status: string) => {
    const config = {
      available: 'bg-green-500',
      busy: 'bg-amber-500',
      offline: 'bg-gray-400'
    };
    return config[status as keyof typeof config] || config.offline;
  };

  const filteredEngineers = engineers.filter(engineer => {
    const matchesSearch = engineer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         engineer.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || engineer.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Engineer Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your team of service engineers and their assignments.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Engineers</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{engineers.length}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-green-600">{engineers.filter(e => e.status === 'available').length}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{engineers.filter(e => e.status === 'busy').length}</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-amber-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Rating</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">4.7</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-purple-600" />
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
                placeholder="Search engineers by name, location, or specialization..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
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

      {/* Engineers Grid/List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {filteredEngineers.map((engineer) => (
            <div key={engineer.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img
                      src={engineer.avatar}
                      alt={engineer.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white dark:border-gray-800 ${getStatusIcon(engineer.status)}`}></div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{engineer.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{engineer.experience} experience</p>
                    <div className="flex items-center mt-1">
                      <Star className="w-4 h-4 text-amber-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{engineer.rating}</span>
                    </div>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(engineer.status)}`}>
                  {engineer.status}
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
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                  {engineer.location}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-2">Specializations</p>
                <div className="flex flex-wrap gap-1">
                  {engineer.specialization.map((spec, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-md">
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <p className="text-xl font-bold text-green-600">{engineer.completedJobs}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Completed</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold text-blue-600">{engineer.activeJobs}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active Jobs</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <Clock className="w-4 h-4 inline mr-1" />
                  Joined {new Date(engineer.joinDate).toLocaleDateString()}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditEngineer(engineer)}
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 text-sm font-medium">
                    View
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
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Location</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Specialization</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Jobs</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredEngineers.map((engineer) => (
                  <tr key={engineer.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex items-center">
                        <div className="relative mr-4">
                          <img className="h-12 w-12 rounded-full object-cover" src={engineer.avatar} alt={engineer.name} />
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusIcon(engineer.status)}`}></div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{engineer.name}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{engineer.experience} experience</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{engineer.phone}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{engineer.email}</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                      {engineer.location}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {engineer.specialization.slice(0, 2).map((spec, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded-md">
                            {spec}
                          </span>
                        ))}
                        {engineer.specialization.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-md">
                            +{engineer.specialization.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">{engineer.completedJobs} completed</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{engineer.activeJobs} active</div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-amber-500 mr-1" />
                        <span className="text-sm text-gray-900 dark:text-white">{engineer.rating}</span>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(engineer.status)}`}>
                        {engineer.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditEngineer(engineer)}
                          className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
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

      {/* Engineer Form Modal */}
      {showForm && (
        <EngineerForm
          engineer={editingEngineer}
          onClose={handleCloseForm}
          onSave={(engineerData) => {
            console.log('Saving engineer:', engineerData);
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

export default Engineers;