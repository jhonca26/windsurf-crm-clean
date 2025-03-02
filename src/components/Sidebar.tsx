import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { 
  LayoutDashboard, 
  Users, 
  Phone, 
  PlusCircle, 
  Megaphone, 
  Radio, 
  Calendar, 
  Repeat, 
  Gift, 
  BarChart3,
  ChevronDown,
  ChevronRight,
  Settings,
  MessageSquare,
  Link,
  Headphones,
  UserCog
} from 'lucide-react';

interface MenuItem {
  to: string;
  icon: React.ReactNode;
  label: string;
  roles?: string[];
}

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const [consultasOpen, setConsultasOpen] = useState(false);

  // Función para verificar si el usuario tiene acceso a un ítem del menú
  const hasAccess = (roles?: string[]) => {
    if (!roles || roles.length === 0) return true;
    if (!user || !user.role) return false;
    return roles.includes(user.role);
  };

  const menuItems: MenuItem[] = [
    {
      to: "/dashboard",
      icon: <LayoutDashboard className="mr-3 h-5 w-5" />,
      label: "Panel"
    },
    {
      to: "/clientes",
      icon: <Users className="mr-3 h-5 w-5" />,
      label: "Clientes",
      roles: ['admin']
    },
    {
      to: "/consultas",
      icon: <Phone className="mr-3 h-5 w-5" />,
      label: "Historial Consultas"
    },
    {
      to: "/atender-consultas",
      icon: <Headphones className="mr-3 h-5 w-5" />,
      label: "Atender Consultas",
      roles: ['agent']
    },
    {
      to: "/bonos",
      icon: <Gift className="mr-3 h-5 w-5" />,
      label: "Bonos"
    }
  ];

  const marketingItems: MenuItem[] = [
    {
      to: "/campanas",
      icon: <Megaphone className="mr-3 h-5 w-5" />,
      label: "Campañas",
      roles: ['admin']
    },
    {
      to: "/televentas",
      icon: <Phone className="mr-3 h-5 w-5" />,
      label: "Televentas",
      roles: ['admin']
    },
    {
      to: "/estadisticas",
      icon: <BarChart3 className="mr-3 h-5 w-5" />,
      label: "Estadísticas"
    }
  ];

  const configItems: MenuItem[] = [
    {
      to: "/configuracion",
      icon: <Settings className="mr-3 h-5 w-5" />,
      label: "Configuración",
      roles: ['admin']
    },
    {
      to: "/integraciones",
      icon: <Link className="mr-3 h-5 w-5" />,
      label: "Integraciones",
      roles: ['admin']
    },
    {
      to: "/whatsapp",
      icon: <MessageSquare className="mr-3 h-5 w-5" />,
      label: "WhatsApp"
    },
    {
      to: "/usuarios",
      icon: <UserCog className="mr-3 h-5 w-5" />,
      label: "Usuarios",
      roles: ['admin']
    }
  ];

  const renderMenuItem = (item: MenuItem) => {
    if (!hasAccess(item.roles)) return null;

    return (
      <NavLink 
        key={item.to}
        to={item.to} 
        className={({ isActive }) => 
          `flex items-center px-4 py-2 mt-1 rounded-md ${
            isActive 
              ? 'bg-pink-600 text-white' 
              : 'text-gray-300 hover:bg-gray-800'
          }`
        }
      >
        {item.icon}
        {item.label}
      </NavLink>
    );
  };

  return (
    <div className="bg-gray-900 text-white w-64 h-full flex flex-col overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl md:text-2xl font-bold text-pink-500">GESTIÓN CRM</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {/* Menú Principal */}
        <div className="px-4 py-2">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">PRINCIPAL</h2>
          <nav className="mt-2">
            {menuItems.map(renderMenuItem)}
            
            {/* Menú desplegable de Consultas */}
            <div className="mt-1">
              <button
                onClick={() => setConsultasOpen(!consultasOpen)}
                className="flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800"
              >
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5" />
                  <span>Consultas</span>
                </div>
                {consultasOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
              
              {consultasOpen && (
                <div className="ml-7 mt-1 border-l-2 border-gray-700 pl-4">
                  <NavLink 
                    to="/consultas-nuevas" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 mt-1 rounded-md ${
                        isActive ? 'bg-pink-600 text-white' : 'text-gray-300 hover:bg-gray-800'
                      }`
                    }
                  >
                    <PlusCircle className="mr-3 h-4 w-4" />
                    Nueva Consulta
                  </NavLink>
                </div>
              )}
            </div>
          </nav>
        </div>
        
        {/* Menú Marketing */}
        <div className="px-4 py-2 mt-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">MARKETING</h2>
          <nav className="mt-2">
            {marketingItems.map(renderMenuItem)}
          </nav>
        </div>
        
        {/* Menú Configuración */}
        <div className="px-4 py-2 mt-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">CONFIGURACIÓN</h2>
          <nav className="mt-2">
            {configItems.map(renderMenuItem)}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
