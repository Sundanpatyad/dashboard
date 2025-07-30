import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './screens/Dashboard';
import Services from './screens/Services';
import Engineers from './screens/Engineers';
import Bookings from './screens/Bookings';
import Customers from './screens/Customers';
import Payments from './screens/Payments';

function App() {
  const [activeScreen, setActiveScreen] = useState('dashboard');

  const renderScreen = () => {
    switch (activeScreen) {
      case 'dashboard':
        return <Dashboard />;
      case 'services':
        return <Services />;
      case 'engineers':
        return <Engineers />;
      case 'bookings':
        return <Bookings />;
      case 'customers':
        return <Customers />;
      case 'payments':
        return <Payments />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100`}>
    <Sidebar activeScreen={activeScreen} setActiveScreen={setActiveScreen} />
    <main className="flex-1 ml-64">
      <div className="p-8">
        {renderScreen()}
      </div>
    </main>
  </div>
  );
}

export default App;