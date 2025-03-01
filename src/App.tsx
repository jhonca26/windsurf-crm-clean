import { useEffect } from 'react';
import { Login } from './components/Login';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <div className="min-h-screen bg-gray-100">
      {!user ? (
        <Login />
      ) : (
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4 text-gray-800">
            Bienvenido, {user.full_name}
          </h1>
          {/* Aquí irá el resto de la aplicación */}
        </div>
      )}
    </div>
  );
}

export default App;
