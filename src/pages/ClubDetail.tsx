import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, Award, ArrowLeft } from 'lucide-react';
import { useClub } from '../context/ClubContext';
import FacebookFeed from '../components/FacebookFeed';

const ClubDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getClub } = useClub();
  
  const club = id ? getClub(id) : null;

  if (!club) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Club non trouvé</h1>
          <Link to="/clubs" className="text-red-600 hover:text-red-800">
            Retour aux clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${club.photos[0]})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/clubs"
            className="inline-flex items-center space-x-2 text-white hover:text-yellow-400 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Retour aux clubs</span>
          </Link>
          
          <div className="text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {club.name}
            </h1>
            <div className="flex items-center space-x-4 text-lg">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>{club.city} ({club.department})</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Club Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">À propos du club</h2>
                <p className="text-gray-600 text-lg leading-relaxed">{club.description}</p>
              </div>

              {/* Specialties */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos spécialités</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {club.specialties.map((specialty, index) => (
                    <div key={index} className="bg-red-50 p-4 rounded-lg text-center">
                      <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{specialty}</h3>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Nos instructeurs</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {club.instructors.map((instructor, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <img
                        src={instructor.photo}
                        alt={instructor.name}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-900">{instructor.name}</h3>
                        <p className="text-red-600 font-medium">{instructor.grade}</p>
                        <p className="text-gray-600 text-sm mt-1">{instructor.bio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {club.photos.length > 1 && (
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Galerie photos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {club.photos.slice(1).map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`Photo ${index + 1}`}
                        className="w-full h-48 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Facebook Feed */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <FacebookFeed posts={club.facebookPosts} clubName={club.name} />
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Contact Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Informations pratiques</h3>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Adresse</h4>
                    <div className="flex items-start space-x-2 text-gray-600">
                      <MapPin className="w-5 h-5 mt-0.5" />
                      <span>{club.address}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Contact</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        <span>{club.phone}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Mail className="w-4 h-4" />
                        <span>{club.email}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Horaires</h4>
                    <div className="space-y-1">
                      {club.schedules.map((schedule, index) => (
                        <div key={index} className="flex items-center space-x-2 text-gray-600">
                          <Clock className="w-4 h-4" />
                          <span>{schedule}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Nous contacter</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-red-500 focus:border-red-500"
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md font-semibold transition-colors"
                  >
                    Envoyer
                  </button>
                </form>
              </div>

              {/* CTA */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Cours d'essai gratuit</h3>
                <p className="text-gray-800 mb-4">
                  Venez découvrir le Vo Dao dans une ambiance conviviale
                </p>
                <Link
                  to="/contact"
                  className="inline-block bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md font-semibold transition-colors"
                >
                  Réserver
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ClubDetail;