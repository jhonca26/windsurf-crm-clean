export interface Client {
  id: number;
  created_at: string;
  full_name: string;
  email: string;
  phone: string;
  experience_level: 'Principiante' | 'Intermedio' | 'Avanzado';
  status: 'Activo' | 'Inactivo';
  notes?: string;
}
