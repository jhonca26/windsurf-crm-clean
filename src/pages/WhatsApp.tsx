import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Phone, User, Search } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Message {
  id: string;
  client_id: string;
  direction: 'incoming' | 'outgoing';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

interface Client {
  id: string;
  full_name: string | null;
  phone: string | null;
  last_message?: string;
  last_message_at?: string;
  unread_count?: number;
}

const WhatsAppPage: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages(selectedClient.id);
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchClients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .not('phone', 'is', null)
        .order('full_name');

      if (error) throw error;
      setClients(data || []);
    } catch (err) {
      console.error('Error fetching clients:', err);
      setError('Error al cargar los clientes');
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at');

      if (error) throw error;
      setMessages(data || []);
    } catch (err) {
      console.error('Error fetching messages:', err);
      setError('Error al cargar los mensajes');
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newMessage.trim()) return;

    try {
      const message = {
        client_id: selectedClient.id,
        direction: 'outgoing' as const,
        content: newMessage,
        status: 'sent' as const,
        created_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('messages')
        .insert([message])
        .select()
        .single();

      if (error) throw error;

      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Error al enviar el mensaje');
    }
  };

  const filteredClients = clients.filter(client => {
    if (!client.full_name && !client.phone) return false;
    
    const searchTermLower = searchTerm.toLowerCase();
    const fullName = client.full_name?.toLowerCase() || '';
    const phone = client.phone || '';

    return fullName.includes(searchTermLower) || phone.includes(searchTerm);
  });

  return (
    <div className="flex h-[calc(100vh-6rem)] bg-gray-100">
      {/* Lista de clientes */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                selectedClient?.id === client.id ? 'bg-pink-50' : ''
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {client.full_name || 'Sin nombre'}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{client.phone || 'Sin teléfono'}</p>
                </div>
                {client.unread_count && client.unread_count > 0 && (
                  <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-pink-100 text-pink-800">
                    {client.unread_count}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {selectedClient ? (
          <>
            {/* Cabecera del chat */}
            <div className="p-4 bg-white border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-8 w-8 text-gray-400" />
                <div>
                  <h2 className="text-lg font-medium text-gray-900">
                    {selectedClient.full_name || 'Sin nombre'}
                  </h2>
                  <p className="text-sm text-gray-500">{selectedClient.phone || 'Sin teléfono'}</p>
                </div>
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600">
                <Phone className="h-5 w-5" />
              </button>
            </div>

            {/* Mensajes */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.direction === 'outgoing' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
                      message.direction === 'outgoing'
                        ? 'bg-pink-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-75">
                      {new Date(message.created_at).toLocaleTimeString()}
                      {message.direction === 'outgoing' && (
                        <span className="ml-2">
                          {message.status === 'read' ? '✓✓' : message.status === 'delivered' ? '✓✓' : '✓'}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input de mensaje */}
            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-4">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay chat seleccionado</h3>
              <p className="mt-1 text-sm text-gray-500">
                Selecciona un cliente para comenzar a chatear
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppPage;
