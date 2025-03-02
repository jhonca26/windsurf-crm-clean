import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Edit2, Trash2, Eye, BarChart2 } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  description: string;
  platform: 'facebook' | 'instagram' | 'google' | 'tiktok';
  status: 'active' | 'paused' | 'completed';
  budget: number;
  start_date: string;
  end_date?: string;
  created_at: string;
  metrics: {
    impressions: number;
    clicks: number;
    conversions: number;
    spend: number;
    ctr: number;
    cpc: number;
  };
}

const Publicidades: React.FC = () => {
  const [ads, setAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Ad>>({
    title: '',
    description: '',
    platform: 'facebook',
    budget: 0,
    start_date: new Date().toISOString().split('T')[0],
    status: 'active'
  });

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAds(data || []);
    } catch (err) {
      console.error('Error fetching ads:', err);
      setError('Error al cargar las publicidades');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('ads')
        .insert([{
          ...formData,
          created_at: new Date().toISOString(),
          metrics: {
            impressions: 0,
            clicks: 0,
            conversions: 0,
            spend: 0,
            ctr: 0,
            cpc: 0
          }
        }]);

      if (error) throw error;

      setShowForm(false);
      fetchAds();
    } catch (err) {
      console.error('Error creating ad:', err);
      setError('Error al crear la publicidad');
    }
  };

  const deleteAd = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicidad?')) return;

    try {
      const { error } = await supabase
        .from('ads')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchAds();
    } catch (err) {
      console.error('Error deleting ad:', err);
      setError('Error al eliminar la publicidad');
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'facebook': return '👥';
      case 'instagram': return '📸';
      case 'google': return '🔍';
      case 'tiktok': return '🎵';
      default: return '📢';
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('es-CO').format(num);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Publicidades</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Publicidad
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
          {ads.map((ad) => (
            <div
              key={ad.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {getPlatformIcon(ad.platform)} {ad.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(ad.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.status)}`}>
                  {ad.status}
                </span>
              </div>

              <p className="mt-2 text-sm text-gray-600">
                {ad.description}
              </p>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="text-sm">
                  <p className="text-gray-500">Presupuesto</p>
                  <p className="font-medium">{formatCurrency(ad.budget)}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">Gastado</p>
                  <p className="font-medium">{formatCurrency(ad.metrics.spend)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500">Impresiones</p>
                  <p className="font-medium">{formatNumber(ad.metrics.impressions)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Clicks</p>
                  <p className="font-medium">{formatNumber(ad.metrics.clicks)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Conversiones</p>
                  <p className="font-medium">{formatNumber(ad.metrics.conversions)}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
                <div>
                  <p className="text-gray-500">CTR</p>
                  <p className="font-medium">{ad.metrics.ctr.toFixed(2)}%</p>
                </div>
                <div>
                  <p className="text-gray-500">CPC</p>
                  <p className="font-medium">{formatCurrency(ad.metrics.cpc)}</p>
                </div>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <div className="space-x-2">
                  <button
                    onClick={() => {/* Implementar vista previa */}}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => {/* Implementar análisis */}}
                    className="p-2 rounded-full text-green-600 hover:bg-green-50"
                  >
                    <BarChart2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setShowForm(true)}
                    className="p-2 rounded-full text-blue-600 hover:bg-blue-50"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => deleteAd(ad.id)}
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
              Nueva Publicidad
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Título
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
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
                <label htmlFor="platform" className="block text-sm font-medium text-gray-700">
                  Plataforma
                </label>
                <select
                  id="platform"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value as 'facebook' | 'instagram' | 'google' | 'tiktok' })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="google">Google</option>
                  <option value="tiktok">TikTok</option>
                </select>
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Presupuesto
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: Number(e.target.value) })}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="0.00"
                    required
                  />
                </div>
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
                  Crear Publicidad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Publicidades;
