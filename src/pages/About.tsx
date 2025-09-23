import React from 'react';
import { Pin as Yin, Heart, Target, Users } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-red-900 to-red-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            À propos du <span className="text-yellow-400">Phuong Long Vo Dao</span>
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Découvrez l'histoire et les valeurs de notre art martial sino-vietnamien
          </p>
        </div>
      </section>

      {/* Histoire */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Histoire du Vo Dao</h2>
              <div className="prose prose-lg text-gray-600 space-y-4">
                <p>
                  Le Vo Dao, littéralement "la voie du combat", est un art martial traditionnel
                  sino-vietnamien qui puise ses racines dans l'histoire millénaire du Vietnam
                  et les influences des arts martiaux chinois.
                </p>
                <p>
                  Développé au fil des siècles par les maîtres vietnamiens, le Vo Dao combine
                  techniques de combat, philosophie orientale, et développement spirituel.
                  Il intègre les mouvements fluides des animaux avec les principes
                  énergétiques du Qi Gong.
                </p>
                <p>
                  Notre fédération Phuong Long, créée en 1985, perpétue cette tradition
                  authentique à travers nos cinq clubs répartis en France, permettant
                  à des centaines de pratiquants de découvrir cet art martial complet.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/7045877/pexels-photo-7045877.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Histoire du Vo Dao"
                className="rounded-lg shadow-lg"
              />
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center">
                <Yin className="w-12 h-12 text-red-900" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophie */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Notre Philosophie</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Le Vo Dao dépasse la simple technique martiale pour devenir un art de vivre
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Respect et Humilité</h3>
              <p className="text-gray-600">
                Le respect de soi, des autres et des traditions forme le socle de notre enseignement.
                L'humilité face à l'apprentissage permet une progression constante.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Persévérance</h3>
              <p className="text-gray-600">
                La voie martiale demande patience et détermination. Chaque entraînement
                est une opportunité de dépassement de soi.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Harmonie</h3>
              <p className="text-gray-600">
                L'équilibre entre corps et esprit, force et souplesse, tradition et modernité
                guide notre pratique quotidienne.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Valeurs */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/7045878/pexels-photo-7045878.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Valeurs du Vo Dao"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Nos Valeurs</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Authenticité</h3>
                    <p className="text-gray-600">
                      Préservation et transmission fidèle des techniques traditionnelles
                      du Vo Dao sino-vietnamien.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Bienveillance</h3>
                    <p className="text-gray-600">
                      Accueil chaleureux et accompagnement personnalisé pour tous les niveaux
                      et tous les âges.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="text-white font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Excellence</h3>
                    <p className="text-gray-600">
                      Recherche constante de la qualité dans l'enseignement et la pratique,
                      avec des instructeurs qualifiés.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Culture Martiale */}
      <section className="py-16 bg-gradient-to-r from-red-50 to-yellow-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Culture Martiale</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="p-6">
              <h3 className="text-xl font-bold text-red-900 mb-4">Formes</h3>
              <p className="text-gray-600">
                Apprentissage des Quyên traditionnels, véritables chorégraphies martiales
                transmises de maître à élève.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-yellow-700 mb-4">Combat</h3>
              <p className="text-gray-600">
                Développement des techniques de combat sportif et traditionnel
                dans le respect mutuel.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-blue-700 mb-4">Armes</h3>
              <p className="text-gray-600">
                Maîtrise des armes traditionnelles : bâton, sabre, épée,
                dans la pure tradition vietnamienne.
              </p>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-green-700 mb-4">Méditation</h3>
              <p className="text-gray-600">
                Intégration de pratiques méditatives et énergétiques
                pour l'équilibre corps-esprit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;