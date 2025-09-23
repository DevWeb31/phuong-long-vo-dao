import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useClub } from '../context/ClubContext';

const Contact: React.FC = () => {
  const { clubs } = useClub();
  const [selectedClub, setSelectedClub] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici on traiterait l'envoi du formulaire
    console.log('Form submitted:', { ...formData, club: selectedClub });
    alert('Message envoyé ! Nous vous répondrons dans les plus brefs délais.');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-indigo-900 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-yellow-400">Contactez-nous</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Une question ? Envie d'essayer ? Nous sommes là pour vous accompagner
          </p>
        </div>
      </section>

      {/* Contact Form and Info */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Club Selection */}
                <div>
                  <label htmlFor="club" className="block text-sm font-medium text-gray-700 mb-2">
                    Club concerné
                  </label>
                  <select
                    id="club"
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value="">Question générale</option>
                    {clubs.map((club) => (
                      <option key={club.id} value={club.id}>
                        {club.name} - {club.city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Personal Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Envoyer le message</span>
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-8">
              {/* General Info */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Informations générales</h2>
                
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <Mail className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Email</h3>
                      <p className="text-gray-600">contact@phuonglong.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <Phone className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Téléphone</h3>
                      <p className="text-gray-600">05 61 85 42 30</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 text-indigo-600 mt-1" />
                    <div>
                      <h3 className="font-semibold text-gray-900">Localisation</h3>
                      <p className="text-gray-600">5 clubs en France</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Contact by Club */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact direct par club</h2>
                
                <div className="space-y-4">
                  {clubs.map((club) => (
                    <div key={club.id} className="border-l-4 border-indigo-500 pl-4">
                      <h3 className="font-semibold text-gray-900">{club.name}</h3>
                      <p className="text-sm text-gray-600">{club.city} ({club.department})</p>
                      <div className="mt-2 space-y-1">
                        <p className="text-sm text-gray-600">{club.phone}</p>
                        <p className="text-sm text-gray-600">{club.email}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hours */}
              <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg p-8 text-gray-900">
                <h2 className="text-2xl font-bold mb-4">Horaires de réponse</h2>
                <p className="mb-4">
                  Nous répondons à vos messages dans les plus brefs délais, généralement sous 24h.
                </p>
                <div className="text-sm">
                  <p><strong>Lundi - Vendredi :</strong> 9h - 18h</p>
                  <p><strong>Samedi :</strong> 9h - 12h</p>
                  <p><strong>Dimanche :</strong> Fermé</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map placeholder or additional info */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Nos clubs à travers la France</h2>
            <p className="text-gray-600">Trouvez le club le plus proche de chez vous</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {clubs.map((club) => (
              <div key={club.id} className="text-center p-6 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">{club.department}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{club.city}</h3>
                <p className="text-sm text-gray-600 mb-3">{club.name}</p>
                <a
                  href={`/club/${club.id}`}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                >
                  Voir le club →
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;