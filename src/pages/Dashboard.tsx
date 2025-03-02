import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface DashboardStats {
  totalClients: number;
  totalConsultations: number;
  pendingConsultations: number;
  activeCampaigns: number;
  monthlyIncome: number;
  recentActivity: Array<{
    id: string;
    type: string;
    description: string;
    created_at: string;
    status: string;
  }>;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalClients: 0,
    totalConsultations: 0,
    pendingConsultations: 0,
    activeCampaigns: 0,
    monthlyIncome: 0,
    recentActivity: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Obtener total de clientes
      const clientsResult = await supabase
        .from('clients')
        .select('*', { count: 'exact', head: true });

      if (clientsResult.error) {
        console.error('Error fetching clients:', clientsResult.error);
        throw new Error(`Error al obtener clientes: ${clientsResult.error.message}`);
      }

      // Obtener total de consultas
      const consultationsResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true });

      if (consultationsResult.error) {
        console.error('Error fetching consultations:', consultationsResult.error);
        throw new Error(`Error al obtener consultas: ${consultationsResult.error.message}`);
      }

      // Obtener consultas pendientes
      const pendingResult = await supabase
        .from('consultations')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      if (pendingResult.error) {
        console.error('Error fetching pending consultations:', pendingResult.error);
        throw new Error(`Error al obtener consultas pendientes: ${pendingResult.error.message}`);
      }

      // Obtener campañas activas
      const campaignsResult = await supabase
        .from('campaigns')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'active');

      if (campaignsResult.error) {
        console.error('Error fetching campaigns:', campaignsResult.error);
        throw new Error(`Error al obtener campañas: ${campaignsResult.error.message}`);
      }

      // Obtener ingresos del mes actual
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const paymentsResult = await supabase
        .from('payments')
        .select('amount')
        .gte('created_at', startOfMonth.toISOString())
        .eq('status', 'completed');

      if (paymentsResult.error) {
        console.error('Error fetching payments:', paymentsResult.error);
        throw new Error(`Error al obtener pagos: ${paymentsResult.error.message}`);
      }

      const monthlyIncome = paymentsResult.data?.reduce((sum, payment) => sum + (payment.amount || 0), 0) || 0;

      // Obtener actividad reciente (consultas)
      const consultationsActivityResult = await supabase
        .from('consultations')
        .select(`
          id,
          created_at,
          status,
          client_id,
          clients (
            name
          )
        `)
        .order('created_at', { ascending: false })
        .limit(5);

      if (consultationsActivityResult.error) {
        console.error('Error fetching recent activity:', consultationsActivityResult.error);
        throw new Error(`Error al obtener actividad reciente: ${consultationsActivityResult.error.message}`);
      }

      // Transformar los datos de actividad reciente
      const recentActivity = consultationsActivityResult.data.map(consultation => ({
        id: consultation.id,
        type: 'consultation',
        description: `Nueva consulta ${consultation.clients?.name ? `de ${consultation.clients.name}` : ''}`,
        created_at: consultation.created_at,
        status: consultation.status
      }));

      setStats({
        totalClients: clientsResult.count || 0,
        totalConsultations: consultationsResult.count || 0,
        pendingConsultations: pendingResult.count || 0,
        activeCampaigns: campaignsResult.count || 0,
        monthlyIncome,
        recentActivity
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar los datos del dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalClients}</p>
            </div>
            <div className="p-3 bg-pink-100 rounded-full">
              <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Total Consultas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Consultas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalConsultations}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Consultas Pendientes */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Consultas Pendientes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingConsultations}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Campañas Activas */}
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Campañas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeCampaigns}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Ingresos del Mes */}
      <div className="mt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Ingresos del Mes</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.monthlyIncome)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {stats.recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {stats.recentActivity.map((activity) => (
                <div key={activity.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-gray-900">{activity.description}</p>
                    <span className={`text-sm ${getStatusColor(activity.status)}`}>
                      {activity.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(activity.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500">
              No hay actividad reciente para mostrar
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
