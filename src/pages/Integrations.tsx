import React, { useState } from 'react';
import { MessageSquare, CreditCard, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

const integrations = [
  {
    id: 'whatsapp',
    name: 'WhatsApp Business API',
    description: 'Conecta con tus clientes a través de WhatsApp',
    icon: MessageSquare,
    status: 'pending',
    setupUrl: 'https://business.whatsapp.com/products/business-platform'
  },
  {
    id: 'stripe',
    name: 'Stripe Payments',
    description: 'Procesa pagos online de forma segura',
    icon: CreditCard,
    status: 'pending',
    setupUrl: 'https://dashboard.stripe.com/register'
  },
  {
    id: 'mailchimp',
    name: 'Mailchimp',
    description: 'Automatiza tus campañas de email marketing',
    icon: Mail,
    status: 'pending',
    setupUrl: 'https://login.mailchimp.com/signup/'
  }
];

const IntegrationsPage: React.FC = () => {
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async (integrationId: string) => {
    setLoading(integrationId);
    setError(null);

    try {
      // Aquí iría la lógica de conexión con cada servicio
      const { error } = await supabase
        .from('integrations')
        .upsert([
          {
            integration_id: integrationId,
            status: 'connected',
            updated_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setActiveIntegration(integrationId);
    } catch (err) {
      console.error('Error connecting integration:', err);
      setError('Error al conectar la integración');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          const isActive = activeIntegration === integration.id;
          const isLoading = loading === integration.id;

          return (
            <div
              key={integration.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <Icon className="h-6 w-6 text-pink-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {integration.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {integration.description}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-4">
                <a
                  href={integration.setupUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-pink-600 hover:text-pink-700"
                >
                  Ver documentación
                </a>
                <button
                  onClick={() => handleConnect(integration.id)}
                  disabled={isLoading}
                  className={`px-4 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-green-100 text-green-800 cursor-default'
                      : 'bg-pink-600 text-white hover:bg-pink-700'
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Conectando...
                    </span>
                  ) : isActive ? (
                    'Conectado'
                  ) : (
                    'Conectar'
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default IntegrationsPage;
