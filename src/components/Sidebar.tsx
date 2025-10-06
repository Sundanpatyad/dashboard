import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import toast from 'react-hot-toast';
import { logoutUser } from '../redux/slices/authSlice';
import ConfirmModal from './ConfirmModal';
import { 
  LayoutDashboard, 
  Wrench, 
  Tag,
  Users, 
  Calendar, 
  UserCheck, 
  CreditCard,
  Settings, 
  Sun, 
  Moon, 
  Menu,
  X,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);
  const [logoutLoading, setLogoutLoading] = React.useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    setLogoutLoading(true);
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed');
    } finally {
      setLogoutLoading(false);
      setShowLogoutModal(false);
    }
  };

  const closeLogoutModal = () => {
    if (!logoutLoading) {
      setShowLogoutModal(false);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'services', label: 'Services', icon: Wrench, path: '/services' },
    { id: 'categories', label: 'Categories', icon: Tag, path: '/categories' },
    { id: 'engineers', label: 'Engineers', icon: Users, path: '/engineers' },
    { id: 'bookings', label: 'Bookings', icon: Calendar, path: '/bookings' },
    { id: 'customers', label: 'Customers', icon: UserCheck, path: '/customers' },
    { id: 'payments', label: 'Payments', icon: CreditCard, path: '/payments' },
  ];

  return (
    <>
      {/* Enhanced Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl transition-all duration-300 hover:scale-105"
      >
        <div className="relative">
          {isMobileOpen ? (
            <X className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-transform duration-300 rotate-90" />
          ) : (
            <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200 transition-transform duration-300" />
          )}
          {/* Animated background */}
          <div className="absolute inset-0 bg-blue-500/10 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      </button>

      {/* Enhanced Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 w-64 h-full bg-white dark:bg-gray-800 shadow-2xl border-r border-gray-200 dark:border-gray-700 z-40 transform transition-all duration-300 ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header with enhanced design */}
        <div className="relative p-6 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  Door2fy
                </h1>
                <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                  Welcome back, {user?.username || 'Admin'} 👋
                </p>
              </div>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-200 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-600"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-amber-500" />
              ) : (
                <Moon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      
        <nav className="mt-8 px-3">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path || (location.pathname === '/' && item.id === 'dashboard');
          
            return (
              <div key={item.id} className="mb-2">
                <button
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileOpen(false);
                  }}
                  className={`group w-full flex items-center px-4 py-3.5 text-left transition-all duration-300 rounded-xl relative overflow-hidden ${
                    isActive
                      ? 'bg-blue-600 dark:bg-blue-500 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white hover:shadow-md hover:scale-[1.01]'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/30 rounded-r-full"></div>
                  )}
                  
                  {/* Hover effect background */}
                  <div className={`absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                    isActive ? 'opacity-0' : ''
                  }`}></div>
                  
                  <div className="relative flex items-center w-full">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-white/20 shadow-sm' 
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      <Icon className={`w-5 h-5 transition-all duration-300 ${
                        isActive 
                          ? 'text-white drop-shadow-sm' 
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200'
                      }`} />
                    </div>
                    <span className={`ml-3 font-semibold transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white'
                    }`}>
                      {item.label}
                    </span>
                    
                    {/* Active indicator dot */}
                    {isActive && (
                      <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-4 right-4 space-y-4">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="group w-full flex items-center px-4 py-3.5 text-left transition-all duration-300 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-700 dark:hover:text-red-300 rounded-xl hover:shadow-lg hover:scale-[1.02] relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center w-full">
              <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/40 transition-all duration-300">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="ml-3 font-semibold">Logout</span>
            </div>
          </button>

          {/* Enhanced Help Section */}
          <div className="relative bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-5 border border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            
            <div className="relative">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">Need Help?</p>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 leading-relaxed">
                Our support team is here to help you with any questions or issues.
              </p>
              <button className="group/btn inline-flex items-center space-x-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-200 hover:scale-105">
                <span>Get Support</span>
                <span className="group-hover/btn:translate-x-1 transition-transform duration-200">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={closeLogoutModal}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout? You will need to login again to access your account."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
        loading={logoutLoading}
      />
    </>
  );
};

export default Sidebar;