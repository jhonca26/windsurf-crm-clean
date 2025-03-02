import React, { useState, useEffect } from 'react';
import { Phone, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import type { VirtualPBX } from '../types/database.types';

const VirtualPBXPage: React.FC = () => {
  const [extensions, setExtensions] = useState<VirtualPBX[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    phone_number: '',
    description: '',
    status: 'active'
  });

  useEffect(() => {
    fetchExtensions();
  }, []);

  const fetchExtensions = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('virtual_pbx')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setExtensions(data || []);
    } catch (err) {
      console.error('Error fetching extensions:', err);
      setError('Error al cargar las extensiones');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('virtual_pbx')
        .insert([formData]);

      if (error) throw error;

      setShowForm(false);
      fetchExtensions();
    } catch (err) {
      console.error('Error creating extension:', err);
      setError('Error al crear la extensión');
    }
  };

  const handleStatusChange = async (id: string, newStatus: 'active' | 'inactive') => {
    try {
      const { error } = await supabase
        .from('virtual_pbx')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      fetchExtensions();
    } catch (err) {
      console.error('Error updating extension status:', err);
      setError('Error al actualizar el estado');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Centralita Virtual</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nueva Extensión
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {extensions.map((ext) => (
            <div
              key={ext.id}
              className="bg-white rounded-lg shadow p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Phone className="h-6 w-6 text-pink-600 mr-3" />
                  <h3 className="text-lg font-medium text-gray-900">
                    {ext.phone_number}
                  </h3>
                </div>
                <select
                  value={ext.status}
                  onChange={(e) => handleStatusChange(ext.id, e.target.value as 'active' | 'inactive')}
                  className="rounded-md border-gray-300 text-sm focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                </select>
              </div>
              <p className="text-gray-600">{ext.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Nueva Extensión
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                  Número de Teléfono
                </label>
                <input
                  type="tel"
                  id="phone_number"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
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
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                />
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
                  Crear
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VirtualPBXPage;
