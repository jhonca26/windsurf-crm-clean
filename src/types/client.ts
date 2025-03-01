export interface Client {
  id: string;
  user_id: string;
  full_name: string;
  email?: string;
  phone?: string;
  experience_level: 'Principiante' | 'Intermedio' | 'Avanzado';
  status: 'Activo' | 'Inactivo';
  notes?: string;
  created_at: string;
}
