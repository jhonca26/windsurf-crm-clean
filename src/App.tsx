import { useEffect } from 'react';
import { Login } from './components/Login';
import { useAuthStore } from './store/authStore';

function App() {
  const { user, checkSession } = useAuthStore();

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return (
    <>
      {!user ? (
        <Login />
      ) : (
        <div className="min-h-screen bg-gray-100 p-4">
          <h1 className="text-2xl font-bold mb-4">Bienvenido, {user.full_name}</h1>
          {/* Aquí irá el resto de la aplicación */}
        </div>
      )}
    </>
  );
}

export default App;
