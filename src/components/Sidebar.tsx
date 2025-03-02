import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Phone,
  Share2,
  UserCog,
  BarChart2,
  Megaphone,
  MessageCircle,
  Headphones,
  CreditCard,
  Package
} from 'lucide-react';

const menuItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/clients', icon: Users, label: 'Clientes' },
  { path: '/virtual-pbx', icon: Phone, label: 'Centralita Virtual' },
  { path: '/integrations', icon: Share2, label: 'Integraciones' },
  { path: '/users', icon: UserCog, label: 'Usuarios' },
  { path: '/statistics', icon: BarChart2, label: 'Estadísticas' },
  { path: '/campaigns', icon: Megaphone, label: 'Campañas' },
  { path: '/whatsapp', icon: MessageCircle, label: 'WhatsApp' },
  { path: '/telesales', icon: Headphones, label: 'Televenta' },
  { path: '/subscriptions', icon: Package, label: 'Bonos' },
  { path: '/payments', icon: CreditCard, label: 'Cobros' },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <div className="h-full bg-gray-800 text-white w-64 flex flex-col">
      {/* Logo */}
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold text-pink-500">WindsurfCRM</h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-2 text-sm ${
                    isActive
                      ? 'bg-pink-600 text-white'
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
            <Users className="h-4 w-4 text-gray-300" />
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Usuario</p>
            <p className="text-xs text-gray-400">Administrador</p>
          </div>
        </div>
      </div>
    </div>
  );
}
