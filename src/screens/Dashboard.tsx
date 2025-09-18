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
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

const StatsCard = ({ title, value, change, icon: Icon, color }) => {
  const colorClasses = {
    green: 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200 dark:border-green-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 border-blue-200 dark:border-blue-800',
    purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 border-purple-200 dark:border-purple-800',
    amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200 dark:border-amber-800'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">{change}</p>
        </div>
        <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
};

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

  // Revenue trend data for line chart
  const revenueData = [
    { month: 'Jan', revenue: 185000, bookings: 145 },
    { month: 'Feb', revenue: 192000, bookings: 158 },
    { month: 'Mar', revenue: 178000, bookings: 142 },
    { month: 'Apr', revenue: 205000, bookings: 168 },
    { month: 'May', revenue: 218000, bookings: 175 },
    { month: 'Jun', revenue: 235000, bookings: 189 },
    { month: 'Jul', revenue: 247389, bookings: 201 }
  ];

  // Service distribution data for pie chart
  const serviceData = [
    { name: 'Electronics Repair', value: 35, color: '#3B82F6' },
    { name: 'Home Appliances', value: 28, color: '#10B981' },
    { name: 'AC Services', value: 22, color: '#8B5CF6' },
    { name: 'Mobile Repair', value: 15, color: '#F59E0B' }
  ];

  // Engineer performance data for bar chart
  const engineerData = [
    { name: 'Amit S.', completed: 24, rating: 4.8 },
    { name: 'Vikash Y.', completed: 21, rating: 4.6 },
    { name: 'Rohit V.', completed: 19, rating: 4.7 },
    { name: 'Suraj K.', completed: 18, rating: 4.5 },
    { name: 'Arjun M.', completed: 16, rating: 4.4 }
  ];

  // Daily bookings trend
  const dailyBookings = [
    { day: 'Mon', bookings: 18, completed: 15 },
    { day: 'Tue', bookings: 22, completed: 19 },
    { day: 'Wed', bookings: 25, completed: 23 },
    { day: 'Thu', bookings: 28, completed: 25 },
    { day: 'Fri', bookings: 32, completed: 28 },
    { day: 'Sat', bookings: 35, completed: 31 },
    { day: 'Sun', bookings: 28, completed: 26 }
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

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue & Bookings Trend</h3>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-green-600 font-medium">+12.5% this month</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis 
                dataKey="month" 
                stroke="#6B7280"
                fontSize={12}
              />
              <YAxis 
                stroke="#6B7280"
                fontSize={12}
                tickFormatter={(value) => `₹${(value/1000).toFixed(0)}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Service Distribution Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Service Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={serviceData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={5}
                dataKey="value"
              >
                {serviceData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value}%`, 'Share']}
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                formatter={(value) => <span className="text-sm text-gray-600 dark:text-gray-400">{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
        {/* Daily Bookings Area Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Weekly Bookings Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={dailyBookings}>
              <defs>
                <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                </linearGradient>
                <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="day" stroke="#6B7280" fontSize={12} />
              <YAxis stroke="#6B7280" fontSize={12} />
              <Tooltip content={<CustomTooltip />} />
              <Area 
                type="monotone" 
                dataKey="bookings" 
                stackId="1"
                stroke="#8B5CF6" 
                fillOpacity={1} 
                fill="url(#colorBookings)"
                name="New Bookings"
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="2"
                stroke="#10B981" 
                fillOpacity={1} 
                fill="url(#colorCompleted)"
                name="Completed"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Engineers Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Top Engineers Performance</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={engineerData} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis type="number" stroke="#6B7280" fontSize={12} />
              <YAxis 
                dataKey="name" 
                type="category" 
                stroke="#6B7280" 
                fontSize={12}
                width={60}
              />
              <Tooltip 
                content={<CustomTooltip />}
                formatter={(value, name) => [
                  name === 'completed' ? `${value} services` : `${value}/5.0`,
                  name === 'completed' ? 'Completed' : 'Rating'
                ]}
              />
              <Bar 
                dataKey="completed" 
                fill="#3B82F6"
                radius={[0, 4, 4, 0]}
                name="completed"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
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