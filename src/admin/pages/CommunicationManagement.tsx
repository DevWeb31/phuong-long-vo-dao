import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Users,
  Calendar,
  BarChart3,
  Filter
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const CommunicationManagement: React.FC = () => {
  const { communications, clubs, members, sendCommunication } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedCommunication, setSelectedCommunication] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const filteredCommunications = communications.filter(comm => {
    const matchesType = !filterType || comm.type === filterType;
    const matchesStatus = !filterStatus || comm.status === filterStatus;
    return matchesType && matchesStatus;
  });

  const getTypeLabel = (type: string) => {
    const labels = {
      newsletter: 'Newsletter',
      notification: 'Notification',
      announcement: 'Annonce'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      newsletter: 'bg-blue-100 text-blue-800',
      notification: 'bg-yellow-100 text-yellow-800',
      announcement: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || 'bg-white/10 text-white border border-white/20';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      sent: 'admin-badge-success',
      draft: 'admin-badge-warning',
      scheduled: 'admin-badge admin-badge-warning'
    };
    return colors[status as keyof typeof colors] || 'admin-badge';
  };

  const getStatusLabel = (status: string) => {
    const labels = {
      sent: 'Envoyé',
      draft: 'Brouillon',
      scheduled: 'Programmé'
    };
    return labels[status as keyof typeof labels] || status;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Gestion des communications</h1>
          <p className="text-white/70">Newsletters, notifications et annonces</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nouvelle communication</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <Mail className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Total envoyés</p>
              <p className="text-2xl font-semibold text-white">
                {communications.filter(c => c.status === 'sent').length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Destinataires</p>
              <p className="text-2xl font-semibold text-white">
                {members.length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Programmés</p>
              <p className="text-2xl font-semibold text-white">
                {communications.filter(c => c.status === 'scheduled').length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-500">
              <BarChart3 className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-white/80">Taux d'ouverture</p>
              <p className="text-2xl font-semibold text-white">
                {communications.length > 0 
                  ? Math.round(communications.reduce((acc, c) => acc + c.openRate, 0) / communications.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les types</option>
            <option value="newsletter">Newsletter</option>
            <option value="notification">Notification</option>
            <option value="announcement">Annonce</option>
          </select>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les statuts</option>
            <option value="sent">Envoyé</option>
            <option value="draft">Brouillon</option>
            <option value="scheduled">Programmé</option>
          </select>
          
          <button className="admin-button-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Communications List */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Statut</th>
                <th>Destinataires</th>
                <th>Date d'envoi</th>
                <th>Taux d'ouverture</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredCommunications.map((comm) => (
                <tr key={comm.id} className="hover:bg-gray-50">
                  <td>
                    <div className="font-medium text-white">{comm.title}</div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getTypeColor(comm.type)}`}>
                      {getTypeLabel(comm.type)}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusColor(comm.status)}>
                      {getStatusLabel(comm.status)}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4 text-white/60" />
                      <span>{comm.recipients.length}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-white">
                      {comm.status === 'sent' 
                        ? new Date(comm.sentAt).toLocaleDateString('fr-FR')
                        : comm.scheduledFor 
                          ? new Date(comm.scheduledFor).toLocaleDateString('fr-FR')
                          : '-'
                      }
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${comm.openRate}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{comm.openRate}%</span>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedCommunication(comm);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {comm.status === 'draft' && (
                        <button
                          onClick={() => {
                            setSelectedCommunication(comm);
                            setShowCreateModal(true);
                          }}
                          className="text-green-600 hover:text-green-800"
                          title="Modifier"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredCommunications.length === 0 && (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucune communication trouvée
            </h3>
            <p className="text-gray-600">
              Aucune communication ne correspond aux critères sélectionnés.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Communication Modal */}
      {showCreateModal && (
        <CommunicationModal
          communication={selectedCommunication}
          clubs={clubs}
          members={members}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedCommunication(null);
          }}
          onSave={async (commData) => {
            try {
              await sendCommunication(commData);
              toast.success('Communication créée avec succès');
              setShowCreateModal(false);
              setSelectedCommunication(null);
            } catch (error) {
              toast.error('Erreur lors de la création');
            }
          }}
        />
      )}

      {/* Communication Detail Modal */}
      {showDetailModal && selectedCommunication && (
        <CommunicationDetailModal
          communication={selectedCommunication}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedCommunication(null);
          }}
        />
      )}
    </div>
  );
};

// Communication Modal Component
const CommunicationModal: React.FC<{
  communication: any;
  clubs: any[];
  members: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ communication, clubs, members, onClose, onSave }) => {
  const [formData, setFormData] = useState(communication || {
    title: '',
    content: '',
    type: 'newsletter',
    recipients: [],
    clubIds: [],
    status: 'draft',
    scheduledFor: ''
  });

  const [recipientType, setRecipientType] = useState<'all' | 'clubs' | 'custom'>('all');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let recipients = [];
    if (recipientType === 'all') {
      recipients = members.map(m => m.id);
    } else if (recipientType === 'clubs') {
      recipients = members.filter(m => formData.clubIds.includes(m.clubId)).map(m => m.id);
    } else {
      recipients = formData.recipients;
    }

    onSave({
      ...formData,
      recipients,
      status: formData.scheduledFor ? 'scheduled' : (formData.status === 'sent' ? 'sent' : 'draft')
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {communication ? 'Modifier la communication' : 'Nouvelle communication'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="admin-input"
              >
                <option value="newsletter">Newsletter</option>
                <option value="notification">Notification</option>
                <option value="announcement">Annonce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contenu *
            </label>
            <textarea
              required
              value={formData.content}
              onChange={(e) => setFormData({...formData, content: e.target.value})}
              rows={8}
              className="admin-input"
              placeholder="Contenu de la communication..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Destinataires
            </label>
            <div className="space-y-3">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recipientType"
                  value="all"
                  checked={recipientType === 'all'}
                  onChange={(e) => setRecipientType(e.target.value as any)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span>Tous les adhérents ({members.length})</span>
              </label>
              
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="recipientType"
                  value="clubs"
                  checked={recipientType === 'clubs'}
                  onChange={(e) => setRecipientType(e.target.value as any)}
                  className="text-red-600 focus:ring-red-500"
                />
                <span>Par clubs</span>
              </label>
              
              {recipientType === 'clubs' && (
                <div className="ml-6 space-y-2">
                  {clubs.map(club => (
                    <label key={club.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.clubIds.includes(club.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({
                              ...formData,
                              clubIds: [...formData.clubIds, club.id]
                            });
                          } else {
                            setFormData({
                              ...formData,
                              clubIds: formData.clubIds.filter((id: string) => id !== club.id)
                            });
                          }
                        }}
                        className="text-red-600 focus:ring-red-500"
                      />
                      <span>{club.name} ({members.filter(m => m.clubId === club.id).length})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Programmer l'envoi (optionnel)
            </label>
            <input
              type="datetime-local"
              value={formData.scheduledFor}
              onChange={(e) => setFormData({...formData, scheduledFor: e.target.value})}
              className="admin-input"
            />
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
              onClick={() => setFormData({...formData, status: 'draft'})}
              className="admin-button-secondary"
            >
              Sauvegarder en brouillon
            </button>
            <button
              type="submit"
              onClick={() => setFormData({...formData, status: 'sent'})}
              className="admin-button-primary flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Envoyer maintenant</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Communication Detail Modal Component
const CommunicationDetailModal: React.FC<{
  communication: any;
  onClose: () => void;
}> = ({ communication, onClose }) => {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Détails de la communication</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{communication.title}</h4>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span className={`admin-badge ${getTypeColor(communication.type)}`}>
                {getTypeLabel(communication.type)}
              </span>
              <span>•</span>
              <span>{communication.recipients.length} destinataires</span>
              <span>•</span>
              <span>{new Date(communication.sentAt).toLocaleDateString('fr-FR')}</span>
            </div>
          </div>

          <div>
            <h5 className="font-medium text-gray-900 mb-3">Contenu</h5>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">{communication.content}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Statistiques</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Taux d'ouverture:</span>
                  <span className="font-medium">{communication.openRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Taux de clic:</span>
                  <span className="font-medium">{communication.clickRate}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Destinataires:</span>
                  <span className="font-medium">{communication.recipients.length}</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Informations</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Statut:</span>
                  <span className={getStatusColor(communication.status)}>
                    {getStatusLabel(communication.status)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Envoyé par:</span>
                  <span className="font-medium">{communication.sentBy}</span>
                </div>
                <div className="flex justify-between">
                  <span>Date d'envoi:</span>
                  <span className="font-medium">
                    {new Date(communication.sentAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="admin-button-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper functions (moved outside component to avoid re-declaration)
const getTypeColor = (type: string) => {
  const colors = {
    newsletter: 'bg-blue-100 text-blue-800',
    notification: 'bg-yellow-100 text-yellow-800',
    announcement: 'bg-green-100 text-green-800'
  };
  return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
};

const getTypeLabel = (type: string) => {
  const labels = {
    newsletter: 'Newsletter',
    notification: 'Notification',
    announcement: 'Annonce'
  };
  return labels[type as keyof typeof labels] || type;
};

const getStatusColor = (status: string) => {
  const colors = {
    sent: 'admin-badge admin-badge-success',
    draft: 'admin-badge admin-badge-warning',
    scheduled: 'admin-badge admin-badge-warning'
  };
  return colors[status as keyof typeof colors] || 'admin-badge';
};

const getStatusLabel = (status: string) => {
  const labels = {
    sent: 'Envoyé',
    draft: 'Brouillon',
    scheduled: 'Programmé'
  };
  return labels[status as keyof typeof labels] || status;
};

export default CommunicationManagement;