import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Stats {
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  averageSessionsPerClient: number;
  revenueThisMonth: number;
  revenueGrowth: number;
}

interface ChartData {
  labels: string[];
  values: number[];
}

const StatisticsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalClients: 0,
    activeClients: 0,
    newClientsThisMonth: 0,
    averageSessionsPerClient: 0,
    revenueThisMonth: 0,
    revenueGrowth: 0
  });
  const [monthlyRevenue, setMonthlyRevenue] = useState<ChartData>({
    labels: [],
    values: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);

      // Obtener estadísticas generales
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*');

      if (clientsError) throw clientsError;

      // Calcular estadísticas básicas
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const activeClients = clientsData?.filter(client => client.status === 'Activo').length || 0;
      const newClientsThisMonth = clientsData?.filter(
        client => new Date(client.created_at) >= firstDayOfMonth
      ).length || 0;

      // Simular datos de ingresos mensuales (esto debería venir de tu base de datos)
      const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
      const last6Months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return monthNames[d.getMonth()];
      }).reverse();

      // En un caso real, estos datos vendrían de tu tabla de pagos
      const mockRevenueData = [15000, 17500, 16800, 19200, 21000, 23500];

      setStats({
        totalClients: clientsData?.length || 0,
        activeClients,
        newClientsThisMonth,
        averageSessionsPerClient: 3.5, // Este valor debería calcularse desde tu tabla de sesiones
        revenueThisMonth: mockRevenueData[5],
        revenueGrowth: ((mockRevenueData[5] - mockRevenueData[4]) / mockRevenueData[4]) * 100
      });

      setMonthlyRevenue({
        labels: last6Months,
        values: mockRevenueData
      });

    } catch (err) {
      console.error('Error fetching statistics:', err);
      setError('Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Estadísticas</h1>

      {/* Cards de estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clientes</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalClients}</p>
            </div>
            <Users className="h-8 w-8 text-pink-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {stats.newClientsThisMonth} nuevos este mes
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Clientes Activos</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.activeClients}</p>
            </div>
            <Calendar className="h-8 w-8 text-pink-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              {((stats.activeClients / stats.totalClients) * 100).toFixed(1)}% del total
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Ingresos del Mes</p>
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(stats.revenueThisMonth)}
              </p>
            </div>
            <BarChart3 className="h-8 w-8 text-pink-600" />
          </div>
          <div className="mt-4">
            <p className={`text-sm ${stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(stats.revenueGrowth).toFixed(1)}% vs mes anterior
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Sesiones por Cliente</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.averageSessionsPerClient.toFixed(1)}
              </p>
            </div>
            <TrendingUp className="h-8 w-8 text-pink-600" />
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Media mensual</p>
          </div>
        </div>
      </div>

      {/* Gráfico de ingresos mensuales */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Ingresos Mensuales</h2>
        <div className="h-64">
          <div className="relative h-full">
            <div className="absolute bottom-0 left-0 right-0 h-full flex items-end">
              {monthlyRevenue.values.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 mx-1"
                  style={{ height: `${(value / Math.max(...monthlyRevenue.values)) * 100}%` }}
                >
                  <div className="h-full bg-pink-500 opacity-75 rounded-t"></div>
                  <div className="text-xs text-gray-600 text-center mt-2">
                    {monthlyRevenue.labels[index]}
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {formatCurrency(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPage;
