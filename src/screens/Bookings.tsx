import React, { useState } from 'react';
import { Search, Filter, Eye, MapPin, Clock, User, Wrench } from 'lucide-react';

const Bookings = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const bookings = [
    {
      id: 'BK-001',
      customer: {
        name: 'Rajesh Kumar',
        phone: '+91 9876543210',
        email: 'rajesh.kumar@email.com'
      },
      service: 'Laptop Repair',
      issue: 'Screen flickering and slow performance',
      location: 'Sector 15, Noida, UP',
      engineer: 'Amit Sharma',
      status: 'in-progress',
      priority: 'high',
      bookingDate: '2024-01-15T10:30:00',
      scheduledDate: '2024-01-15T14:00:00',
      amount: '₹1,500',
      customerLocation: {
        address: 'Sector 15, Noida, UP',
        coordinates: { lat: 28.5355, lng: 77.3910 },
        landmark: 'Near City Center Mall'
      },
      estimatedTime: '2-3 hours',
      progress: 75
    },
    {
      id: 'BK-002',
      customer: {
        name: 'Priya Singh',
        phone: '+91 9876543211',
        email: 'priya.singh@email.com'
      },
      service: 'AC Installation',
      issue: 'New 1.5 ton split AC installation',
      location: 'Lajpat Nagar, Delhi',
      engineer: 'Vikash Yadav',
      status: 'assigned',
      priority: 'medium',
      bookingDate: '2024-01-15T09:15:00',
      scheduledDate: '2024-01-16T11:00:00',
      amount: '₹3,500',
      customerLocation: {
        address: 'Lajpat Nagar, Delhi',
        coordinates: { lat: 28.5665, lng: 77.2431 },
        landmark: 'Near Central Market'
      },
      estimatedTime: '4-5 hours',
      progress: 0
    },
    {
      id: 'BK-003',
      customer: {
        name: 'Suresh Gupta',
        phone: '+91 9876543212',
        email: 'suresh.gupta@email.com'
      },
      service: 'Washing Machine Repair',
      issue: 'Not draining water properly',
      location: 'Gurgaon Sector 21, Haryana',
      engineer: 'Rohit Verma',
      status: 'completed',
      priority: 'low',
      bookingDate: '2024-01-14T16:20:00',
      scheduledDate: '2024-01-15T10:00:00',
      amount: '₹800',
      customerLocation: {
        address: 'Gurgaon Sector 21, Haryana',
        coordinates: { lat: 28.4595, lng: 77.0266 },
        landmark: 'Near DLF Phase 1'
      },
      estimatedTime: '1-2 hours',
      progress: 100
    },
    {
      id: 'BK-004',
      customer: {
        name: 'Anita Devi',
        phone: '+91 9876543213',
        email: 'anita.devi@email.com'
      },
      service: 'Mobile Screen Repair',
      issue: 'Cracked screen replacement for iPhone 12',
      location: 'Karol Bagh, Delhi',
      engineer: 'Pending Assignment',
      status: 'pending',
      priority: 'high',
      bookingDate: '2024-01-15T11:45:00',
      scheduledDate: '2024-01-16T15:00:00',
      amount: '₹1,200',
      customerLocation: {
        address: 'Karol Bagh, Delhi',
        coordinates: { lat: 28.6519, lng: 77.1909 },
        landmark: 'Near Karol Bagh Metro Station'
      },
      estimatedTime: '1 hour',
      progress: 0
    },
    {
      id: 'BK-005',
      customer: {
        name: 'Manoj Sharma',
        phone: '+91 9876543214',
        email: 'manoj.sharma@email.com'
      },
      service: 'TV Repair',
      issue: 'No display, power LED blinking',
      location: 'Dwarka Sector 10, Delhi',
      engineer: 'Pradeep Kumar',
      status: 'cancelled',
      priority: 'medium',
      bookingDate: '2024-01-14T13:30:00',
      scheduledDate: '2024-01-15T16:00:00',
      amount: '₹2,000',
      customerLocation: {
        address: 'Dwarka Sector 10, Delhi',
        coordinates: { lat: 28.5921, lng: 77.0460 },
        landmark: 'Near Dwarka Sector 10 Metro'
      },
      estimatedTime: '2-3 hours',
      progress: 0
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'assigned': 'bg-blue-100 text-blue-800 border-blue-200',
      'in-progress': 'bg-purple-100 text-purple-800 border-purple-200',
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'cancelled': 'bg-red-100 text-red-800 border-red-200'
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getPriorityBadge = (priority: string) => {
    const config = {
      'high': 'bg-red-100 text-red-800 border-red-200',
      'medium': 'bg-amber-100 text-amber-800 border-amber-200',
      'low': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return config[priority as keyof typeof config] || config.medium;
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage all service bookings and assignments.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-xl sm:text-2xl font-bold text-amber-600">{bookings.filter(b => b.status === 'pending').length}</p>
            </div>
            <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">In Progress</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600">{bookings.filter(b => b.status === 'in-progress').length}</p>
            </div>
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
              <Wrench className="w-4 h-4 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{bookings.filter(b => b.status === 'completed').length}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenue</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">₹9,000</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer, booking ID, or service..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="assigned">Assigned</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking Details</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer & Location</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.id}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(booking.bookingDate).toLocaleDateString()} at {new Date(booking.bookingDate).toLocaleTimeString()}
                      </p>
                      <div className="flex items-center mt-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(booking.priority)}`}>
                          {booking.priority}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{booking.customer.phone}</p>
                      <div className="flex items-start mt-1 text-xs text-gray-500 dark:text-gray-400">
                        <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                        <div>
                          <p>{booking.customerLocation.address}</p>
                          <p className="text-gray-400 dark:text-gray-500">{booking.customerLocation.landmark}</p>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.service}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{booking.issue}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Est: {booking.estimatedTime}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
                      <span className="text-sm text-gray-900 dark:text-white">{booking.engineer}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(booking.status)}`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 max-w-[80px]">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${booking.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{booking.progress}%</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {booking.amount}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Bookings;