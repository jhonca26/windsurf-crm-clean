import React from 'react';

const Televentas: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Televentas</h1>
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 text-center text-gray-500">
          No hay televentas para mostrar
        </div>
      </div>
    </div>
  );
};

export default Televentas;
