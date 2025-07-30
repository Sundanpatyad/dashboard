import React, { useState } from 'react';
import { Search, Download, Eye, DollarSign, CreditCard, Clock, CheckCircle } from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const payments = [
    {
      id: 'PAY-001',
      bookingId: 'BK-001',
      customer: 'Rajesh Kumar',
      service: 'Laptop Repair',
      engineer: 'Amit Sharma',
      amount: '₹1,500',
      status: 'completed',
      paymentMethod: 'UPI',
      transactionId: 'TXN123456789',
      date: '2024-01-15T14:30:00',
      dueDate: '2024-01-15T18:00:00',
      commission: '₹150'
    },
    {
      id: 'PAY-002',
      bookingId: 'BK-002',
      customer: 'Priya Singh',
      service: 'AC Installation',
      engineer: 'Vikash Yadav',
      amount: '₹3,500',
      status: 'pending',
      paymentMethod: 'Cash',
      transactionId: '-',
      date: '2024-01-15T11:00:00',
      dueDate: '2024-01-16T18:00:00',
      commission: '₹350'
    },
    {
      id: 'PAY-003',
      bookingId: 'BK-003',
      customer: 'Suresh Gupta',
      service: 'Washing Machine Repair',
      engineer: 'Rohit Verma',
      amount: '₹800',
      status: 'completed',
      paymentMethod: 'Card',
      transactionId: 'TXN987654321',
      date: '2024-01-15T12:00:00',
      dueDate: '2024-01-15T15:00:00',
      commission: '₹80'
    },
    {
      id: 'PAY-004',
      bookingId: 'BK-004',
      customer: 'Anita Devi',
      service: 'Mobile Screen Repair',
      engineer: 'Pending Assignment',
      amount: '₹1,200',
      status: 'pending',
      paymentMethod: 'UPI',
      transactionId: '-',
      date: '2024-01-15T15:00:00',
      dueDate: '2024-01-16T18:00:00',
      commission: '₹120'
    },
    {
      id: 'PAY-005',
      bookingId: 'BK-005',
      customer: 'Manoj Sharma',
      service: 'TV Repair',
      engineer: 'Pradeep Kumar',
      amount: '₹2,000',
      status: 'failed',
      paymentMethod: 'Card',
      transactionId: 'TXN456789123',
      date: '2024-01-14T16:00:00',
      dueDate: '2024-01-15T18:00:00',
      commission: '₹200'
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-amber-100 text-amber-800 border-amber-200',
      'failed': 'bg-red-100 text-red-800 border-red-200',
      'refunded': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return config[status as keyof typeof config] || config.pending;
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'upi':
        return '📱';
      case 'card':
        return '💳';
      case 'cash':
        return '💵';
      default:
        return '💰';
    }
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseInt(p.amount.replace('₹', '').replace(',', '')), 0);
  const totalCommission = payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseInt(p.commission.replace('₹', '').replace(',', '')), 0);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-2">Track all payments, commissions, and financial transactions.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">₹{payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + parseInt(p.amount.replace('₹', '').replace(',', '')), 0).toLocaleString()}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-amber-600">₹{payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + parseInt(p.amount.replace('₹', '').replace(',', '')), 0).toLocaleString()}</p>
            </div>
            <Clock className="w-8 h-8 text-amber-600" />
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Commission</p>
              <p className="text-2xl font-bold text-blue-600">₹{totalCommission.toLocaleString()}</p>
            </div>
            <CreditCard className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by customer, payment ID, or booking ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-3">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
            <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Download className="w-4 h-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Details</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Engineer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{payment.id}</p>
                      <p className="text-xs text-gray-500">Booking: {payment.bookingId}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(payment.date).toLocaleDateString()} at {new Date(payment.date).toLocaleTimeString()}
                      </p>
                      {payment.transactionId !== '-' && (
                        <p className="text-xs text-gray-400">TXN: {payment.transactionId}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.service}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.engineer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="mr-2">{getPaymentMethodIcon(payment.paymentMethod)}</span>
                      <span className="text-sm text-gray-900">{payment.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(payment.status)}`}>
                      {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                    {payment.commission}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-900 transition-colors">
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

export default Payments;