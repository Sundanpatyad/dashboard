import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAppSelector } from './redux/hooks';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Login from './screens/Login';
import Dashboard from './screens/Dashboard';
import Services from './screens/Services';
import AddService from './screens/AddService';
import EditService from './screens/EditService';
import Categories from './screens/Categories';
import AddCategory from './screens/AddCategory';
import Engineers from './screens/Engineers';
import Bookings from './screens/Bookings';
import Customers from './screens/Customers';
import Payments from './screens/Payments';

function App() {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  return (
    <Router>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--toast-bg, #363636)',
            color: 'var(--toast-color, #fff)',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: '500',
          },
        }}
      />
      <Routes>
        {/* Public route - Login */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />
          } 
        />
        
        {/* Protected routes */}
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                
                {/* Full-screen routes (no sidebar/padding) */}
                <Route path="/services/add" element={<AddService />} />
                <Route path="/services/edit/:id" element={<EditService />} />
                <Route path="/categories/add" element={<AddCategory />} />
                
                {/* Standard layout routes (with sidebar) */}
                <Route path="/*" element={
                  <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
                    <Sidebar />
                    <main className="flex-1 ml-64">
                      <div className="p-8">
                        <Routes>
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/services" element={<Services />} />
                          <Route path="/categories" element={<Categories />} />
                          <Route path="/engineers" element={<Engineers />} />
                          <Route path="/bookings" element={<Bookings />} />
                          <Route path="/customers" element={<Customers />} />
                          <Route path="/payments" element={<Payments />} />
                        </Routes>
                      </div>
                    </main>
                  </div>
                } />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;