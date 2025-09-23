import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Filter } from 'lucide-react';
import { useClub } from '../context/ClubContext';

const Events: React.FC = () => {
  const { events } = useClub();
  const [filter, setFilter] = useState<'all' | 'competition' | 'stage' | 'demonstration'>('all');

  const filteredEvents = filter === 'all' ? events : events.filter(event => event.type === filter);

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'competition': return 'Compétition';
      case 'stage': return 'Stage';
      case 'demonstration': return 'Démonstration';
      default: return type;
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'competition': return 'bg-red-100 text-red-800';
      case 'stage': return 'bg-blue-100 text-blue-800';
      case 'demonstration': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-green-900 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-yellow-400">Événements</span> & Calendrier
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Découvrez nos prochains stages, compétitions et démonstrations
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Filter className="w-5 h-5" />
              <span className="font-medium">Filtrer par :</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {[
                { value: 'all', label: 'Tous' },
                { value: 'competition', label: 'Compétitions' },
                { value: 'stage', label: 'Stages' },
                { value: 'demonstration', label: 'Démonstrations' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value as any)}
                  className={`px-4 py-2 rounded-full font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEventTypeColor(event.type)}`}>
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4 text-gray-600">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(event.date).toLocaleDateString('fr-FR', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    
                    <button className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors">
                      Plus d'infos
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Aucun événement trouvé
              </h3>
              <p className="text-gray-600">
                Aucun événement ne correspond aux critères sélectionnés.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Événements passés</h2>
            <p className="text-gray-600">Revivez nos moments forts en images</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Championnat National 2023",
                date: "15 octobre 2023",
                image: "https://images.pexels.com/photos/7045879/pexels-photo-7045879.jpeg?auto=compress&cs=tinysrgb&w=600",
                description: "Excellents résultats de nos compétiteurs au championnat national."
              },
              {
                title: "Stage Maître Nguyen",
                date: "22 septembre 2023",
                image: "https://images.pexels.com/photos/7045880/pexels-photo-7045880.jpeg?auto=compress&cs=tinysrgb&w=600",
                description: "Stage exceptionnel avec Maître Nguyen Van Duc, 8ème Dang."
              },
              {
                title: "Démonstration Fête de la Ville",
                date: "10 juillet 2023",
                image: "https://images.pexels.com/photos/7045881/pexels-photo-7045881.jpeg?auto=compress&cs=tinysrgb&w=600",
                description: "Démonstration appréciée lors de la fête de la ville."
              }
            ].map((event, index) => (
              <div key={index} className="bg-gray-50 rounded-lg overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{event.date}</p>
                  <p className="text-gray-600">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ne manquez aucun événement</h2>
          <p className="text-xl mb-8">
            Inscrivez-vous à notre newsletter pour être informé des prochains stages et compétitions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-yellow-500 hover:bg-yellow-600 text-black px-6 py-3 rounded-lg font-semibold transition-colors">
              S'inscrire
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;