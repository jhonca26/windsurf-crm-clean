export interface User {
  id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'agent' | 'user';
  created_at: string;
}

export interface Client {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  experience_level: 'Principiante' | 'Intermedio' | 'Avanzado' | null;
  status: 'Activo' | 'Inactivo' | null;
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface VirtualPBX {
  id: string;
  user_id: string;
  phone_number: string;
  description: string | null;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string | null;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  type: 'email' | 'sms' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'running' | 'completed' | 'failed';
  target_audience: string;
  content: string;
  scheduled_for: string | null;
  sent_count: number;
  open_rate: number | null;
  click_rate: number | null;
  created_at: string;
  updated_at: string | null;
}

export interface Message {
  id: string;
  user_id: string;
  client_id: string;
  direction: 'incoming' | 'outgoing';
  content: string;
  status: 'sent' | 'delivered' | 'read';
  created_at: string;
}

export interface Integration {
  id: string;
  user_id: string;
  integration_id: string;
  status: 'connected' | 'disconnected';
  settings: Record<string, any> | null;
  created_at: string;
  updated_at: string | null;
}

export interface Payment {
  id: string;
  user_id: string;
  client_id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: 'stripe' | 'paypal' | 'bizum';
  payment_id: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Session {
  id: string;
  user_id: string;
  client_id: string;
  date: string;
  duration: number;
  type: 'individual' | 'group';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface Statistics {
  total_clients: number;
  active_clients: number;
  new_clients_this_month: number;
  average_sessions_per_client: number;
  revenue_this_month: number;
  revenue_growth: number;
}
