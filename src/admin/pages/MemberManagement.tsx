import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Download,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const MemberManagement: React.FC = () => {
  const { members, clubs, getMembers, addMember, updateMember, deleteMember } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesClub = !selectedClub || member.clubId === selectedClub;
    const matchesStatus = !statusFilter || member.status === statusFilter;
    
    return matchesSearch && matchesClub && matchesStatus;
  });

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Club inconnu';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      active: 'admin-badge admin-badge-success',
      inactive: 'admin-badge admin-badge-warning',
      suspended: 'admin-badge admin-badge-error'
    };
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    return (
      <span className={badges[status as keyof typeof badges]}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet adhérent ?')) {
      try {
        await deleteMember(id);
        toast.success('Adhérent supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const exportMembers = () => {
    const csvContent = [
      ['Prénom', 'Nom', 'Email', 'Téléphone', 'Club', 'Statut', 'Type', 'Date d\'inscription'].join(','),
      ...filteredMembers.map(member => [
        member.firstName,
        member.lastName,
        member.email,
        member.phone,
        getClubName(member.clubId),
        member.status,
        member.membershipType,
        member.joinDate
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'adherents.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des adhérents</h1>
          <p className="text-gray-600">{filteredMembers.length} adhérent(s) trouvé(s)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportMembers}
            className="admin-button-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un adhérent</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
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
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actif</option>
            <option value="inactive">Inactif</option>
            <option value="suspended">Suspendu</option>
          </select>
          
          <button className="admin-button-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Members Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Club</th>
                <th>Statut</th>
                <th>Type</th>
                <th>Inscription</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50">
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">
                        {member.firstName} {member.lastName}
                      </div>
                      <div className="text-sm text-gray-500">{member.belt}</div>
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{member.email}</span>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-gray-900">
                      {getClubName(member.clubId)}
                    </span>
                  </td>
                  <td>{getStatusBadge(member.status)}</td>
                  <td>
                    <span className="text-sm text-gray-900 capitalize">
                      {member.membershipType}
                    </span>
                  </td>
                  <td>
                    <span className="text-sm text-gray-900">
                      {new Date(member.joinDate).toLocaleDateString('fr-FR')}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowDetailModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedMember(member);
                          setShowAddModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
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
        
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun adhérent trouvé
            </h3>
            <p className="text-gray-600">
              Aucun adhérent ne correspond aux critères de recherche.
            </p>
          </div>
        )}
      </div>

      {/* Add/Edit Member Modal */}
      {showAddModal && (
        <MemberModal
          member={selectedMember}
          clubs={clubs}
          onClose={() => {
            setShowAddModal(false);
            setSelectedMember(null);
          }}
          onSave={async (memberData) => {
            try {
              if (selectedMember) {
                await updateMember(selectedMember.id, memberData);
                toast.success('Adhérent modifié avec succès');
              } else {
                await addMember(memberData);
                toast.success('Adhérent ajouté avec succès');
              }
              setShowAddModal(false);
              setSelectedMember(null);
            } catch (error) {
              toast.error('Erreur lors de la sauvegarde');
            }
          }}
        />
      )}

      {/* Member Detail Modal */}
      {showDetailModal && selectedMember && (
        <MemberDetailModal
          member={selectedMember}
          club={clubs.find(c => c.id === selectedMember.clubId)}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedMember(null);
          }}
        />
      )}
    </div>
  );
};

// Member Modal Component
const MemberModal: React.FC<{
  member: any;
  clubs: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ member, clubs, onClose, onSave }) => {
  const [formData, setFormData] = useState(member || {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    clubId: '',
    status: 'active',
    membershipType: 'annual',
    birthDate: '',
    address: '',
    emergencyContact: { name: '', phone: '', relation: '' },
    medicalInfo: '',
    belt: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      joinDate: member ? member.joinDate : new Date().toISOString().split('T')[0],
      lastPayment: member ? member.lastPayment : new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {member ? 'Modifier l\'adhérent' : 'Ajouter un adhérent'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                className="admin-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                Statut
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
                className="admin-input"
              >
                <option value="active">Actif</option>
                <option value="inactive">Inactif</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type d'adhésion
              </label>
              <select
                value={formData.membershipType}
                onChange={(e) => setFormData({...formData, membershipType: e.target.value})}
                className="admin-input"
              >
                <option value="annual">Annuelle</option>
                <option value="monthly">Mensuelle</option>
                <option value="trial">Essai</option>
              </select>
            </div>
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
              {member ? 'Modifier' : 'Ajouter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Member Detail Modal Component
const MemberDetailModal: React.FC<{
  member: any;
  club: any;
  onClose: () => void;
}> = ({ member, club, onClose }) => {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            Détails de l'adhérent
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Informations personnelles</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nom:</span> {member.firstName} {member.lastName}</p>
                <p><span className="font-medium">Email:</span> {member.email}</p>
                <p><span className="font-medium">Téléphone:</span> {member.phone}</p>
                <p><span className="font-medium">Date de naissance:</span> {member.birthDate}</p>
                <p><span className="font-medium">Adresse:</span> {member.address}</p>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Informations club</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Club:</span> {club?.name}</p>
                <p><span className="font-medium">Statut:</span> {member.status}</p>
                <p><span className="font-medium">Type:</span> {member.membershipType}</p>
                <p><span className="font-medium">Inscription:</span> {new Date(member.joinDate).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Dernier paiement:</span> {new Date(member.lastPayment).toLocaleDateString('fr-FR')}</p>
                <p><span className="font-medium">Ceinture:</span> {member.belt}</p>
              </div>
            </div>
          </div>

          {member.emergencyContact && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Contact d'urgence</h4>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Nom:</span> {member.emergencyContact.name}</p>
                <p><span className="font-medium">Téléphone:</span> {member.emergencyContact.phone}</p>
                <p><span className="font-medium">Relation:</span> {member.emergencyContact.relation}</p>
              </div>
            </div>
          )}

          {member.medicalInfo && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Informations médicales</h4>
              <p className="text-sm text-gray-700">{member.medicalInfo}</p>
            </div>
          )}

          {member.notes && (
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
              <p className="text-sm text-gray-700">{member.notes}</p>
            </div>
          )}
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

export default MemberManagement;