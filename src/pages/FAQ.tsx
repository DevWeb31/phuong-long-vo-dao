import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
  category: 'general' | 'practice' | 'equipment' | 'registration';
}

const FAQ: React.FC = () => {
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const faqItems: FAQItem[] = [
    {
      question: "Qu'est-ce que le Vo Dao ?",
      answer: "Le Vo Dao est un art martial sino-vietnamien qui combine techniques de combat, philosophie orientale et développement spirituel. Il intègre les mouvements fluides des animaux avec les principes énergétiques du Qi Gong.",
      category: 'general'
    },
    {
      question: "À partir de quel âge peut-on commencer ?",
      answer: "Nous accueillons les pratiquants à partir de 6 ans. Nos cours sont adaptés à chaque tranche d'âge avec des pédagogies spécifiques pour les enfants, adolescents et adultes.",
      category: 'general'
    },
    {
      question: "Faut-il être en forme physique pour commencer ?",
      answer: "Non, le Vo Dao s'adapte à tous les niveaux de condition physique. Les entraînements progressent graduellement et chacun évolue à son rythme. C'est même un excellent moyen d'améliorer sa condition physique.",
      category: 'practice'
    },
    {
      question: "Quel équipement est nécessaire pour débuter ?",
      answer: "Pour débuter, une tenue de sport confortable suffit. Progressivement, vous pourrez acquérir un kimono traditionnel (vo-phuc). Les protections et armes seront nécessaires uniquement pour les niveaux avancés.",
      category: 'equipment'
    },
    {
      question: "Combien coûte une inscription annuelle ?",
      answer: "Les tarifs varient selon les clubs, généralement entre 200€ et 350€ par an, incluant la licence fédérale. Des tarifs préférentiels existent pour les familles et étudiants. Contactez directement le club de votre choix.",
      category: 'registration'
    },
    {
      question: "Y a-t-il une période d'essai ?",
      answer: "Oui, tous nos clubs proposent un cours d'essai gratuit sans engagement. C'est l'occasion de découvrir l'ambiance du club et de rencontrer les instructeurs.",
      category: 'registration'
    },
    {
      question: "À quelle fréquence faut-il s'entraîner ?",
      answer: "Pour progresser efficacement, nous recommandons 2 à 3 entraînements par semaine. Cependant, même un entraînement hebdomadaire permet de découvrir et apprécier cet art martial.",
      category: 'practice'
    },
    {
      question: "Le Vo Dao est-il dangereux ?",
      answer: "Comme tout art martial, le Vo Dao comporte des risques minimes. L'enseignement privilégie la maîtrise et le contrôle. Les exercices de combat sont très encadrés et progressifs.",
      category: 'practice'
    },
    {
      question: "Où acheter l'équipement nécessaire ?",
      answer: "Nos instructeurs peuvent vous conseiller sur les magasins spécialisés ou les commandes groupées. Il n'est pas nécessaire d'acheter tout l'équipement dès le début.",
      category: 'equipment'
    },
    {
      question: "Peut-on changer de club en cours d'année ?",
      answer: "Oui, il est possible de changer de club au sein de notre fédération. Contactez les responsables des clubs concernés pour organiser le transfert de votre dossier.",
      category: 'registration'
    }
  ];

  const categories = [
    { value: 'all', label: 'Toutes les questions' },
    { value: 'general', label: 'Général' },
    { value: 'practice', label: 'Pratique' },
    { value: 'equipment', label: 'Équipement' },
    { value: 'registration', label: 'Inscription' }
  ];

  const filteredFAQ = activeCategory === 'all' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-purple-900 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            <span className="text-yellow-400">FAQ</span> - Questions Fréquentes
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Toutes les réponses aux questions que vous vous posez sur le Vo Dao
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setActiveCategory(category.value)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  activeCategory === category.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {filteredFAQ.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md border border-gray-200">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {item.question}
                  </h3>
                  {openItems.includes(index) ? (
                    <ChevronUp className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                
                {openItems.includes(index) && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-16 bg-gradient-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8 text-gray-900" />
          </div>
          <h2 className="text-3xl font-bold mb-6">Vous avez d'autres questions ?</h2>
          <p className="text-xl text-gray-300 mb-8">
            Notre équipe est là pour vous renseigner et vous accompagner dans votre démarche
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Nous contacter
            </a>
            <a
              href="tel:0561854230"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-4 rounded-lg font-semibold transition-colors"
            >
              Appeler directement
            </a>
          </div>
        </div>
      </section>

      {/* Quick Start Guide */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comment commencer ?</h2>
            <p className="text-gray-600">Suivez ces étapes simples pour débuter votre parcours martial</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                title: "Choisir un club",
                description: "Sélectionnez le club le plus proche de chez vous",
                color: "bg-red-600"
              },
              {
                step: "2",
                title: "Cours d'essai",
                description: "Participez à un cours gratuit pour découvrir",
                color: "bg-yellow-600"
              },
              {
                step: "3",
                title: "Inscription",
                description: "Complétez votre inscription si l'expérience vous plaît",
                color: "bg-blue-600"
              },
              {
                step: "4",
                title: "Commencer",
                description: "Débutez votre apprentissage du Vo Dao !",
                color: "bg-green-600"
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white font-bold text-2xl">{step.step}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;