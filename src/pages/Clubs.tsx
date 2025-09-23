import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Users, ArrowRight } from 'lucide-react';
import { useClub } from '../context/ClubContext';

const Clubs: React.FC = () => {
  const { clubs } = useClub();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-900 to-blue-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Nos <span className="text-yellow-400">5 Clubs</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Découvrez nos clubs répartis dans toute la France, chacun avec sa spécialité
            et son ambiance unique
          </p>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {clubs.map((club, index) => (
              <div key={club.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 relative">
                  <img
                    src={club.photos[0]}
                    alt={club.name}
                    className="w-full h-full object-cover opacity-80"
                  />
                  <div className="absolute top-4 right-4">
                    <span className="bg-yellow-400 text-red-900 px-3 py-1 rounded-full text-sm font-semibold">
                      {club.department}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{club.name}</h3>
                  <div className="flex items-center space-x-2 text-gray-600 mb-3">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{club.city}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3">{club.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{club.schedules[0]}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{club.specialties[0]}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {club.specialties.slice(0, 2).map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                  
                  <Link
                    to={`/club/${club.id}`}
                    className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors w-full justify-center"
                  >
                    <span>Découvrir ce club</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à commencer votre parcours martial ?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Contactez le club le plus proche de chez vous pour un cours d'essai gratuit
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-colors"
          >
            <span>Nous contacter</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Clubs;