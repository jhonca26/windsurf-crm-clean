import React from 'react';
import { LogOut, Home, Menu } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button 
          onClick={toggleSidebar}
          className="p-2 rounded-full hover:bg-gray-800 lg:hidden mr-2"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <div className="text-lg">
          ESPAÑA
        </div>
      </div>
      
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="bg-pink-600 text-white px-2 md:px-4 py-1 rounded-full flex items-center text-xs md:text-sm">
          <span className="truncate max-w-[120px] md:max-w-none">
            {user?.role === 'admin' ? 'Administrador' : 'Agente'} ({user?.email.split('@')[0]})
          </span>
        </div>
        
        <button 
          onClick={() => navigate('/')}
          className="p-2 rounded-full hover:bg-gray-800"
          title="Inicio"
        >
          <Home size={20} />
        </button>
        
        <button 
          onClick={handleLogout}
          className="p-2 rounded-full hover:bg-gray-800"
          title="Cerrar sesión"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
};

export default Header;
