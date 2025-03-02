import React from 'react';
import { useAuthStore } from '../store/authStore';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Estadísticas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Clientes Totales</h3>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Clientes Activos</h3>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Ingresos Totales</h3>
          <p className="text-3xl font-bold text-pink-600">€0</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Bonos Activos</h3>
          <p className="text-3xl font-bold text-pink-600">0</p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Actividad Reciente */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h2>
          <div className="space-y-4">
            <p className="text-gray-500">No hay actividad reciente</p>
          </div>
        </div>

        {/* Próximas Tareas */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Próximas Tareas</h2>
          <div className="space-y-4">
            <p className="text-gray-500">No hay tareas pendientes</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
