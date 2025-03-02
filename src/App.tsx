import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import VirtualPBX from './pages/VirtualPBX';
import Integrations from './pages/Integrations';
import UserManagement from './pages/UserManagement';
import Statistics from './pages/Statistics';
import Campaigns from './pages/Campaigns';
import WhatsApp from './pages/WhatsApp';
import Televenta from './pages/Televenta';
import Subscriptions from './pages/Subscriptions';
import Payments from './pages/Payments';
import { AuthProvider } from './components/AuthProvider';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="clients" element={<Clients />} />
          <Route path="virtual-pbx" element={<VirtualPBX />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="statistics" element={<Statistics />} />
          <Route path="campaigns" element={<Campaigns />} />
          <Route path="whatsapp" element={<WhatsApp />} />
          <Route path="televenta" element={<Televenta />} />
          <Route path="subscriptions" element={<Subscriptions />} />
          <Route path="payments" element={<Payments />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
