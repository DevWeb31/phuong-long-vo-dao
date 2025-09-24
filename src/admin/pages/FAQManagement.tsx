import React, { useState } from 'react';
import { 
  HelpCircle, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Search,
  Filter,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const FAQManagement: React.FC = () => {
  const { faqs, clubs, addFAQ, updateFAQ, deleteFAQ } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedFAQ, setSelectedFAQ] = useState<any>(null);

  const categories = ['general', 'practice', 'equipment', 'registration', 'events'];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || faq.category === selectedCategory;
    const matchesClub = !selectedClub || faq.clubId === selectedClub;
    return matchesSearch && matchesCategory && matchesClub && faq.isActive;
  }).sort((a, b) => a.order - b.order);

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      practice: 'Pratique',
      equipment: 'Équipement',
      registration: 'Inscription',
      events: 'Événements'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleDeleteFAQ = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette FAQ ?')) {
      try {
        await deleteFAQ(id);
        toast.success('FAQ supprimée avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const handleReorder = async (id: string, direction: 'up' | 'down') => {
    const faq = faqs.find(f => f.id === id);
    if (!faq) return;

    const newOrder = direction === 'up' ? faq.order - 1 : faq.order + 1;
    
    try {
      await updateFAQ(id, { order: newOrder });
      toast.success('Ordre modifié');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des FAQ</h1>
          <p className="text-gray-600">{filteredFAQs.length} question(s) active(s)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter une FAQ</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {categories.map(category => (
          <div key={category} className="admin-card text-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
              <HelpCircle className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-medium text-gray-900 mb-1">
              {getCategoryLabel(category)}
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {faqs.filter(f => f.category === category && f.isActive).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher dans les FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="admin-input"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
          
          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="admin-input"
          >
            <option value="">Toutes les FAQ</option>
            <option value="general">FAQ générales</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
          
          <button className="admin-button-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* FAQ List */}
      <div className="space-y-4">
        {filteredFAQs.map((faq, index) => (
          <div key={faq.id} className="admin-card">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <span className="admin-badge bg-blue-100 text-blue-800">
                    {getCategoryLabel(faq.category)}
                  </span>
                  {faq.clubId && (
                    <span className="admin-badge bg-green-100 text-green-800">
                      {clubs.find(c => c.id === faq.clubId)?.name || 'Club'}
                    </span>
                  )}
                  <span className="text-sm text-gray-500">
                    Ordre: {faq.order}
                  </span>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {faq.question}
                </h3>
                
                <p className="text-gray-600 line-clamp-2">
                  {faq.answer}
                </p>
                
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>
                    Créé le {new Date(faq.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                  <span>
                    Modifié le {new Date(faq.updatedAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                <div className="flex flex-col space-y-1">
                  <button
                    onClick={() => handleReorder(faq.id, 'up')}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Monter"
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleReorder(faq.id, 'down')}
                    disabled={index === filteredFAQs.length - 1}
                    className="text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Descendre"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedFAQ(faq);
                      setShowCreateModal(true);
                    }}
                    className="text-green-600 hover:text-green-800"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFAQ(faq.id)}
                    className="text-red-600 hover:text-red-800"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredFAQs.length === 0 && (
        <div className="admin-card text-center py-12">
          <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucune FAQ trouvée
          </h3>
          <p className="text-gray-600 mb-4">
            Aucune FAQ ne correspond aux critères sélectionnés.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary"
          >
            Créer la première FAQ
          </button>
        </div>
      )}

      {/* Create/Edit FAQ Modal */}
      {showCreateModal && (
        <FAQModal
          faq={selectedFAQ}
          clubs={clubs}
          categories={categories}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedFAQ(null);
          }}
          onSave={async (faqData) => {
            try {
              if (selectedFAQ) {
                await updateFAQ(selectedFAQ.id, faqData);
                toast.success('FAQ modifiée avec succès');
              } else {
                await addFAQ(faqData);
                toast.success('FAQ créée avec succès');
              }
              setShowCreateModal(false);
              setSelectedFAQ(null);
            } catch (error) {
              toast.error('Erreur lors de la sauvegarde');
            }
          }}
        />
      )}
    </div>
  );
};

// FAQ Modal Component
const FAQModal: React.FC<{
  faq: any;
  clubs: any[];
  categories: string[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ faq, clubs, categories, onClose, onSave }) => {
  const [formData, setFormData] = useState(faq || {
    question: '',
    answer: '',
    category: 'general',
    clubId: '',
    order: 1,
    isActive: true
  });

  const getCategoryLabel = (category: string) => {
    const labels = {
      general: 'Général',
      practice: 'Pratique',
      equipment: 'Équipement',
      registration: 'Inscription',
      events: 'Événements'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {faq ? 'Modifier la FAQ' : 'Créer une FAQ'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Question *
            </label>
            <input
              type="text"
              required
              value={formData.question}
              onChange={(e) => setFormData({...formData, question: e.target.value})}
              className="admin-input"
              placeholder="Quelle est votre question ?"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Réponse *
            </label>
            <textarea
              required
              value={formData.answer}
              onChange={(e) => setFormData({...formData, answer: e.target.value})}
              rows={6}
              className="admin-input"
              placeholder="Réponse détaillée à la question..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Catégorie *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="admin-input"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {getCategoryLabel(category)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club (optionnel)
              </label>
              <select
                value={formData.clubId}
                onChange={(e) => setFormData({...formData, clubId: e.target.value})}
                className="admin-input"
              >
                <option value="">FAQ générale</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ordre d'affichage
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                FAQ active (visible sur le site)
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="admin-button-secondary"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="admin-button-primary"
            >
              {faq ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FAQManagement;