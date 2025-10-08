import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  AlertTriangle,
  Info,
  Download,
  Upload,
  UserCheck,
  Calendar,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  FileText
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { supabase } from '../../config/supabase';
import toast from 'react-hot-toast';
import AdminTable from '../components/AdminTable';
import PlusActionsMenu from '../components/PlusActionsMenu';

interface Member {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  birth_date: string | null;
  club_id: string | null;
  status: 'active' | 'inactive' | 'suspended';
  season: string | null;
  membership_start_date: string | null;
  membership_end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Fonction pour générer les saisons disponibles (à partir de 2025-2026)
const generateSeasons = (): string[] => {
  const currentYear = new Date().getFullYear();
  const minYear = 2025; // Année minimale
  const seasons: string[] = [];
  
  // Déterminer l'année de départ (2025 ou année courante si plus tard)
  const startYear = Math.max(minYear, currentYear);
  
  // Générer les saisons pour les 5 prochaines années à partir de startYear
  for (let i = 0; i < 5; i++) {
    const year = startYear + i;
    seasons.push(`${year}-${year + 1}`);
  }
  
  return seasons;
};

const MemberManagement: React.FC = () => {
  const { user: currentUser, clubs } = useAdmin();
  
  // Vérifier les permissions d'accès
  const hasMembersPermission = currentUser?.permissions?.includes('members') || currentUser?.permissions?.includes('all');

  if (!hasMembersPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accès non autorisé</h1>
          <p className="text-white/70 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à la gestion des adhérents.
          </p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retour au dashboard
          </a>
        </div>
      </div>
    );
  }

  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [memberToView, setMemberToView] = useState<Member | null>(null);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [memberToToggle, setMemberToToggle] = useState<Member | null>(null);

  // Charger les adhérents
  const loadMembers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des adhérents:', error);
      toast.error('Erreur lors du chargement des adhérents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMembers();
  }, []);

  // Fermer les filtres mobiles en cliquant en dehors
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showMobileFilters) {
        const target = event.target as Element;
        const filtersPanel = target.closest('.mobile-filters-panel');
        const filtersButton = target.closest('[data-filters-button]');
        
        if (!filtersPanel && !filtersButton) {
          setShowMobileFilters(false);
        }
      }
    };

    if (showMobileFilters) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showMobileFilters]);

  // Filtrer les adhérents
  const filteredMembers = members.filter(member => {
    const searchWords = searchTerm.toLowerCase().split(' ').filter(word => word.length > 0);
    const matchesSearch = searchWords.length === 0 || searchWords.every(word =>
      member.first_name.toLowerCase().includes(word) ||
      member.last_name.toLowerCase().includes(word) ||
      member.email?.toLowerCase().includes(word) ||
      member.phone?.toLowerCase().includes(word)
    );

    const matchesClub = !selectedClub || member.club_id === selectedClub;
    const matchesStatus = !statusFilter || member.status === statusFilter;

    return matchesSearch && matchesClub && matchesStatus;
  });

  const getStatusLabel = (status: string) => {
    const labels = {
      active: 'Actif',
      inactive: 'Inactif',
      suspended: 'Suspendu'
    };
    return labels[status as keyof typeof labels] || status;
  };

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const handleToggleStatusClick = (member: Member) => {
    setMemberToToggle(member);
    setShowToggleStatusModal(true);
  };

  const confirmToggleStatus = async (newStatus: 'active' | 'inactive' | 'suspended') => {
    if (!memberToToggle) return;

    try {
      const { error } = await supabase
        .from('members')
        .update({ status: newStatus })
        .eq('id', memberToToggle.id);

      if (error) throw error;

      const statusMessages = {
        active: 'Adhérent activé',
        inactive: 'Adhérent désactivé',
        suspended: 'Adhérent suspendu'
      };

      toast.success(statusMessages[newStatus]);
      await loadMembers();
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error);
      toast.error('Erreur lors du changement de statut');
    } finally {
      setShowToggleStatusModal(false);
      setMemberToToggle(null);
    }
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;

    try {
      const { error } = await supabase
        .from('members')
        .delete()
        .eq('id', memberToDelete.id);

      if (error) throw error;

      toast.success('Adhérent supprimé avec succès');
      await loadMembers();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error('Erreur lors de la suppression');
    } finally {
      setShowDeleteModal(false);
      setMemberToDelete(null);
    }
  };

  const handleExport = (format: 'csv' | 'json') => {
    if (filteredMembers.length === 0) {
      toast.error('Aucun adhérent à exporter');
      return;
    }

    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `adherents-${timestamp}.${format}`;

    if (format === 'json') {
      const dataStr = JSON.stringify(filteredMembers, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    } else {
      const headers = ['Prénom', 'Nom', 'Email', 'Téléphone', 'Club', 'Statut', 'Saison'];
      const csvContent = [
        headers.join(','),
        ...filteredMembers.map(member => [
          member.first_name,
          member.last_name,
          member.email || '',
          member.phone || '',
          clubs.find(c => c.id === member.club_id)?.name || '',
          getStatusLabel(member.status),
          member.season || ''
        ].map(value => 
          typeof value === 'string' && value.includes(',') 
            ? `"${value.replace(/"/g, '""')}"` 
            : value
        ).join(','))
      ].join('\n');

      const dataUri = 'data:text/csv;charset=utf-8,'+ encodeURIComponent(csvContent);
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', filename);
      linkElement.click();
    }

    toast.success(`${filteredMembers.length} adhérent(s) exporté(s) en ${format.toUpperCase()}`);
  };

  const getMemberStats = () => {
    const total = members.length;
    const active = members.filter(m => m.status === 'active').length;
    const inactive = members.filter(m => m.status === 'inactive').length;
    const suspended = members.filter(m => m.status === 'suspended').length;

    return { total, active, inactive, suspended };
  };

  const stats = getMemberStats();

  return (
    <div className="space-y-6">
      {/* En-tête: bouton + à gauche | séparateur | cartes info à droite */}
      <div className="flex items-stretch justify-between">
        <div className="flex items-stretch">
          <PlusActionsMenu
            buttonTitle="Actions Adhérents"
            buttonClassName="h-12"
            actions={[
              { label: 'Exporter en CSV', onClick: () => handleExport('csv') },
              { label: 'Exporter en JSON', onClick: () => handleExport('json') },
              { label: 'Ajouter un adhérent', onClick: () => setShowCreateModal(true) },
            ]}
          />
          <div className="self-center h-6 w-px bg-white/20 mx-4" />
        </div>
        <div className="flex-1 flex items-stretch space-x-3">
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-white leading-none">{stats.total}</p>
            <p className="text-xs text-white/60 mt-0.5">Total</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-green-400 leading-none">{stats.active}</p>
            <p className="text-xs text-white/60 mt-0.5">Actifs</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-gray-400 leading-none">{stats.inactive}</p>
            <p className="text-xs text-white/60 mt-0.5">Inactifs</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-red-400 leading-none">{stats.suspended}</p>
            <p className="text-xs text-white/60 mt-0.5">Suspendus</p>
          </div>
        </div>
      </div>

      {/* Table Desktop */}
      <div className="hidden lg:block">
        <AdminTable
          headers={[
            'Nom',
            'Contact',
            'Club',
            <span key="statut" className="text-center block">Statut</span>,
            <span key="saison" className="text-center block">Saison</span>,
            <span key="actions" className="text-right block">Actions</span>
          ]}
          filtersContent={(
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Club</label>
                <select
                  value={selectedClub}
                  onChange={(e) => setSelectedClub(e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="">Tous les clubs</option>
                  {clubs.map(club => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Statut</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="admin-input w-full"
                >
                  <option value="">Tous les statuts</option>
                  <option value="active">Actif</option>
                  <option value="inactive">Inactif</option>
                  <option value="suspended">Suspendu</option>
                </select>
              </div>
            </div>
          )}
          footerLeft={(
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="admin-input pl-10 h-9 w-80"
                />
              </div>
              <div className="h-6 w-px bg-white/20"></div>
              <span className="text-sm text-white/70">{filteredMembers.length} {filteredMembers.length <= 1 ? 'résultat trouvé' : 'résultats trouvés'}</span>
              <>
                <div className="h-6 w-px bg-white/20"></div>
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <span className="px-2 py-1 bg-white/10 rounded border border-white/20">
                    Club: {selectedClub ? (clubs.find(c => c.id === selectedClub)?.name || selectedClub) : 'Tous'}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded border border-white/20">
                    Statut: {statusFilter ? getStatusLabel(statusFilter) : 'Tous'}
                  </span>
                </div>
              </>
            </div>
          )}
          bodyHeightClass="h-[calc(100vh-223px)]"
          wrapperMaxHeightClass="max-h-[calc(100vh-183px)]"
        >
          {filteredMembers.map((member) => (
            <tr 
              key={member.id} 
              className="cursor-pointer hover:bg-gray-800/30 transition-colors"
              onClick={() => {
                setMemberToView(member);
                setShowDetailModal(true);
              }}
              title="Cliquer pour voir les détails"
            >
              {/* Nom */}
              <td>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">
                      {member.first_name[0]}{member.last_name[0]}
                    </span>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">
                      {member.first_name} {member.last_name}
                    </div>
                    {member.birth_date && (
                      <div className="text-xs text-white/60">
                        Né(e) le {new Date(member.birth_date).toLocaleDateString('fr-FR')}
                      </div>
                    )}
                  </div>
                </div>
              </td>
              
              {/* Contact */}
              <td>
                <div className="space-y-1">
                  {member.email && (
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Mail className="w-3 h-3 text-white/60" />
                      <span>{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Phone className="w-3 h-3 text-white/60" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </td>
              
              {/* Club */}
              <td>
                {member.club_id ? (
                  <span className="admin-badge bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {clubs.find(c => c.id === member.club_id)?.name || 'Club inconnu'}
                  </span>
                ) : (
                  <span className="admin-badge bg-gray-500/20 text-gray-300 border border-gray-500/30">
                    Aucun club
                  </span>
                )}
              </td>
              
              {/* Statut */}
              <td className="text-center">
                <div className="relative group flex justify-center items-center">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 
                    member.status === 'inactive' ? 'bg-red-500' : 
                    'bg-orange-500'
                  }`} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                    Adhérent {getStatusLabel(member.status).toLowerCase()}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </td>
              
              {/* Saison */}
              <td className="text-center">
                {member.season ? (
                  <span className="admin-badge bg-purple-500/20 text-purple-300 border border-purple-500/30">
                    {member.season}
                  </span>
                ) : (
                  <span className="text-white/40 text-sm">Non définie</span>
                )}
              </td>
              
              {/* Actions */}
              <td className="text-right">
                <div className="flex items-center justify-end space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedMember(member);
                      setShowCreateModal(true);
                    }}
                    className="text-green-400 hover:text-green-300 transition-colors p-1"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleStatusClick(member);
                    }}
                    className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                    title="Modifier le statut"
                  >
                    <UserCheck className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(member);
                    }}
                    className="text-red-400 hover:text-red-300 transition-colors p-1"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </AdminTable>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-4">
        {/* Compact Search bar with overlay filters */}
        <div className="relative">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/80 w-4 h-4 z-10" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10 w-full h-10"
              />
            </div>
            <button
              onClick={() => setShowMobileFilters(v => !v)}
              className={`px-3 h-10 text-sm font-medium rounded-lg border transition-colors ${showMobileFilters ? 'bg-yellow-500 text-gray-900 border-yellow-400' : 'bg-white/10 text-white border-white/20'}`}
              title="Filtres"
              data-filters-button
            >
              Filtres
            </button>
          </div>
          
          {/* Info discrète sous le champ de recherche */}
          <div className="flex items-center justify-between mt-2 px-1">
            <span className="text-xs text-white/50">
              {filteredMembers.length} {filteredMembers.length <= 1 ? 'résultat' : 'résultats'}
            </span>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/60">
                {selectedClub ? (clubs.find(c => c.id === selectedClub)?.name || 'Club') : 'Tous'}
              </span>
              <span className="px-1.5 py-0.5 bg-white/5 rounded text-white/60">
                {statusFilter ? getStatusLabel(statusFilter) : 'Tous'}
              </span>
            </div>
          </div>

          {showMobileFilters && (
            <div className="mobile-filters-panel absolute left-0 right-0 top-full mt-2 admin-card p-4 space-y-3 z-50">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Club</label>
                  <select
                    value={selectedClub}
                    onChange={(e) => setSelectedClub(e.target.value)}
                    className="admin-input w-full h-11"
                  >
                    <option value="">Tous les clubs</option>
                    {clubs.map(club => (
                      <option key={club.id} value={club.id}>{club.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Statut</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="admin-input w-full h-11"
                  >
                    <option value="">Tous les statuts</option>
                    <option value="active">Actif</option>
                    <option value="inactive">Inactif</option>
                    <option value="suspended">Suspendu</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Member Cards */}
        <div className="space-y-3 max-h-[calc(100vh-220px)] overflow-y-auto admin-table-container pb-6">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="admin-card p-4 cursor-pointer hover:bg-white/5 transition-all"
              onClick={() => {
                setMemberToView(member);
                setShowDetailModal(true);
              }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-sm">
                      {member.first_name[0]}{member.last_name[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-white font-medium text-sm truncate">
                      {member.first_name} {member.last_name}
                    </h3>
                    {member.email && (
                      <p className="text-white/60 text-xs truncate">{member.email}</p>
                    )}
                  </div>
                </div>
                <div className="relative group flex items-center flex-shrink-0 ml-2">
                  <div className={`w-3 h-3 rounded-full ${
                    member.status === 'active' ? 'bg-green-500' : 
                    member.status === 'inactive' ? 'bg-red-500' : 
                    'bg-orange-500'
                  }`} />
                  {/* Tooltip */}
                  <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                    Adhérent {getStatusLabel(member.status).toLowerCase()}
                    <div className="absolute top-full right-2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                {member.club_id && (
                  <span className="admin-badge bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs">
                    {clubs.find(c => c.id === member.club_id)?.name || 'Club'}
                  </span>
                )}
                {member.season && (
                  <span className="admin-badge bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs">
                    📅 {member.season}
                  </span>
                )}
                {member.phone && (
                  <span className="admin-badge bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs">
                    📱 {member.phone}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-white/10">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedMember(member);
                    setShowCreateModal(true);
                  }}
                  className="text-green-400 hover:text-green-300 p-2"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatusClick(member);
                  }}
                  className="text-blue-400 hover:text-blue-300 p-2"
                  title="Modifier le statut"
                >
                  <UserCheck className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(member);
                  }}
                  className="text-red-400 hover:text-red-300 p-2"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Message si aucun adhérent */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-white/60 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            Aucun adhérent trouvé
          </h3>
          <p className="text-white/70">
            Essayez de modifier vos filtres ou créez un nouvel adhérent.
          </p>
        </div>
      )}

      {/* Create/Edit Member Modal */}
      {showCreateModal && (
        <MemberModal
          member={selectedMember}
          clubs={clubs}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedMember(null);
          }}
          onSave={async (memberData) => {
            try {
              if (selectedMember) {
                const { error } = await supabase
                  .from('members')
                  .update(memberData)
                  .eq('id', selectedMember.id);

                if (error) throw error;
                toast.success('Adhérent modifié avec succès');
              } else {
                const { error } = await supabase
                  .from('members')
                  .insert([memberData]);

                if (error) throw error;
                toast.success('Adhérent ajouté avec succès');
              }
              
              await loadMembers();
              setShowCreateModal(false);
              setSelectedMember(null);
            } catch (error) {
              console.error('Erreur:', error);
              toast.error('Erreur lors de la sauvegarde');
            }
          }}
        />
      )}

      {/* Member Detail Modal */}
      {showDetailModal && memberToView && (
        <MemberDetailModal
          member={memberToView}
          club={clubs.find(c => c.id === memberToView.club_id)}
          onClose={() => {
            setShowDetailModal(false);
            setMemberToView(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && memberToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Confirmer la suppression</h3>
                <p className="text-white/60 text-sm">Cette action est irréversible</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-white mb-2">
                Êtes-vous sûr de vouloir supprimer cet adhérent ?
              </p>
              <div className="bg-gray-800/50 rounded-lg p-3 border border-white/10">
                <p className="text-white font-medium text-sm">
                  {memberToDelete.first_name} {memberToDelete.last_name}
                </p>
                {memberToDelete.email && (
                  <p className="text-white/60 text-sm">{memberToDelete.email}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setMemberToDelete(null);
                }}
                className="flex-1 px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Status Modal */}
      {showToggleStatusModal && memberToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-lg w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <UserCheck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Modifier le statut</h3>
                <p className="text-white/60 text-sm">Choisissez le nouveau statut de l'adhérent</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="bg-gray-800/50 rounded-lg p-3 border border-white/10 mb-4">
                <p className="text-white font-medium text-sm">
                  {memberToToggle.first_name} {memberToToggle.last_name}
                </p>
                {memberToToggle.email && (
                  <p className="text-white/60 text-sm">{memberToToggle.email}</p>
                )}
                <p className="text-white/40 text-xs mt-1">
                  Statut actuel : {getStatusLabel(memberToToggle.status)}
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => confirmToggleStatus('active')}
                  disabled={memberToToggle.status === 'active'}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    memberToToggle.status === 'active'
                      ? 'bg-green-500/20 border-green-500/50 cursor-not-allowed opacity-60'
                      : 'bg-green-500/10 border-green-500/30 hover:bg-green-500/20 hover:border-green-500/50'
                  }`}
                >
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <div className="text-left flex-1">
                    <div className="text-green-300 font-medium">Actif</div>
                    <div className="text-green-400/70 text-sm">L'adhérent est actif dans le club</div>
                  </div>
                  {memberToToggle.status === 'active' && (
                    <div className="text-green-400 text-xs">(Actuel)</div>
                  )}
                </button>

                <button
                  onClick={() => confirmToggleStatus('inactive')}
                  disabled={memberToToggle.status === 'inactive'}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    memberToToggle.status === 'inactive'
                      ? 'bg-red-500/20 border-red-500/50 cursor-not-allowed opacity-60'
                      : 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500/50'
                  }`}
                >
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <div className="text-left flex-1">
                    <div className="text-red-300 font-medium">Inactif</div>
                    <div className="text-red-400/70 text-sm">L'adhérent n'est plus actif</div>
                  </div>
                  {memberToToggle.status === 'inactive' && (
                    <div className="text-red-400 text-xs">(Actuel)</div>
                  )}
                </button>

                <button
                  onClick={() => confirmToggleStatus('suspended')}
                  disabled={memberToToggle.status === 'suspended'}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                    memberToToggle.status === 'suspended'
                      ? 'bg-orange-500/20 border-orange-500/50 cursor-not-allowed opacity-60'
                      : 'bg-orange-500/10 border-orange-500/30 hover:bg-orange-500/20 hover:border-orange-500/50'
                  }`}
                >
                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <div className="text-left flex-1">
                    <div className="text-orange-300 font-medium">Suspendu</div>
                    <div className="text-orange-400/70 text-sm">L'adhérent est temporairement suspendu</div>
                  </div>
                  {memberToToggle.status === 'suspended' && (
                    <div className="text-orange-400 text-xs">(Actuel)</div>
                  )}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  setShowToggleStatusModal(false);
                  setMemberToToggle(null);
                }}
                className="px-4 py-2 text-white/70 hover:text-white border border-white/20 rounded-lg hover:border-white/30 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Member Modal Component
const MemberModal: React.FC<{
  member: Member | null;
  clubs: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ member, clubs, onClose, onSave }) => {
  const availableSeasons = generateSeasons();
  
  const [formData, setFormData] = useState({
    first_name: member?.first_name || '',
    last_name: member?.last_name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    birth_date: member?.birth_date || '',
    club_id: member?.club_id || '',
    season: member?.season || ''
  });

  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'Le prénom est obligatoire';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Le nom est obligatoire';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    // Préparer les données en nettoyant les champs vides
    const dataToSave: any = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email || null,
      phone: formData.phone || null,
      birth_date: formData.birth_date || null,
      club_id: formData.club_id || null,
      season: formData.season || null
    };

    // Pour les nouveaux adhérents, définir le statut par défaut à "active"
    if (!member) {
      dataToSave.status = 'active';
    }

    onSave(dataToSave);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            {member ? 'Modifier l\'adhérent' : 'Ajouter un adhérent'}
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Prénom *
              </label>
              <input
                type="text"
                required
                value={formData.first_name}
                onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                className={`admin-input ${errors.first_name ? 'border-red-500' : ''}`}
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm mt-1">{errors.first_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Nom *
              </label>
              <input
                type="text"
                required
                value={formData.last_name}
                onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                className={`admin-input ${errors.last_name ? 'border-red-500' : ''}`}
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm mt-1">{errors.last_name}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className={`admin-input ${errors.email ? 'border-red-500' : ''}`}
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Date de naissance
              </label>
              <input
                type="date"
                value={formData.birth_date}
                onChange={(e) => setFormData({...formData, birth_date: e.target.value})}
                className="admin-input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">
                Club
              </label>
              <select
                value={formData.club_id}
                onChange={(e) => setFormData({...formData, club_id: e.target.value})}
                className="admin-input"
              >
                <option value="">Aucun club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Saison
            </label>
            <select
              value={formData.season}
              onChange={(e) => setFormData({...formData, season: e.target.value})}
              className="admin-input"
            >
              <option value="">Aucune saison</option>
              {availableSeasons.map(season => (
                <option key={season} value={season}>{season}</option>
              ))}
            </select>
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
  member: Member;
  club: any;
  onClose: () => void;
}> = ({ member, club, onClose }) => {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-white">
            Détails de l'adhérent
          </h3>
          <button onClick={onClose} className="text-white/60 hover:text-white">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Header avec avatar */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg border border-white/10">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">
                {member.first_name[0]}{member.last_name[0]}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">
                {member.first_name} {member.last_name}
              </h2>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`admin-badge ${
                  member.status === 'active' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                  member.status === 'inactive' ? 'bg-gray-500/20 text-gray-300 border-gray-500/30' :
                  'bg-red-500/20 text-red-300 border-red-500/30'
                } border text-sm`}>
                  {member.status === 'active' ? 'Actif' : member.status === 'inactive' ? 'Inactif' : 'Suspendu'}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-400" />
                <span>Informations personnelles</span>
              </h4>
              <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
                {member.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-white/60" />
                    <div>
                      <p className="text-xs text-white/60">Email</p>
                      <p className="text-sm text-white">{member.email}</p>
                    </div>
                  </div>
                )}
                {member.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-white/60" />
                    <div>
                      <p className="text-xs text-white/60">Téléphone</p>
                      <p className="text-sm text-white">{member.phone}</p>
                    </div>
                  </div>
                )}
                {member.birth_date && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-white/60" />
                    <div>
                      <p className="text-xs text-white/60">Date de naissance</p>
                      <p className="text-sm text-white">
                        {new Date(member.birth_date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium text-white mb-3 flex items-center space-x-2">
                <CreditCard className="w-5 h-5 text-green-400" />
                <span>Informations club</span>
              </h4>
              <div className="space-y-3 bg-white/5 rounded-lg p-4 border border-white/10">
                {club && (
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-4 h-4 text-white/60" />
                    <div>
                      <p className="text-xs text-white/60">Club</p>
                      <p className="text-sm text-white">{club.name}</p>
                    </div>
                  </div>
                )}
                {member.season && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <div>
                      <p className="text-xs text-white/60">Saison</p>
                      <p className="text-sm text-white font-medium">
                        {member.season}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Métadonnées */}
          <div className="bg-gray-800/50 rounded-lg p-4 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center space-x-2">
              <Info className="w-4 h-4 text-blue-400" />
              <span>Informations système</span>
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-white/60">Créé le:</span>
                <span className="text-white ml-2">
                  {new Date(member.created_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
              <div>
                <span className="text-white/60">Modifié le:</span>
                <span className="text-white ml-2">
                  {new Date(member.updated_at).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button
            onClick={onClose}
            className="admin-button-primary"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemberManagement;
