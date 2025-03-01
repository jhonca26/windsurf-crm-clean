export function Dashboard() {
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stats Card */}
        <div className="bg-indigo-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-indigo-900">Total Clientes</h3>
          <p className="text-3xl font-bold text-indigo-600">0</p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-green-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-green-900">Consultas del Mes</h3>
          <p className="text-3xl font-bold text-green-600">0</p>
        </div>
        
        {/* Stats Card */}
        <div className="bg-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium text-purple-900">Ingresos del Mes</h3>
          <p className="text-3xl font-bold text-purple-600">$0</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="mt-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Actividad Reciente</h3>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-500 text-center py-4">No hay actividad reciente</p>
        </div>
      </div>
    </div>
  );
}
