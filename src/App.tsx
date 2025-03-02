import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
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
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const AgentRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthStore();
  
  if (user?.role !== 'agent') {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { checkSession, isLoading } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Admin routes */}
          <Route
            path="clientes"
            element={
              <AdminRoute>
                <Clients />
              </AdminRoute>
            }
          />
          <Route
            path="campanas"
            element={
              <AdminRoute>
                <Campaigns />
              </AdminRoute>
            }
          />
          <Route
            path="televentas"
            element={
              <AdminRoute>
                <Televentas />
              </AdminRoute>
            }
          />
          <Route
            path="configuracion"
            element={
              <AdminRoute>
                <Configuration />
              </AdminRoute>
            }
          />
          <Route
            path="integraciones"
            element={
              <AdminRoute>
                <Integraciones />
              </AdminRoute>
            }
          />
          <Route
            path="publicidades"
            element={
              <AdminRoute>
                <Publicidades />
              </AdminRoute>
            }
          />
          <Route
            path="usuarios"
            element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            }
          />

          {/* Agent routes */}
          <Route
            path="atender-consultas"
            element={
              <AgentRoute>
                <AtenderConsultas />
              </AgentRoute>
            }
          />

          {/* Shared routes */}
          <Route path="consultas" element={<Consultations />} />
          <Route path="consultas-nuevas" element={<NewConsultation />} />
          <Route path="bonos" element={<BonosPage />} />
          <Route path="estadisticas" element={<Statistics />} />
          <Route path="whatsapp" element={<WhatsApp />} />
          
          {/* Placeholder routes */}
          <Route
            path="agendas"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Agendas</h1>
                <p className="mt-4">Página en construcción</p>
              </div>
            }
          />
          <Route
            path="transformaciones"
            element={
              <div className="p-6">
                <h1 className="text-2xl font-bold">Transformaciones</h1>
                <p className="mt-4">Página en construcción</p>
              </div>
            }
          />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
