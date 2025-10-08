import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search, Eye, MapPin, Clock, User, Calendar, Phone, Mail, UserPlus, CheckCircle } from 'lucide-react';
import { 
  getAllBookings, 
  updateBookingStatus,
  assignEngineerToBooking,
  unassignEngineerFromBooking,
  setStatusFilter,
  setOrderStatusFilter,
  setSearchTerm,
  clearFilters,
  Booking 
} from '../redux/slices/bookingSlice';
import { 
  getAllEngineers, 
  Engineer 
} from '../redux/slices/engineerSlice';
import { RootState, AppDispatch } from '../redux/store';
import { showSuccessToast, showErrorToast } from '../utils/toast';

const Bookings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { bookings, loading, error, filters, actionLoading } = useSelector((state: RootState) => state.bookings);
  const { engineers } = useSelector((state: RootState) => state.engineers);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [showAssignModal, setShowAssignModal] = useState<boolean>(false);
  const [selectedBookingForAssign, setSelectedBookingForAssign] = useState<Booking | null>(null);

  useEffect(() => {
    dispatch(getAllBookings());
    dispatch(getAllEngineers());
  }, [dispatch]);

  const getStatusBadge = (status: string): string => {
    const config: Record<string, string> = {
      'created': 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300',
      'paid': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      'failed': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300',
      'cancelled': 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300'
    };
    return config[status] || config['created'];
  };

  const getOrderStatusBadge = (orderStatus: string): string => {
    const config: Record<string, string> = {
      'Upcoming': 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300',
      'In Progress': 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300',
      'Completed': 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300',
      'Cancelled': 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300'
    };
    return config[orderStatus] || config['Upcoming'];
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customerDetails.name.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      booking.orderId.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      getServicePlanName(booking).toLowerCase().includes(filters.searchTerm.toLowerCase());
    
    const matchesStatus = filters.status === 'all' || booking.status === filters.status;
    const matchesOrderStatus = filters.orderStatus === 'all' || booking.orderStatus === filters.orderStatus;
    
    return matchesSearch && matchesStatus && matchesOrderStatus;
  });

  const statusCounts = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.orderStatus === 'Upcoming').length,
    completed: bookings.filter(b => b.orderStatus === 'Completed').length,
    cancelled: bookings.filter(b => b.orderStatus === 'Cancelled').length,
  };

  const totalRevenue = bookings
    .filter(b => b.status === 'paid')
    .reduce((sum, b) => sum + b.amount, 0);

  const handleStatusChange = async (bookingId: string, newStatus: string): Promise<void> => {
    try {
      await dispatch(updateBookingStatus({ bookingId, status: newStatus })).unwrap();
      showSuccessToast(`Booking status updated to ${newStatus} successfully!`);
    } catch (err) {
      showErrorToast(`Failed to update status: ${err}`);
    }
  };

  const handleAssignEngineer = (booking: Booking): void => {
    setSelectedBookingForAssign(booking);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = (): void => {
    setShowAssignModal(false);
    setSelectedBookingForAssign(null);
  };

  const handleAssignEngineerToBooking = async (engineerId: string): Promise<void> => {
    if (!selectedBookingForAssign) return;
    
    try {
      await dispatch(assignEngineerToBooking({ 
        orderId: selectedBookingForAssign._id, 
        engineerId 
      })).unwrap();
      showSuccessToast('Engineer assigned to booking successfully!');
      handleCloseAssignModal();
    } catch (err) {
      showErrorToast(`Failed to assign engineer: ${err}`);
    }
  };

  const handleUnassignEngineer = async (booking: Booking): Promise<void> => {
    try {
      await dispatch(unassignEngineerFromBooking(booking._id)).unwrap();
      showSuccessToast('Engineer unassigned from booking successfully!');
    } catch (err) {
      showErrorToast(`Failed to unassign engineer: ${err}`);
    }
  };

  const getAssignedEngineer = (booking: Booking): Engineer | null => {
    if (!booking.assignedEngineer) return null;
    return engineers.find(eng => eng._id === booking.assignedEngineer) || null;
  };

  const getServicePlanName = (booking: Booking): string => {
    if (typeof booking.servicePlan === 'string') {
      return booking.notes.servicePlanName || 'Service Plan';
    }
    return booking.servicePlan.name;
  };

  const getServicePlanCategory = (booking: Booking): string => {
    if (typeof booking.servicePlan === 'string') {
      return 'Category'; // Fallback when servicePlan is not populated
    }
    return booking.servicePlan.category.name;
  };

  const getServicePlanImage = (booking: Booking): string | null => {
    if (typeof booking.servicePlan === 'string') {
      return null; // No image when servicePlan is not populated
    }
    return booking.servicePlan.image || null;
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && bookings.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Track and manage all service bookings and assignments.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{statusCounts.total}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Upcoming</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">{statusCounts.upcoming}</p>
            </div>
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
          </div>
        </div>
       
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completed</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600">{statusCounts.completed}</p>
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
              <p className="text-xl sm:text-2xl font-bold text-blue-600">₹{totalRevenue.toLocaleString('en-IN')}</p>
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
                value={filters.searchTerm}
                onChange={(e) => dispatch(setSearchTerm(e.target.value))}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.status}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
            >
              <option value="all">All Payment Status</option>
              <option value="created">Created</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              value={filters.orderStatus}
              onChange={(e) => dispatch(setOrderStatusFilter(e.target.value))}
            >
              <option value="all">All Order Status</option>
              <option value="Upcoming">Upcoming</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={() => dispatch(clearFilters())}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Customer</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Booking Details</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Engineer</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Payment</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Order Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                    No bookings found
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.orderId}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(booking.createdAt)}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(booking.createdAt)}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {booking.customerDetails.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Phone className="w-3 h-3 mr-1" />
                          {booking.customerDetails.phone}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center mt-1">
                          <Mail className="w-3 h-3 mr-1" />
                          {booking.customerDetails.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{getServicePlanName(booking)}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{getServicePlanCategory(booking)}</p>
                        {getServicePlanImage(booking) && (
                          <img src={getServicePlanImage(booking)!} alt={getServicePlanName(booking)} className="w-8 h-8 rounded mt-1 object-cover" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {booking.bookingDetails ? (
                        <div className="text-xs">
                          <p className="flex items-center text-gray-900 dark:text-white">
                            <Calendar className="w-3 h-3 mr-1" />
                            {booking.bookingDetails.date}
                          </p>
                          <p className="flex items-center text-gray-600 dark:text-gray-400 mt-1">
                            <Clock className="w-3 h-3 mr-1" />
                            {booking.bookingDetails.time}
                          </p>
                          <p className="flex items-start text-gray-500 dark:text-gray-400 mt-1">
                            <MapPin className="w-3 h-3 mr-1 mt-0.5 flex-shrink-0" />
                            <span className="line-clamp-2">{booking.bookingDetails.address}</span>
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 dark:text-gray-500">Not scheduled</span>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4">
                      {getAssignedEngineer(booking) ? (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">
                              {getAssignedEngineer(booking)?.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {getAssignedEngineer(booking)?.name}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {getAssignedEngineer(booking)?.phone}
                              </p>
                              {getAssignedEngineer(booking)?.isVerified && (
                                <div className="flex items-center mt-1">
                                  <CheckCircle className="w-3 h-3 text-green-600 mr-1" />
                                  <span className="text-xs text-green-600 dark:text-green-400">Verified</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {getAssignedEngineer(booking)?.skills?.slice(0, 2).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {(getAssignedEngineer(booking)?.skills?.length || 0) > 2 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                +{(getAssignedEngineer(booking)?.skills?.length || 0) - 2}
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => handleUnassignEngineer(booking)}
                            disabled={actionLoading[`unassign-${booking._id}`]}
                            className="w-full flex items-center justify-center px-2 py-1 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                          >
                            {actionLoading[`unassign-${booking._id}`] ? 'Unassigning...' : 'Unassign'}
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleAssignEngineer(booking)}
                          disabled={actionLoading[`assign-${booking._id}`]}
                          className="flex items-center px-3 py-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <UserPlus className="w-3 h-3 mr-1" />
                          {actionLoading[`assign-${booking._id}`] ? 'Assigning...' : 'Assign Engineer'}
                        </button>
                      )}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                      <select
                        value={booking.orderStatus}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className={`text-xs font-semibold rounded-full border px-2 py-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${getOrderStatusBadge(booking.orderStatus)}`}
                      >
                        <option value="Upcoming">Upcoming</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      ₹{booking.amount.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => setSelectedBooking(booking)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 transition-colors"
                        aria-label="View booking details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBooking(null)}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Booking Details</h2>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Order Information</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order ID: {selectedBooking.orderId}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Razorpay Order ID: {selectedBooking.razorpayOrderId}</p>
                  {selectedBooking.razorpayPaymentId && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment ID: {selectedBooking.razorpayPaymentId}</p>
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Name: {selectedBooking.customerDetails.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Email: {selectedBooking.customerDetails.email}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Phone: {selectedBooking.customerDetails.phone}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Service Details</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Service: {getServicePlanName(selectedBooking)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Category: {getServicePlanCategory(selectedBooking)}</p>
                  {typeof selectedBooking.servicePlan === 'object' && (
                    <p className="text-sm text-gray-600 dark:text-gray-400">Base Amount: ₹{selectedBooking.servicePlan.price}</p>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">Total Amount: ₹{selectedBooking.amount}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Payment Status: 
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(selectedBooking.status)}`}>
                      {selectedBooking.status}
                    </span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Order Status: 
                    <span className={`ml-2 inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getOrderStatusBadge(selectedBooking.orderStatus)}`}>
                      {selectedBooking.orderStatus}
                    </span>
                  </p>
                </div>

                {selectedBooking.bookingDetails && (
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Appointment Details</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Date: {selectedBooking.bookingDetails.date}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Time: {selectedBooking.bookingDetails.time}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Address: {selectedBooking.bookingDetails.address}</p>
                    
                    {selectedBooking.bookingDetails.services && selectedBooking.bookingDetails.services.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Services:</p>
                        {selectedBooking.bookingDetails.services.map((service, idx) => (
                          <p key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                            • {service.name} - ₹{service.price} x {service.quantity}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Timestamps</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Created: {formatDate(selectedBooking.createdAt)} at {formatTime(selectedBooking.createdAt)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Updated: {formatDate(selectedBooking.updatedAt)} at {formatTime(selectedBooking.updatedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engineer Assignment Modal */}
      {showAssignModal && selectedBookingForAssign && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseAssignModal}>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Assign Engineer</h2>
                <button
                  onClick={handleCloseAssignModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Booking Details</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Order ID: {selectedBookingForAssign.orderId}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Customer: {selectedBookingForAssign.customerDetails.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Service: {getServicePlanName(selectedBookingForAssign)}</p>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Available Engineers</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {engineers.filter(eng => eng.isAvailable && eng.isActive && !eng.isBlocked && !eng.isSuspended).map((engineer) => (
                    <div 
                      key={engineer._id} 
                      className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                      onClick={() => handleAssignEngineerToBooking(engineer._id)}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          {engineer.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{engineer.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{engineer.phone}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {engineer.skills.slice(0, 2).map((skill, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs rounded">
                                {skill}
                              </span>
                            ))}
                            {engineer.skills.length > 2 && (
                              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                                +{engineer.skills.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {engineer.isVerified && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {engineer.assignedOrders.length} orders
                        </span>
                      </div>
                    </div>
                  ))}
                  {engineers.filter(eng => eng.isAvailable && eng.isActive && !eng.isBlocked && !eng.isSuspended).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No available engineers found</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;