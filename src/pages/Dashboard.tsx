import React from 'react';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Bienvenido al Panel de Control</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Estadísticas rápidas */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Consultas Pendientes</h2>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Consultas Hoy</h2>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Bonos Activos</h2>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
      </div>
      
      {user?.role === 'admin' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Actividad Reciente</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6 text-center text-gray-500">
              No hay actividad reciente para mostrar
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
