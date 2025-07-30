import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  Clock,
  CheckCircle,
  AlertTriangle,
  MapPin
} from 'lucide-react';
import StatsCard from '../components/StatsCard';

const Dashboard = () => {
  const stats = [
    {
      title: 'Total Revenue',
      value: '₹2,47,389',
      change: '+12.5%',
      icon: DollarSign,
      color: 'green' as const
    },
    {
      title: 'Active Engineers',
      value: '34',
      change: '+5',
      icon: Users,
      color: 'blue' as const
    },
    {
      title: 'Today\'s Bookings',
      value: '28',
      change: '+8',
      icon: Calendar,
      color: 'purple' as const
    },
    {
      title: 'Completed Services',
      value: '156',
      change: '+23',
      icon: CheckCircle,
      color: 'green' as const
    }
  ];

  const recentBookings = [
    {
      id: 'BK-001',
      customer: 'Rajesh Kumar',
      service: 'Laptop Repair',
      engineer: 'Amit Sharma',
      location: 'Sector 15, Noida',
      status: 'in-progress',
      time: '2 hours ago',
      amount: '₹1,500'
    },
    {
      id: 'BK-002',
      customer: 'Priya Singh',
      service: 'AC Installation',
      engineer: 'Vikash Yadav',
      location: 'Lajpat Nagar, Delhi',
      status: 'assigned',
      time: '1 hour ago',
      amount: '₹3,500'
    },
    {
      id: 'BK-003',
      customer: 'Suresh Gupta',
      service: 'Washing Machine Repair',
      engineer: 'Rohit Verma',
      location: 'Gurgaon Sector 21',
      status: 'completed',
      time: '30 minutes ago',
      amount: '₹800'
    },
    {
      id: 'BK-004',
      customer: 'Anita Devi',
      service: 'Mobile Screen Repair',
      engineer: 'Pending Assignment',
      location: 'Karol Bagh, Delhi',
      status: 'pending',
      time: '15 minutes ago',
      amount: '₹1,200'
    }
  ];

  const getStatusBadge = (status: string) => {
    const config = {
      'completed': 'bg-green-100 text-green-800 border-green-200',
      'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
      'assigned': 'bg-purple-100 text-purple-800 border-purple-200',
      'pending': 'bg-amber-100 text-amber-800 border-amber-200'
    };
    return config[status as keyof typeof config] || config.pending;
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Welcome back! Here's what's happening with your repair service platform today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        {/* Service Categories Performance */}
        <div className="xl:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Service Categories Performance</h3>
          <div className="space-y-4">
            {[
              { category: 'Electronics Repair', bookings: 45, revenue: '₹67,500', growth: '+15%', color: 'bg-blue-500' },
              { category: 'Home Appliances', bookings: 32, revenue: '₹89,600', growth: '+22%', color: 'bg-green-500' },
              { category: 'AC Services', bookings: 28, revenue: '₹1,12,000', growth: '+8%', color: 'bg-purple-500' },
              { category: 'Mobile Repair', bookings: 51, revenue: '₹38,250', growth: '+18%', color: 'bg-amber-500' }
            ].map((item, index) => (
              <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg gap-3 sm:gap-0">
                <div className="flex items-center space-x-4">
                  <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{item.category}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.bookings} bookings this month</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 dark:text-white">{item.revenue}</p>
                  <p className="text-sm text-green-600">{item.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Stats</h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Avg Response Time</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Engineer assignment</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600">12 min</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Success Rate</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Completed services</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600">94.2%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Coverage Areas</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Active locations</p>
                </div>
              </div>
              <span className="text-lg font-bold text-purple-600">15</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
               <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                 <p className="text-sm font-medium text-gray-900 dark:text-white">Pending Issues</p>
                 <p className="text-xs text-gray-600 dark:text-gray-400">Require attention</p>
                </div>
              </div>
              <span className="text-lg font-bold text-amber-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
              View All →
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Booking ID</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Customer</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Service</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Engineer</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Location</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {recentBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                    {booking.id}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{booking.customer}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{booking.time}</p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.service}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {booking.engineer}
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1 text-gray-400 dark:text-gray-500" />
                      {booking.location}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusBadge(booking.status)}`}>
                      {booking.status.replace('-', ' ')}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                    {booking.amount}
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

export default Dashboard;