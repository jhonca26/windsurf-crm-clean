import React, { useState, useEffect } from 'react';
import { Phone, User, Clock, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Call {
  id: string;
  client_id: string;
  status: 'pending' | 'completed' | 'no-answer' | 'callback';
  notes?: string;
  callback_date?: string;
  duration?: number;
  created_at: string;
}

interface Client {
  id: string;
  full_name: string;
  phone?: string;
  status: string;
  last_call?: string;
}

const TeleventaPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCallForm, setShowCallForm] = useState(false);
  const [callData, setCallData] = useState({
    notes: '',
    status: 'pending' as const,
    callback_date: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Obtener clientes
      const { data: clientsData, error: clientsError } = await supabase
        .from('clients')
        .select('*')
        .not('phone', 'is', null)
        .order('last_call', { ascending: true, nullsFirst: true });

      if (clientsError) throw clientsError;

      // Obtener llamadas
      const { data: callsData, error: callsError } = await supabase
        .from('calls')
        .select('*')
        .order('created_at', { ascending: false });

      if (callsError) throw callsError;

      setClients(clientsData || []);
      setCalls(callsData || []);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = (client: Client) => {
    setSelectedClient(client);
    setShowCallForm(true);
    setCallData({
      notes: '',
      status: 'pending',
      callback_date: ''
    });
  };

  const handleEndCall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient) return;

    try {
      const call = {
        client_id: selectedClient.id,
        ...callData,
        created_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('calls')
        .insert([call]);

      if (error) throw error;

      // Actualizar la fecha de última llamada del cliente
      await supabase
        .from('clients')
        .update({ last_call: new Date().toISOString() })
        .eq('id', selectedClient.id);

      setShowCallForm(false);
      fetchData();
    } catch (err) {
      console.error('Error saving call:', err);
      setError('Error al guardar la llamada');
    }
  };

  const getStatusColor = (status: Call['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'no-answer': return 'bg-red-100 text-red-800';
      case 'callback': return 'bg-yellow-100 text-yellow-800';
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
      <h1 className="text-2xl font-bold text-gray-900">Televenta</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de clientes para llamar */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Clientes pendientes de llamada
            </h3>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {clients.map((client) => (
              <li
                key={client.id}
                className="px-4 py-4 hover:bg-gray-50 flex items-center justify-between"
              >
                <div className="flex items-center">
                  <User className="h-8 w-8 text-gray-400" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{client.full_name}</p>
                    <p className="text-sm text-gray-500">{client.phone}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleStartCall(client)}
                  className="ml-4 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Historial de llamadas */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-4 py-5 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Historial de llamadas
            </h3>
          </div>
          <ul className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
            {calls.map((call) => {
              const client = clients.find(c => c.id === call.client_id);
              return (
                <li key={call.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-gray-400" />
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">
                          {client?.full_name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(call.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(call.status)}`}>
                      {call.status}
                    </span>
                  </div>
                  {call.notes && (
                    <p className="mt-2 text-sm text-gray-500">{call.notes}</p>
                  )}
                  {call.callback_date && (
                    <p className="mt-1 text-sm text-yellow-600">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Llamar de nuevo: {new Date(call.callback_date).toLocaleString()}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* Modal de llamada */}
      {showCallForm && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Llamada con {selectedClient.full_name}
              </h2>
              <button
                onClick={() => setShowCallForm(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleEndCall} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Estado de la llamada
                </label>
                <select
                  value={callData.status}
                  onChange={(e) => setCallData({ ...callData, status: e.target.value as Call['status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                >
                  <option value="completed">Completada</option>
                  <option value="no-answer">No contesta</option>
                  <option value="callback">Llamar más tarde</option>
                </select>
              </div>

              {callData.status === 'callback' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Fecha para volver a llamar
                  </label>
                  <input
                    type="datetime-local"
                    value={callData.callback_date}
                    onChange={(e) => setCallData({ ...callData, callback_date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notas
                </label>
                <textarea
                  value={callData.notes}
                  onChange={(e) => setCallData({ ...callData, notes: e.target.value })}
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-pink-500 focus:border-pink-500"
                  placeholder="Añade notas sobre la llamada..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCallForm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-pink-600 border border-transparent rounded-md hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                >
                  Finalizar llamada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeleventaPage;
