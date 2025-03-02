import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Play, Pause } from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'active' | 'paused' | 'completed';
  type: 'email' | 'sms' | 'whatsapp';
  target_audience: string;
  start_date: string;
  end_date?: string;
  created_at: string;
  metrics?: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
  };
}

const CampaignsPage: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Campaign>>({
    name: '',
    description: '',
    type: 'email',
    target_audience: '',
    start_date: new Date().toISOString().split('T')[0],
    status: 'draft'
  });

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCampaigns(data || []);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
      setError('Error al cargar las campañas');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('campaigns')
        .insert([{ 
          ...formData, 
          created_at: new Date().toISOString(), 
          metrics: {
            sent: 0,
            delivered: 0,
            opened: 0,
            clicked: 0,
            converted: 0
          }
        }]);

      if (error) throw error;

      setShowForm(false);
      fetchCampaigns();
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError('Error al crear la campaña');
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      const { error } = await supabase
        .from('campaigns')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchCampaigns();
    } catch (err) {
      console.error('Error toggling campaign status:', err);
      setError('Error al actualizar el estado de la campaña');
    }
  };

  const deleteCampaign = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta campaña?')) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchCampaigns();
    } catch (err) {
      console.error('Error deleting campaign:', err);
      setError('Error al eliminar la campaña');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'whatsapp': return '📱';
      case 'email': return '📧';
      case 'sms': return '💬';
      default: return '📢';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Campañas</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Campaña
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
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {getTypeIcon(campaign.type)} {campaign.name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(campaign.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(campaign.status)}`}>
                  {campaign.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {campaign.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-gray-500">Inicio</p>
                  <p className="font-medium">{new Date(campaign.start_date).toLocaleDateString()}</p>
                </div>
                {campaign.end_date && (
                  <div className="text-sm">
                    <p className="text-gray-500">Fin</p>
                    <p className="font-medium">{new Date(campaign.end_date).toLocaleDateString()}</p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-5 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500">Enviados</p>
                  <p className="font-medium">{campaign.metrics?.sent ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Entregados</p>
                  <p className="font-medium">{campaign.metrics?.delivered ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Abiertos</p>
                  <p className="font-medium">{campaign.metrics?.opened ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Clicks</p>
                  <p className="font-medium">{campaign.metrics?.clicked ?? 0}</p>
                </div>
                <div>
                  <p className="text-gray-500">Conversiones</p>
                  <p className="font-medium">{campaign.metrics?.converted ?? 0}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    onClick={() => toggleStatus(campaign.id, campaign.status)}
                    className={`p-2 rounded-full ${
                      campaign.status === 'active'
                        ? 'text-green-600 hover:bg-green-50'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {campaign.status === 'active' ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>
                  <button
                    onClick={() => setShowForm(true)}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteCampaign(campaign.id)}
                    className="p-2 rounded-full text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
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
              Nueva Campaña
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Nombre de la Campaña
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
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Descripción
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows={3}
                  required
                />
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Tipo de Campaña
                </label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'email' | 'sms' | 'whatsapp' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                  <option value="whatsapp">WhatsApp</option>
                </select>
              </div>

              <div>
                <label htmlFor="target_audience" className="block text-sm font-medium text-gray-700">
                  Audiencia Objetivo
                </label>
                <input
                  type="text"
                  id="target_audience"
                  value={formData.target_audience}
                  onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
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
                  Crear Campaña
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;
