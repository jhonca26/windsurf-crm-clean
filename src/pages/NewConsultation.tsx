import React from 'react';
import { useSearchParams } from 'react-router-dom';

const NewConsultation: React.FC = () => {
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');

  const getTitle = () => {
    switch (type) {
      case 'consulta_nueva':
        return 'Nueva Consulta';
      case 'agenda':
        return 'Nueva Agenda';
      case 'transformacion':
        return 'Nueva Transformación';
      case 'televenta':
        return 'Nueva Televenta';
      default:
        return 'Nueva Consulta';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">{getTitle()}</h1>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500 text-center">
          Formulario en construcción
        </p>
      </div>
    </div>
  );
};

export default NewConsultation;
