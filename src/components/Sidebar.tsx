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

const Sidebar: React.FC = () => {
  const { user } = useAuthStore();
  const [consultasOpen, setConsultasOpen] = useState(false);

  return (
    <div className="bg-gray-900 text-white w-64 h-full flex flex-col overflow-y-auto">
      <div className="p-4">
        <h1 className="text-xl md:text-2xl font-bold text-pink-500">GESTIÓN CRM</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">PRINCIPAL</h2>
          <nav className="mt-2">
            <NavLink 
              to="/" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 mt-1 rounded-md ${
                  isActive 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <LayoutDashboard className="mr-3 h-5 w-5" />
              Panel
            </NavLink>
            
            {user?.role === 'admin' && (
              <NavLink 
                to="/clientes" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 mt-1 rounded-md ${
                    isActive 
                      ? 'bg-pink-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Users className="mr-3 h-5 w-5" />
                Clientes
              </NavLink>
            )}
            
            {/* Menú desplegable de Consultas */}
            <div className="mt-1">
              <button
                onClick={() => setConsultasOpen(!consultasOpen)}
                className={`flex items-center justify-between w-full px-4 py-2 rounded-md text-gray-300 hover:bg-gray-800`}
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
                    to="/consultas-nuevas?type=consulta_nueva" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 mt-1 rounded-md ${
                        isActive && new URLSearchParams(window.location.search).get('type') === 'consulta_nueva'
                          ? 'bg-pink-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`
                    }
                  >
                    <PlusCircle className="mr-3 h-4 w-4" />
                    Consulta Nueva
                  </NavLink>
                  
                  <NavLink 
                    to="/consultas-nuevas?type=agenda" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 mt-1 rounded-md ${
                        isActive && new URLSearchParams(window.location.search).get('type') === 'agenda'
                          ? 'bg-pink-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`
                    }
                  >
                    <Calendar className="mr-3 h-4 w-4" />
                    Agenda
                  </NavLink>
                  
                  <NavLink 
                    to="/consultas-nuevas?type=transformacion" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 mt-1 rounded-md ${
                        isActive && new URLSearchParams(window.location.search).get('type') === 'transformacion'
                          ? 'bg-pink-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`
                    }
                  >
                    <Repeat className="mr-3 h-4 w-4" />
                    Transformación
                  </NavLink>
                  
                  <NavLink 
                    to="/consultas-nuevas?type=televenta" 
                    className={({ isActive }) => 
                      `flex items-center px-4 py-2 mt-1 rounded-md ${
                        isActive && new URLSearchParams(window.location.search).get('type') === 'televenta'
                          ? 'bg-pink-600 text-white' 
                          : 'text-gray-300 hover:bg-gray-800'
                      }`
                    }
                  >
                    <Phone className="mr-3 h-4 w-4" />
                    Televenta
                  </NavLink>
                </div>
              )}
            </div>
            
            <NavLink 
              to="/consultas" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 mt-1 rounded-md ${
                  isActive 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Phone className="mr-3 h-5 w-5" />
              Historial Consultas
            </NavLink>
            
            {user?.role === 'agent' && (
              <NavLink 
                to="/atender-consultas" 
                className={({ isActive }) => 
                  `flex items-center px-4 py-2 mt-1 rounded-md ${
                    isActive 
                      ? 'bg-pink-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800'
                  }`
                }
              >
                <Headphones className="mr-3 h-5 w-5" />
                Atender Consultas
              </NavLink>
            )}
            
            <NavLink 
              to="/bonos" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 mt-1 rounded-md ${
                  isActive 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <Gift className="mr-3 h-5 w-5" />
              Bonos
            </NavLink>
          </nav>
        </div>
        
        <div className="px-4 py-2 mt-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">MARKETING</h2>
          <nav className="mt-2">
            {user?.role === 'admin' && (
              <>
                <NavLink 
                  to="/campanas" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Megaphone className="mr-3 h-5 w-5" />
                  Campañas
                </NavLink>
                
                <NavLink 
                  to="/televentas" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Radio className="mr-3 h-5 w-5" />
                  Televentas
                </NavLink>
                
                <NavLink 
                  to="/publicidades" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Megaphone className="mr-3 h-5 w-5" />
                  Publicidades
                </NavLink>
              </>
            )}
            
            <NavLink 
              to="/whatsapp" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 mt-1 rounded-md ${
                  isActive 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <MessageSquare className="mr-3 h-5 w-5" />
              WhatsApp
            </NavLink>
          </nav>
        </div>
        
        <div className="px-4 py-2 mt-4">
          <h2 className="text-xs uppercase tracking-wider text-gray-400">SISTEMA</h2>
          <nav className="mt-2">
            <NavLink 
              to="/estadisticas" 
              className={({ isActive }) => 
                `flex items-center px-4 py-2 mt-1 rounded-md ${
                  isActive 
                    ? 'bg-pink-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                }`
              }
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Estadísticas
            </NavLink>
            
            {user?.role === 'admin' && (
              <>
                <NavLink 
                  to="/configuracion" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Configuración
                </NavLink>
                
                <NavLink 
                  to="/integraciones" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <Link className="mr-3 h-5 w-5" />
                  Integraciones
                </NavLink>
                
                <NavLink 
                  to="/usuarios" 
                  className={({ isActive }) => 
                    `flex items-center px-4 py-2 mt-1 rounded-md ${
                      isActive 
                        ? 'bg-pink-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                    }`
                  }
                >
                  <UserCog className="mr-3 h-5 w-5" />
                  Usuarios
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
