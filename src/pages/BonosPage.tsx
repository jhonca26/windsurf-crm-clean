import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, CreditCard, CheckCircle, XCircle } from 'lucide-react';

interface Payment {
  id: string;
  client_id: string;
  client_name: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'credit_card' | 'debit_card' | 'transfer' | 'cash';
  reference: string;
  created_at: string;
  completed_at?: string;
  notes?: string;
}

const BonosPage: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Payment>>({
    client_name: '',
    amount: 0,
    payment_method: 'credit_card',
    reference: '',
    notes: ''
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      console.error('Error fetching payments:', err);
      setError('Error al cargar los pagos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from('payments')
        .insert([{
          ...formData,
          status: 'pending',
          created_at: new Date().toISOString()
        }]);

      if (error) throw error;

      setShowForm(false);
      fetchPayments();
    } catch (err) {
      console.error('Error creating payment:', err);
      setError('Error al crear el pago');
    }
  };

  const deletePayment = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este pago?')) return;

    try {
      const { error } = await supabase
        .from('payments')
        .delete()
        .eq('id', id);

      if (error) throw error;
      fetchPayments();
    } catch (err) {
      console.error('Error deleting payment:', err);
      setError('Error al eliminar el pago');
    }
  };

  const updatePaymentStatus = async (id: string, newStatus: Payment['status']) => {
    try {
      const { error } = await supabase
        .from('payments')
        .update({
          status: newStatus,
          completed_at: newStatus === 'completed' ? new Date().toISOString() : null
        })
        .eq('id', id);

      if (error) throw error;
      fetchPayments();
    } catch (err) {
      console.error('Error updating payment status:', err);
      setError('Error al actualizar el estado del pago');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return '💳';
      case 'debit_card': return '💳';
      case 'transfer': return '🏦';
      case 'cash': return '💵';
      default: return '💰';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pagos</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Nuevo Pago
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
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    {getPaymentMethodIcon(payment.payment_method)} {payment.client_name}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(payment.created_at).toLocaleDateString()}
                  </p>
                </div>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                  {payment.status}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">
                  {formatCurrency(payment.amount)}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Ref: {payment.reference}
                </p>
              </div>

              {payment.notes && (
                <p className="mt-4 text-sm text-gray-600">
                  {payment.notes}
                </p>
              )}

              <div className="mt-6 flex justify-between items-center">
                <div className="space-x-2">
                  {payment.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'completed')}
                        className="p-2 rounded-full text-green-600 hover:bg-green-50"
                      >
                        <CheckCircle className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => updatePaymentStatus(payment.id, 'failed')}
                        className="p-2 rounded-full text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-5 w-5" />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => deletePayment(payment.id)}
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
              Nuevo Pago
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="client_name" className="block text-sm font-medium text-gray-700">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  id="client_name"
                  value={formData.client_name}
                  onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                  Monto
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>

              <div>
                <label htmlFor="payment_method" className="block text-sm font-medium text-gray-700">
                  Método de Pago
                </label>
                <select
                  id="payment_method"
                  value={formData.payment_method}
                  onChange={(e) => setFormData({ ...formData, payment_method: e.target.value as Payment['payment_method'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                >
                  <option value="credit_card">Tarjeta de Crédito</option>
                  <option value="debit_card">Tarjeta de Débito</option>
                  <option value="transfer">Transferencia</option>
                  <option value="cash">Efectivo</option>
                </select>
              </div>

              <div>
                <label htmlFor="reference" className="block text-sm font-medium text-gray-700">
                  Referencia
                </label>
                <input
                  type="text"
                  id="reference"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  required
                />
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Notas
                </label>
                <textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500"
                  rows={3}
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
                  Crear Pago
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BonosPage;
