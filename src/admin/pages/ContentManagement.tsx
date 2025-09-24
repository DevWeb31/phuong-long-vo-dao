import React, { useState } from 'react';
import { 
  FileText, 
  Facebook, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  RefreshCw,
  Calendar,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const ContentManagement: React.FC = () => {
  const { clubs, facebookPosts, syncFacebookPosts, publishPost } = useAdmin();
  const [selectedClub, setSelectedClub] = useState('');
  const [contentType, setContentType] = useState<'all' | 'facebook' | 'articles'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredPosts = facebookPosts.filter(post => {
    const matchesClub = !selectedClub || post.clubId === selectedClub;
    const matchesType = contentType === 'all' || 
                       (contentType === 'facebook' && post.isImported) ||
                       (contentType === 'articles' && !post.isImported);
    return matchesClub && matchesType;
  });

  const handleSyncFacebook = async (clubId: string) => {
    try {
      await syncFacebookPosts(clubId);
      toast.success('Synchronisation Facebook réussie');
    } catch (error) {
      toast.error('Erreur lors de la synchronisation');
    }
  };

  const handlePublishPost = async (postId: string) => {
    try {
      await publishPost(postId);
      toast.success('Post publié avec succès');
    } catch (error) {
      toast.error('Erreur lors de la publication');
    }
  };

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Club inconnu';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des contenus</h1>
          <p className="text-gray-600">Articles et synchronisation Facebook</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un article</span>
          </button>
        </div>
      </div>

      {/* Filters and Sync */}
      <div className="admin-card">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="admin-input"
            >
              <option value="">Tous les clubs</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
            
            <select
              value={contentType}
              onChange={(e) => setContentType(e.target.value as any)}
              className="admin-input"
            >
              <option value="all">Tous les contenus</option>
              <option value="facebook">Posts Facebook</option>
              <option value="articles">Articles créés</option>
            </select>
          </div>

          <div className="flex space-x-2">
            {clubs.map(club => (
              <button
                key={club.id}
                onClick={() => handleSyncFacebook(club.id)}
                className="admin-button-secondary flex items-center space-x-2 text-sm"
                title={`Synchroniser ${club.name}`}
              >
                <RefreshCw className="w-4 h-4" />
                <Facebook className="w-4 h-4" />
                <span className="hidden md:inline">{club.department}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div key={post.id} className="admin-card">
            {/* Post Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {post.isImported ? (
                  <Facebook className="w-5 h-5 text-blue-600" />
                ) : (
                  <FileText className="w-5 h-5 text-green-600" />
                )}
                <span className="text-sm font-medium text-gray-600">
                  {getClubName(post.clubId)}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className={`admin-badge ${
                  post.isPublished ? 'admin-badge-success' : 'admin-badge-warning'
                }`}>
                  {post.isPublished ? 'Publié' : 'Brouillon'}
                </span>
              </div>
            </div>

            {/* Post Image */}
            {post.image && (
              <div className="mb-3">
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Post Content */}
            <div className="mb-4">
              <p className="text-sm text-gray-700 line-clamp-3">
                {post.content}
              </p>
            </div>

            {/* Post Meta */}
            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>{new Date(post.date).toLocaleDateString('fr-FR')}</span>
              </div>
              {post.isImported && (
                <div className="flex items-center space-x-4">
                  <span>👍 {post.likes}</span>
                  <span>💬 {post.comments}</span>
                  <span>🔄 {post.shares}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  className="text-green-600 hover:text-green-800"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                {post.isImported && post.facebookPostId && (
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    title="Voir sur Facebook"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                )}
              </div>
              
              {!post.isPublished && (
                <button
                  onClick={() => handlePublishPost(post.id)}
                  className="admin-button-primary text-xs px-3 py-1"
                >
                  Publier
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="admin-card text-center py-12">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun contenu trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Aucun contenu ne correspond aux critères sélectionnés.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary"
          >
            Créer le premier article
          </button>
        </div>
      )}

      {/* Facebook Sync Status */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Statut de synchronisation Facebook
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {clubs.map(club => (
            <div key={club.id} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Facebook className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-medium text-gray-900 mb-1">{club.name}</h4>
              <p className="text-sm text-gray-600 mb-2">
                {facebookPosts.filter(p => p.clubId === club.id && p.isImported).length} posts
              </p>
              <button
                onClick={() => handleSyncFacebook(club.id)}
                className="admin-button-secondary text-xs px-3 py-1 flex items-center space-x-1 mx-auto"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Sync</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Create Article Modal */}
      {showCreateModal && (
        <CreateArticleModal
          clubs={clubs}
          onClose={() => setShowCreateModal(false)}
          onSave={(articleData) => {
            // Handle article creation
            console.log('Creating article:', articleData);
            setShowCreateModal(false);
            toast.success('Article créé avec succès');
          }}
        />
      )}
    </div>
  );
};

const CreateArticleModal: React.FC<{
  clubs: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ clubs, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    clubId: '',
    image: '',
    publishNow: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Créer un article</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="admin-input"
              placeholder="Titre de l'article"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Club *
            </label>
            <select
              required
              value={formData.clubId}
              onChange={(e) => setFormData({...formData, clubId: e.target.value})}
              className="admin-input"
            >
              <option value="">Sélectionner un club</option>
              {clubs.map(club => (
                <option key={club.id} value={club.id}>{club.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (URL)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="admin-input"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={6}
              className="admin-input"
              placeholder="Contenu de l'article..."
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.publishNow}
                onChange={(e) => setFormData({...formData, publishNow: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Publier immédiatement
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
              {formData.publishNow ? 'Créer et publier' : 'Créer en brouillon'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManagement;