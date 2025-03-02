import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, RefreshCw, Check, X } from 'lucide-react';

interface Integration {
  id: string;
  name: string;
  type: 'whatsapp' | 'email' | 'sms' | 'payment';
  status: 'active' | 'inactive' | 'error';
  api_key?: string;
  config: Record<string, any>;
  created_at: string;
  last_sync?: string;
}

const Integraciones: React.FC = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'whatsapp' as const,
    config: {}
  });

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const fetchIntegrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('integrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setIntegrations(data || []);
    } catch (err) {
      console.error('Error fetching integrations:', err);
      setError('Error al cargar las integraciones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('integrations')
        .insert([{
          ...formData,
          status: 'inactive',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowForm(false);
      fetchIntegrations();
    } catch (err) {
      console.error('Error creating integration:', err);
      setError('Error al crear la integración');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      const { error } = await supabase
        .from('integrations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchIntegrations();
    } catch (err) {
      console.error('Error toggling integration status:', err);
      setError('Error al actualizar el estado de la integración');
    }
  };

  const deleteIntegration = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta integración?')) return;

    try {
      const { error } = await supabase
        .from('integrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchIntegrations();
    } catch (err) {
      console.error('Error deleting integration:', err);
      setError('Error al eliminar la integración');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return '📱';
      case 'email': return '📧';
      case 'sms': return '💬';
      case 'payment': return '💳';
      default: return '🔌';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Integración
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {getTypeIcon(integration.type)} {integration.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(integration.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(integration.status)}`}>
                  {integration.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">
                  Última sincronización: {integration.last_sync ? new Date(integration.last_sync).toLocaleString() : 'Nunca'}
                </p>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    onClick={() => toggleStatus(integration.id, integration.status)}
                    className={`p-2 rounded-full ${
                      integration.status === 'active' 
                        ? 'text-green-600 hover:bg-green-50' 
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {integration.status === 'active' ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => deleteIntegration(integration.id)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
                <button
                  onClick={() => fetchIntegrations()}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-50"
                >
                  <RefreshCw className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nueva Integración
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre de la Integración
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de Integración
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'whatsapp' | 'email' | 'sms' | 'payment' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="whatsapp">WhatsApp</option>
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="payment">Pagos</option>
                </select>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 rounded-md hover:bg-pink-700"
                >
                  Crear Integración
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Integraciones;
