import React, { useState, useEffect } from 'react';
import { Plus, CreditCard, Calendar, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Subscription {
  id: string;
  client_id: string;
  plan: string;
  status: 'active' | 'expired' | 'cancelled';
  start_date: string;
  end_date: string;
  price: number;
  sessions_remaining?: number;
  auto_renew: boolean;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
  email?: string;
  phone?: string;
}

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<(Subscription & { client: Client })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [formData, setFormData] = useState({
    client_id: '',
    plan: 'basic',
    start_date: new Date().toISOString().split('T')[0],
    end_date: '',
    price: 0,
    sessions: 0,
    auto_renew: false
  });

  const plans = {
    basic: { name: 'Básico', sessions: 4, price: 100 },
    standard: { name: 'Estándar', sessions: 8, price: 180 },
    premium: { name: 'Premium', sessions: 12, price: 250 },
    unlimited: { name: 'Ilimitado', sessions: -1, price: 300 }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener subscripciones con datos de clientes
      const { data: subsData, error: subsError } = await supabase
        .from('subscriptions')
        .select(`
          *,
          client:clients(id, full_name, email, phone)
        `)
        .order('created_at', { ascending: false });

      if (subsError) throw subsError;

      // Obtener clientes para el formulario
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('id, full_name, email, phone')
        .eq('status', 'Activo');

      if (clientsError) throw clientsError;

      setSubscriptions(subsData || []);
      setClients(clientsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handlePlanChange = (plan: keyof typeof plans) => {
    const endDate = new Date(formData.start_date);
    endDate.setMonth(endDate.getMonth() + 1);

    setFormData({
      ...formData,
      plan,
      price: plans[plan].price,
      sessions: plans[plan].sessions,
      end_date: endDate.toISOString().split('T')[0]
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('subscriptions')
        .insert([{
          client_id: formData.client_id,
          plan: formData.plan,
          status: 'active',
          start_date: formData.start_date,
          end_date: formData.end_date,
          price: formData.price,
          sessions_remaining: formData.sessions,
          auto_renew: formData.auto_renew,
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowForm(false);
      fetchData();
    } catch (err) {
      console.error('Error creating subscription:', err);
      setError('Error al crear la suscripción');
    }
  };

  const getStatusColor = (status: Subscription['status']) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Suscripciones</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Suscripción
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Lista de planes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(plans).map(([key, plan]) => (
          <div key={key} className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
            <p className="text-3xl font-bold text-pink-600 mt-2">
              {plan.price}€
              <span className="text-sm text-gray-500">/mes</span>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              {plan.sessions === -1 ? 'Sesiones ilimitadas' : `${plan.sessions} sesiones`}
            </p>
          </div>
        ))}
      </div>

      {/* Lista de suscripciones */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Plan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sesiones
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validez
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {subscriptions.map((subscription) => (
              <tr key={subscription.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {subscription.client.full_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {subscription.client.email}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {plans[subscription.plan as keyof typeof plans]?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {subscription.price}€/mes
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(subscription.status)}`}>
                    {subscription.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {subscription.sessions_remaining === -1 
                    ? 'Ilimitadas'
                    : `${subscription.sessions_remaining} restantes`
                  }
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(subscription.end_date).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nueva Suscripción
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client" className="block text-sm font-medium text-gray-700">
                  Cliente
                </label>
                <select
                  id="client"
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                  required
                >
                  <option value="">Seleccionar cliente</option>
                  {clients.map((client) => (
                    <option key={client.id} value={client.id}>
                      {client.full_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="plan" className="block text-sm font-medium text-gray-700">
                  Plan
                </label>
                <select
                  id="plan"
                  value={formData.plan}
                  onChange={(e) => handlePlanChange(e.target.value as keyof typeof plans)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                >
                  {Object.entries(plans).map(([key, plan]) => (
                    <option key={key} value={key}>
                      {plan.name} - {plan.price}€/mes
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  Fecha de inicio
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="auto_renew"
                  checked={formData.auto_renew}
                  onChange={(e) => setFormData({ ...formData, auto_renew: e.target.checked })}
                  className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                />
                <label htmlFor="auto_renew" className="ml-2 block text-sm text-gray-900">
                  Renovación automática
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Crear Suscripción
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionsPage;
