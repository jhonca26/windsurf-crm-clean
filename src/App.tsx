import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { AuthProvider } from './components/AuthProvider';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Clients from './pages/Clients';
import Consultations from './pages/Consultations';
import NewConsultation from './pages/NewConsultation';
import Campaigns from './pages/Campaigns';
import Televentas from './pages/Televentas';
import Statistics from './pages/Statistics';
import BonosPage from './pages/BonosPage';
import Configuration from './pages/Configuration';
import Integraciones from './pages/Integraciones';
import WhatsApp from './pages/WhatsApp';
import Publicidades from './pages/Publicidades';
import AtenderConsultas from './pages/AtenderConsultas';
import UserManagement from './pages/UserManagement';

// Route guard component
const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles: string[] }) => {
  const { user } = useAuthStore();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            
            {/* Admin-only routes */}
            <Route path="clientes" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Clients />
              </ProtectedRoute>
            } />
            
            {/* Shared routes */}
            <Route path="consultas" element={<Consultations />} />
            <Route path="consultas-nuevas" element={<NewConsultation />} />
            <Route path="bonos" element={<BonosPage />} />
            <Route path="estadisticas" element={<Statistics />} />
            <Route path="whatsapp" element={<WhatsApp />} />
            
            {/* Agent-only routes */}
            <Route path="atender-consultas" element={
              <ProtectedRoute allowedRoles={['agent']}>
                <AtenderConsultas />
              </ProtectedRoute>
            } />
            
            {/* Admin-only routes */}
            <Route path="campanas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Campaigns />
              </ProtectedRoute>
            } />
            <Route path="televentas" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Televentas />
              </ProtectedRoute>
            } />
            <Route path="configuracion" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Configuration />
              </ProtectedRoute>
            } />
            <Route path="integraciones" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Integraciones />
              </ProtectedRoute>
            } />
            <Route path="publicidades" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <Publicidades />
              </ProtectedRoute>
            } />
            <Route path="usuarios" element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UserManagement />
              </ProtectedRoute>
            } />
            
            {/* Placeholder routes */}
            <Route path="agendas" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Agendas</h1>
                <p className="mt-4">Página en construcción</p>
              </div>
            } />
            <Route path="transformaciones" element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Transformaciones</h1>
                <p className="mt-4">Página en construcción</p>
              </div>
            } />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
