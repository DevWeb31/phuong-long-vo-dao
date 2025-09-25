import React from 'react';
import { Shield, Clock, Zap, ArrowLeft } from 'lucide-react';

const MaintenancePage: React.FC = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        {/* Logo et icône */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-red-600 rounded-full mb-4">
            <Zap className="w-10 h-10 text-yellow-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Phuong Long Vo Dao
          </h1>
          <p className="text-lg text-gray-600">
            École d'arts martiaux vietnamiens
          </p>
        </div>

        {/* Message principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-orange-500 mr-4" />
            <Clock className="w-16 h-16 text-orange-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Mode Maintenance
          </h2>
          
          <p className="text-lg text-gray-600 mb-6 leading-relaxed">
            Notre site est temporairement en maintenance pour améliorer votre expérience. 
            Nous travaillons dur pour vous offrir un service encore meilleur.
          </p>
          
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
            <p className="text-orange-800 font-medium">
              ⏰ Retour prévu dans quelques minutes
            </p>
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Merci de votre patience et de votre compréhension.</p>
            <p className="mt-2">
              L'équipe Phuong Long Vo Dao
            </p>
          </div>
        </div>

        {/* Informations de contact */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Besoin d'aide urgente ?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Contact direct</h4>
              <p className="text-gray-600 text-sm">
                Email: contact@phuonglongvodao.fr
              </p>
              <p className="text-gray-600 text-sm">
                Téléphone: 05 XX XX XX XX
              </p>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Nos clubs</h4>
              <p className="text-gray-600 text-sm">
                Montaigut sur Save (31)
              </p>
              <p className="text-gray-600 text-sm">
                Trégeux (22)
              </p>
            </div>
          </div>
        </div>

        {/* Bouton retour */}
        <button
          onClick={handleGoBack}
          className="inline-flex items-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Retour
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>© 2024 Phuong Long Vo Dao - Tous droits réservés</p>
        </div>
      </div>
    </div>
  );
};

export default MaintenancePage;
