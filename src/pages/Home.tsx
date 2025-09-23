import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Calendar, MapPin } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import FacebookFeed from '../components/FacebookFeed';

const Home: React.FC = () => {
  const { clubs, events } = useClub();
  
  // Agrégation de tous les posts Facebook des clubs
  const allFacebookPosts = clubs.flatMap(club => 
    club.facebookPosts.map(post => ({
      ...post,
      clubName: club.name
    }))
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/7045876/pexels-photo-7045876.jpeg?auto=compress&cs=tinysrgb&w=1600)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-red-900/50 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-yellow-400">Phuong Long</span>
            <br />
            <span className="text-white">Vo Dao</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto">
            Découvrez l'art martial sino-vietnamien authentique à travers nos 5 clubs en France
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/clubs"
              className="bg-red-600 hover:bg-red-700 px-8 py-4 rounded-lg text-white font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <Users className="w-5 h-5" />
              <span>Découvrir nos clubs</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 px-8 py-4 rounded-lg text-black font-semibold transition-all duration-300 flex items-center space-x-2 transform hover:scale-105"
            >
              <span>S'inscrire</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">5</h3>
              <p className="text-gray-600">Clubs actifs</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">200+</h3>
              <p className="text-gray-600">Pratiquants</p>
            </div>
            <div className="p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">35+</h3>
              <p className="text-gray-600">Années d'expérience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Facebook Feed Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Actualités de nos clubs
          </h2>
          <FacebookFeed posts={allFacebookPosts} />
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Prochains événements</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Ne manquez pas nos stages, compétitions et démonstrations à venir
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {events.slice(0, 2).map((event) => (
              <div key={event.id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      event.type === 'competition' ? 'bg-red-100 text-red-800' :
                      event.type === 'stage' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {event.type === 'competition' ? 'Compétition' :
                       event.type === 'stage' ? 'Stage' : 'Démonstration'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <div className="text-gray-600 mb-4">
                    <p>{new Date(event.date).toLocaleDateString('fr-FR')} à {event.time}</p>
                    <p>{event.location}</p>
                  </div>
                  <p className="text-gray-700">{event.description}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Link 
              to="/events"
              className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              <span>Voir tous les événements</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;