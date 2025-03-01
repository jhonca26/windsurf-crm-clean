export type User = {
  id: number;
  email: string;
  role: 'admin' | 'agent';
  created_at: string;
  can_handle_payments?: boolean;
  full_name?: string;
};

export type Client = {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  source?: string | null;
  created_at: string;
  date_of_birth?: string | null;
};

export type CallType = 'consulta_nueva' | 'agenda' | 'transformacion' | 'televenta' | 'publicidad';

export type Consulta = {
  id: number;
  client_id: number;
  agent_id: number;
  date: string;
  minutes_purchased: number;
  minutes_used: number;
  minutes_remaining: number;
  status: 'pending' | 'in-progress' | 'completed' | 'standard';
  observations: string | null;
  created_at: string;
  client?: Client;
  agent?: User;
  payment_method?: string;
  payment_status?: 'pending' | 'completed' | 'failed';
  payment_id?: string;
  call_type?: CallType;
  package_id?: number;
};
