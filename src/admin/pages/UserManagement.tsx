import React, { useEffect, useState } from 'react';
import { 
  UserCog, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Eye, 
  EyeOff,
  Search,
  AlertTriangle,
  RotateCcw,
  RefreshCw,
  Copy,
  Info,
  Phone,
  Mail,
  
  
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import PlusActionsMenu from '../components/PlusActionsMenu';
import { supabase, supabaseAdmin } from '../../config/supabase';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const { user: currentUser, clubs } = useAdmin();

  // Vérifier les permissions d'accès
  const hasUsersPermission = currentUser?.permissions?.includes('users') || currentUser?.permissions?.includes('all');

  if (!hasUsersPermission) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCog className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Accès non autorisé</h1>
          <p className="text-white/70 mb-6">
            Vous n'avez pas les permissions nécessaires pour accéder à la gestion des utilisateurs.
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
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [dbClubsById, setDbClubsById] = useState<Record<string, string>>({});
  const [dbClubsByName, setDbClubsByName] = useState<Record<string, string>>({});
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  const loadUsers = async (showDeleted = false) => {
    try {
      setLoading(true);
      setError('');
      // 1) Récupérer les utilisateurs
      const { data: usersData, error: usersErr } = await supabase
        .from('users')
        .select('id, name, email, user_phone, user_title, role, is_active, is_deleted, created_at, last_login')
        .eq('is_deleted', showDeleted) // Charger selon l'onglet sélectionné
        .order('created_at', { ascending: false });
      if (usersErr) throw usersErr;
      

      const userIds = (usersData || []).map((u: any) => u.id);

      // 2) Récupérer les accès clubs pour ces utilisateurs
      let clubAccessMap: Record<string, string[]> = {};
      if (userIds.length > 0) {
        const { data: ucaData, error: ucaErr } = await supabase
          .from('user_club_access')
          .select('user_id, club_id')
          .in('user_id', userIds);
        if (ucaErr) throw ucaErr;
        clubAccessMap = (ucaData || []).reduce((acc: Record<string, string[]>, row: any) => {
          if (!acc[row.user_id]) acc[row.user_id] = [];
          acc[row.user_id].push(row.club_id);
          return acc;
        }, {});
      }

      // 3) Charger les clubs DB pour affichage (id -> name) et mapping (name -> id)
      const { data: clubsDb, error: clubsErr } = await supabase
        .from('clubs')
        .select('id, name');
      if (clubsErr) throw clubsErr;
      const idToName: Record<string, string> = {};
      const nameToId: Record<string, string> = {};
      (clubsDb || []).forEach((c: any) => { idToName[c.id] = c.name; nameToId[c.name] = c.id; });
      setDbClubsById(idToName);
      setDbClubsByName(nameToId);

      // 4) Récupérer les permissions pour ces utilisateurs
      let permissionsMap: Record<string, string[]> = {};
      if (userIds.length > 0) {
        const { data: upData, error: upErr } = await supabase
          .from('user_permissions')
          .select('user_id, permission_id')
          .in('user_id', userIds);
        if (upErr) throw upErr;
        permissionsMap = (upData || []).reduce((acc: Record<string, string[]>, row: any) => {
          if (!acc[row.user_id]) acc[row.user_id] = [];
          acc[row.user_id].push(row.permission_id);
          return acc;
        }, {});
      }

      const mapped = (usersData || []).map((u: any) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        user_phone: u.user_phone,
        user_title: u.user_title,
        role: u.role,
        clubAccess: clubAccessMap[u.id] || [],
        permissions: permissionsMap[u.id] || [],
        lastLogin: u.last_login,
        isActive: u.is_active ?? true,
        isDeleted: u.is_deleted ?? false,
        createdAt: u.created_at
      }));
      setUsers(mapped);
    } catch (e: any) {
      console.error(e);
      setError("Impossible de charger les utilisateurs");
      toast.error('Erreur lors du chargement des utilisateurs');
    } finally {
      setLoading(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [clubFilter, setClubFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'deleted'>('active');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [userToRestore, setUserToRestore] = useState<any>(null);
  const [showToggleStatusModal, setShowToggleStatusModal] = useState(false);
  const [userToToggle, setUserToToggle] = useState<any>(null);
  const [showForcePasswordModal, setShowForcePasswordModal] = useState(false);
  const [userToForcePassword, setUserToForcePassword] = useState<any>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [userToView, setUserToView] = useState<any>(null);
  const [viewModalTab, setViewModalTab] = useState('info');

  const allPermissions = [
    { id: 'members', label: 'Gestion des adhérents' },
    { id: 'clubs', label: 'Gestion des clubs' },
    { id: 'content', label: 'Gestion des contenus' },
    { id: 'events', label: 'Gestion des événements' },
    { id: 'communications', label: 'Communications' },
    { id: 'media', label: 'Gestion des médias' },
    { id: 'faq', label: 'Gestion des FAQ' },
    { id: 'users', label: 'Gestion des utilisateurs' },
    { id: 'reports', label: 'Rapports' },
    { id: 'settings', label: 'Paramètres' }
  ];

  useEffect(() => {
    loadUsers(activeTab === 'deleted');
  }, [activeTab]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesClub = !clubFilter || user.clubAccess.includes(clubFilter) || user.role === 'superadmin';
    return matchesSearch && matchesRole && matchesClub;
  });

  const getRoleLabel = (role: string) => {
    const labels = {
      superadmin: 'Super Administrateur',
      admin: 'Administrateur',
      club_admin: 'Admin Club'
    };
    return labels[role as keyof typeof labels] || role;
  };

  const getRoleColor = (role: string) => {
    const colors = {
      superadmin: 'bg-red-100 text-red-800',
      admin: 'bg-blue-100 text-blue-800',
      club_admin: 'bg-green-100 text-green-800'
    };
    return colors[role as keyof typeof colors] || 'bg-white/10 text-white border border-white/20';
  };









  const handleViewUser = (user: any) => {
    setUserToView(user);
    setViewModalTab('info');
    setShowViewModal(true);
  };

  const handleDeleteClick = (user: any) => {
    if (user.id === currentUser?.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleRestoreClick = (user: any) => {
    setUserToRestore(user);
    setShowRestoreModal(true);
  };

  const handleToggleStatus = (id: string) => {
    const user = users.find(u => u.id === id);
    if (user && user.email === currentUser?.email) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte');
      return;
    }
    setUserToToggle(user);
    setShowToggleStatusModal(true);
  };

  const handleForcePasswordChange = (user: any) => {
    setUserToForcePassword(user);
    setShowForcePasswordModal(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    
    try {
      if (activeTab === 'active') {
        // Soft delete - supprimer l'utilisateur de Supabase Auth et marquer comme supprimé
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userToDelete.id);
        if (authError) {
          console.warn('Erreur lors de la suppression Auth (peut-être déjà supprimé):', authError);
        }

        const { error } = await supabase
          .from('users')
          .update({ is_deleted: true, is_active: false })
          .eq('id', userToDelete.id);
        if (error) throw error;

        await loadUsers(false);
        toast.success('Utilisateur supprimé avec succès');
      } else {
        // Suppression définitive
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('id', userToDelete.id);
        if (error) throw error;

        await loadUsers(true);
        toast.success('Utilisateur supprimé définitivement');
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de la suppression de l'utilisateur");
    } finally {
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const confirmRestore = async () => {
    if (!userToRestore) return;
    
    try {
      // 1. Restaurer l'utilisateur dans la table users, le rendre actif et réinitialiser last_login
      const { error } = await supabase
        .from('users')
        .update({ is_deleted: false, is_active: true, last_login: null })
        .eq('id', userToRestore.id);
      if (error) throw error;

      // 2. Recréer le compte d'authentification Supabase
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: userToRestore.email,
        password: 'TempPassword123!', // Mot de passe temporaire
        email_confirm: true,
        user_metadata: {
          name: userToRestore.name,
          role: userToRestore.role
        }
      });

      if (authError) {
        console.warn('Erreur lors de la création Auth:', authError);
        // Continue même si la création Auth échoue
      } else {
        // Mettre à jour l'ID utilisateur si nécessaire (en cas de changement d'ID)
        if (authUser.user && authUser.user.id !== userToRestore.id) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ id: authUser.user.id })
            .eq('id', userToRestore.id);
          if (updateError) {
            console.warn('Erreur lors de la mise à jour de l\'ID:', updateError);
          }
        }
      }

      await loadUsers(true);
      toast.success('Utilisateur restauré avec succès. Un mot de passe temporaire a été défini.');
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de la restauration de l'utilisateur");
    } finally {
      setShowRestoreModal(false);
      setUserToRestore(null);
    }
  };

  const confirmToggleStatus = async () => {
    if (!userToToggle) return;
    
    const next = !userToToggle.isActive;
    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: next })
        .eq('id', userToToggle.id);
      if (error) throw error;
      setUsers(users.map(u => u.id === userToToggle.id ? { ...u, isActive: next } : u));
      toast.success(`Utilisateur ${next ? 'activé' : 'désactivé'} avec succès`);
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors du changement de statut");
    } finally {
      setShowToggleStatusModal(false);
      setUserToToggle(null);
    }
  };

  const confirmForcePasswordChange = async () => {
    if (!userToForcePassword) return;
    try {
      // 1. Réinitialiser le mot de passe dans Supabase Auth avec le mot de passe temporaire
      const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
        userToForcePassword.id,
        { password: 'TempPassword123!' }
      );
      if (authError) throw authError;

      // 2. Réinitialiser last_login pour forcer le changement de mot de passe
      const { error: dbError } = await supabase
            .from('users')
        .update({ last_login: null })
        .eq('id', userToForcePassword.id);
      if (dbError) throw dbError;

      toast.success('Mot de passe réinitialisé avec "TempPassword123!" - L\'utilisateur devra le changer à la prochaine connexion');
      await loadUsers(false);
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du mot de passe:', error);
      toast.error('Erreur lors de la réinitialisation du mot de passe');
    } finally {
      setShowForcePasswordModal(false);
      setUserToForcePassword(null);
    }
  };


  const handleSaveUser = async (userData: any) => {
    try {
      
      // Validation côté serveur : chaque utilisateur doit avoir au moins un club (sauf Super Administrateur)
      if ((!userData.clubAccess || userData.clubAccess.length === 0) && userData.role !== 'superadmin') {
        toast.error('Chaque utilisateur doit avoir au moins un club attribué');
      return;
    }

      // Validation : seuls les Super Administrateurs peuvent avoir la permission "Gestion des utilisateurs"
      if (userData.permissions && userData.permissions.includes('users') && userData.role !== 'superadmin') {
        toast.error('Seuls les Super Administrateurs peuvent avoir la permission "Gestion des utilisateurs"');
        return;
      }
      
      if (selectedUser) {
        // Vérifier si l'email a changé
        const emailChanged = selectedUser.email !== userData.email;
        
        // Mettre à jour l'email dans Supabase Auth si nécessaire
        if (emailChanged) {
          const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(selectedUser.id, {
            email: userData.email,
            email_confirm: true // Auto-confirmer le nouvel email
          });
          if (authError) throw authError;
        }
        
        // Mettre à jour la table users
        const { error } = await supabase
          .from('users')
          .update({
            name: userData.name,
            email: userData.email,
            user_phone: userData.phone,
            user_title: userData.title,
            role: userData.role,
            is_active: userData.isActive,
          })
          .eq('id', selectedUser.id);
        if (error) throw error;

        // Synchroniser les accès clubs (relationnelle): supprimer ceux absents, ajouter les nouveaux
        // Convertir slugs -> UUID via mapping noms des clubs DB
        const selectedClubIds: string[] = (userData.clubAccess || []).map((id: string) => {
          if (uuidRegex.test(id)) return id;
          const clubFromContext = clubs.find(c => c.id === id);
          if (clubFromContext) {
            const uuid = dbClubsByName[clubFromContext.name];
            return uuid || id;
          }
          return id;
        });
        // Supprimer les accès non sélectionnés
        if (Array.isArray(selectedClubIds)) {
          if (selectedClubIds.length === 0) {
            // Aucun club sélectionné: supprimer tous les accès
            const { error: delAll } = await supabase
              .from('user_club_access')
              .delete()
              .eq('user_id', selectedUser.id);
            if (delAll) throw delAll;
          } else {
            // Supprimer tous les accès existants d'abord
            const { error: delAll } = await supabase
              .from('user_club_access')
              .delete()
              .eq('user_id', selectedUser.id);
            if (delAll) throw delAll;
          }
        }
        // Insérer les nouveaux accès sélectionnés
        if (selectedClubIds && selectedClubIds.length > 0) {
          const toInsert = selectedClubIds.map((cid: string) => ({ 
            user_id: selectedUser.id, 
            club_id: cid 
          }));
          const { error: insError } = await supabase
            .from('user_club_access')
            .insert(toInsert);
          if (insError) throw insError;
        }

        // Synchroniser les permissions relationnelles
        const selectedPermIds: string[] = userData.permissions || [];
        
        // Supprimer toutes les permissions existantes d'abord
          const { error: delPermErr } = await supabase
            .from('user_permissions')
            .delete()
          .eq('user_id', selectedUser.id);
          if (delPermErr && delPermErr.code !== 'PGRST116') {
            throw delPermErr;
          }
        
        // Insérer les nouvelles permissions sélectionnées
        if (selectedPermIds && selectedPermIds.length > 0) {
          const toInsertPerms = selectedPermIds.map((pid: string) => ({ 
            user_id: selectedUser.id, 
            permission_id: pid 
          }));
          const { error: insPermErr } = await supabase
            .from('user_permissions')
            .insert(toInsertPerms);
          if (insPermErr) throw insPermErr;
        }
        await loadUsers(activeTab === 'deleted'); // Charger selon l'onglet actuel après modification
        toast.success('Utilisateur modifié avec succès');
      } else {
        // Création: créer d'abord l'utilisateur dans Supabase Auth
        if (!userData.password || userData.password.length < 8) {
          throw new Error('Le mot de passe doit contenir au moins 8 caractères');
        }
        if (userData.password.length > 50) {
          throw new Error('Le mot de passe ne peut pas dépasser 50 caractères');
        }

        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email: userData.email,
          password: userData.password,
          email_confirm: true, // Auto-confirmer l'email
          user_metadata: {
            name: userData.name,
            role: userData.role
          }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error('Erreur lors de la création de l\'utilisateur');

        // Ensuite créer l'entrée dans la table users
        const { error } = await supabase
          .from('users')
          .insert({
            id: authData.user.id, // Utiliser l'ID de l'utilisateur Auth
            name: userData.name,
            email: userData.email,
            user_phone: userData.phone,
            user_title: userData.title,
            role: userData.role,
            is_active: userData.isActive ?? true,
          });
        if (error) throw error;
        // Utiliser l'ID de l'utilisateur Auth créé
        const newUserId = authData.user.id;
        // Conversion slugs -> UUID pour création également
        const newUserClubUUIDs: string[] = (userData.clubAccess || []).map((id: string) => {
          if (uuidRegex.test(id)) return id;
          const clubFromContext = clubs.find(c => c.id === id);
          if (clubFromContext) {
            const uuid = dbClubsByName[clubFromContext.name];
            return uuid || id;
          }
          return id;
        });
        if (newUserId && Array.isArray(newUserClubUUIDs) && newUserClubUUIDs.length > 0) {
          const toInsert = newUserClubUUIDs.map((cid: string) => ({ user_id: newUserId, club_id: cid }));
          const { error: relError } = await supabase
            .from('user_club_access')
            .insert(toInsert);
          if (relError) throw relError;
        }
        if (newUserId && Array.isArray(userData.permissions) && userData.permissions.length > 0) {
          const toInsertPerms = userData.permissions.map((pid: string) => ({ user_id: newUserId, permission_id: pid }));
          const { error: relPermErr } = await supabase
            .from('user_permissions')
            .insert(toInsertPerms);
          if (relPermErr) throw relPermErr;
        }
        await loadUsers(false); // Toujours charger les utilisateurs actifs après création
        toast.success('Utilisateur créé avec succès');
      }
    } catch (e: any) {
      console.error(e);
      toast.error("Erreur lors de l'enregistrement de l'utilisateur");
    } finally {
      setShowCreateModal(false);
      setSelectedUser(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* En-tête: bouton + à gauche | séparateur | cartes info à droite */}
      <div className="flex items-stretch justify-between">
        <div className="flex items-stretch">
          <PlusActionsMenu
            buttonTitle="Actions Utilisateurs"
            buttonClassName="h-12"
            actions={[
              ...(activeTab === 'active' ? [{ label: 'Ajouter un utilisateur', onClick: () => setShowCreateModal(true) }] : []),
            ]}
          />
          <div className="self-center h-6 w-px bg-white/20 mx-4" />
        </div>
        <div className="flex-1 flex items-stretch space-x-3">
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-white leading-none">{users.length}</p>
            <p className="text-xs text-white/60 mt-0.5">Total</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-green-400 leading-none">{users.filter(u => u.isActive).length}</p>
            <p className="text-xs text-white/60 mt-0.5">Actifs</p>
          </div>
          <div className="flex-1 bg-white/5 rounded-lg h-12 px-3 text-center flex flex-col items-center justify-center">
            <p className="text-lg font-bold text-orange-400 leading-none">{users.filter(u => !u.isActive).length}</p>
            <p className="text-xs text-white/60 mt-0.5">Inactifs</p>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="admin-card py-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Recherche
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un utilisateur..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="admin-input pl-10 w-full h-9"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Rôle
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="admin-input w-full h-9"
            >
              <option value="">Tous les rôles</option>
              <option value="superadmin">Super Administrateur</option>
              <option value="admin">Administrateur</option>
              <option value="club_admin">Admin Club</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">
              Club
            </label>
            <select
              value={clubFilter}
              onChange={(e) => setClubFilter(e.target.value)}
              className="admin-input w-full h-9"
            >
              <option value="">Tous les clubs</option>
              {Object.entries(dbClubsById).map(([clubId, clubName]) => (
                <option key={clubId} value={clubId}>{clubName}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="mt-2 text-sm text-white/60">
          <span>{filteredUsers.length} {filteredUsers.length <= 1 ? 'utilisateur trouvé' : 'utilisateurs trouvés'}</span>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex border-b border-white/20">
        <button
          onClick={() => setActiveTab('active')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 relative ${
            activeTab === 'active'
              ? 'text-red-400 border-red-400 bg-white/5'
              : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
          }`}
        >
          Utilisateurs
          {activeTab === 'active' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"></div>
          )}
        </button>
        <button
          onClick={() => setActiveTab('deleted')}
          className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 relative ${
            activeTab === 'deleted'
              ? 'text-red-400 border-red-400 bg-white/5'
              : 'text-white/70 border-transparent hover:text-white hover:border-white/30'
          }`}
        >
          Utilisateurs supprimés
          {activeTab === 'deleted' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-400"></div>
          )}
        </button>
        
        {/* Mot de passe par défaut - visible sur les deux onglets */}
        {(activeTab === 'deleted' || activeTab === 'active') && (
          <div className="ml-auto flex items-center px-6 py-3">
            <div className="flex items-center space-x-2 text-sm text-white/70">
              <Shield className="w-4 h-4" />
              <span>Mot de passe après restauration :</span>
              <div className="relative group">
                <Info className="w-3 h-3 text-blue-400 cursor-help" />
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 w-64">
                  Ce mot de passe sera attribué automatiquement lors de la restauration d'un utilisateur supprimé. L'utilisateur sera invité à le changer lors de sa première connexion.
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                </div>
              </div>
              <div className="flex items-center space-x-2 bg-white/10 px-2 py-1 rounded border border-white/20">
                <span className="font-mono text-yellow-400">TempPassword123!</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText('TempPassword123!');
                    toast.success('Mot de passe copié dans le presse-papiers');
                  }}
                  className="text-white/60 hover:text-white transition-colors"
                  title="Copier le mot de passe"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="admin-card overflow-hidden">
        {loading && (
          <div className="p-2" />
        )}
        {error && !loading && (
          <div className="text-center py-4 text-red-400">{error}</div>
        )}
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th className="text-center"></th>
                <th>Rôle</th>
                <th>Accès clubs</th>
                <th className="text-center">Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                Array.from({ length: 8 }).map((_, rowIdx) => (
                  <tr key={`skeleton-${rowIdx}`} className="hover:bg-white/5">
                    {Array.from({ length: 7 }).map((__, colIdx) => (
                      <td key={colIdx} className="px-4 py-4">
                        <div className={`h-3 rounded animate-pulse ${colIdx === 0 ? 'w-40' : colIdx === 3 ? 'w-24' : 'w-20'} bg-white/10`} />
                        {colIdx === 0 && (
                          <div className="mt-2 h-2 w-24 bg-white/5 rounded animate-pulse" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
              filteredUsers.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-white/10 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewUser(user)}
                >
                  <td>
                    <div>
                      <div className="font-medium text-white flex items-center space-x-2">
                        <div className="relative group">
                          <span>
                            {user.name.length > 30 ? `${user.name.substring(0, 30)}...` : user.name}
                          </span>
                          {user.name.length > 30 && (
                            <div className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                              {user.name}
                              <div className="absolute top-full left-0 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                            </div>
                          )}
                        </div>
                        {user.email === currentUser?.email && (
                          <span className="text-xs text-white/50 italic">(Vous)</span>
                        )}
                      </div>
                      {user.user_title && (
                        <div className="text-sm text-white/70">
                          {user.user_title}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {/* Icône Email */}
                      <div className="relative group">
                        <a 
                          href={`mailto:${user.email}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block"
                          title={`Envoyer un email à ${user.email}`}
                        >
                          <Mail className="w-4 h-4 text-green-400 hover:text-green-300 cursor-pointer transition-colors duration-200" />
                        </a>
                        {/* Tooltip */}
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                          Cliquer pour envoyer un email : {user.email}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                        </div>
                      </div>
                      
                      {/* Icône Téléphone */}
                      <div className="relative group">
                        {user.user_phone ? (
                          <a 
                            href={`tel:${user.user_phone.replace(/\s/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="block"
                            title={`Appeler ${user.user_phone}`}
                          >
                            <Phone className="w-4 h-4 text-blue-400 hover:text-blue-300 cursor-pointer transition-colors duration-200" />
                          </a>
                        ) : (
                          <Phone className="w-4 h-4 text-white/30" />
                        )}
                        {/* Tooltip */}
                        {user.user_phone && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                            Cliquer pour appeler : {user.user_phone}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-white/80">
                      {user.role === 'superadmin' || user.clubAccess.length === Object.keys(dbClubsById).length ? (
                        <span className="text-blue-400 font-medium">Tous les clubs</span>
                      ) : (
                        <div className="space-y-1">
                          {user.clubAccess.map((clubId: string) => (
                            <div key={clubId} className="text-xs">
                              {dbClubsById[clubId] || clubId}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="text-center">
                    <div className="relative group flex justify-center items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        user.isActive ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10 border border-white/20">
                        {user.isActive ? 'Utilisateur actif' : 'Utilisateur inactif'}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-white">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleString('fr-FR', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit'
                          })
                        : 'Jamais'
                      }
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      {activeTab === 'active' && (
                        <>
                      <button
                            onClick={(e) => {
                              e.stopPropagation();
                          setSelectedUser(user);
                          setShowCreateModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                          {currentUser && user.email !== currentUser.email && (
                        <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleForcePasswordChange(user);
                              }}
                              className="text-blue-600 hover:text-blue-800"
                              title="Réinitialiser le mot de passe avec TempPassword123!"
                            >
                              <RefreshCw className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      )}
                      {activeTab === 'active' && currentUser && user.email !== currentUser.email && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleStatus(user.id);
                          }}
                          className={`${
                            user.isActive 
                              ? 'text-yellow-600 hover:text-yellow-800' 
                              : 'text-green-600 hover:text-green-800'
                          }`}
                          title={user.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      )}
                      {currentUser && user.email !== currentUser.email && (
                        <>
                          {activeTab === 'active' ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteClick(user);
                              }}
                              className="text-red-600 hover:text-red-800"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRestoreClick(user);
                                }}
                                className="text-green-600 hover:text-green-800"
                                title="Restaurer"
                              >
                                <RotateCcw className="w-4 h-4" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteClick(user);
                                }}
                                className="text-red-600 hover:text-red-800"
                                title="Supprimer définitivement"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
        
        {!loading && !error && users.length === 0 && activeTab === 'active' && (
          <div className="text-center py-12">
            <UserCog className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aucun utilisateur en base
            </h3>
            <p className="text-white/70">
              Cliquez sur "Ajouter un utilisateur" pour créer le premier compte.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="admin-button-primary flex items-center space-x-2 mx-auto mt-4"
            >
              <Plus className="w-4 h-4" />
              <span>Créer le premier utilisateur</span>
            </button>
          </div>
        )}
        {!loading && !error && users.length === 0 && activeTab === 'deleted' && (
          <div className="text-center py-12">
            <Trash2 className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aucun utilisateur supprimé
            </h3>
            <p className="text-white/70">
              Aucun utilisateur n'a été supprimé pour le moment.
            </p>
          </div>
        )}
        {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-white/70">
              Aucun utilisateur ne correspond aux critères sélectionnés.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <UserModal
          user={selectedUser}
          dbClubsById={dbClubsById}
          allPermissions={allPermissions}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && userToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {activeTab === 'active' ? 'Supprimer l\'utilisateur' : 'Suppression définitive'}
                </h3>
                <p className="text-white/70">
                  {activeTab === 'active' 
                    ? 'Cet utilisateur sera déplacé vers les utilisateurs supprimés et rendu inactif'
                    : 'Cette action est irréversible'
                  }
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userToDelete.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{userToDelete.name}</p>
                  <p className="text-white/70 text-sm">{userToDelete.email}</p>
                </div>
              </div>
            </div>

            {activeTab === 'active' && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-yellow-400 font-medium">Attention</p>
                    <p className="text-yellow-300">
                      Le compte d'authentification Supabase sera également supprimé. 
                      L'utilisateur pourra être restauré depuis l'onglet "Utilisateurs supprimés".
                    </p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'deleted' && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-6">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="text-red-400 font-medium">Suppression définitive</p>
                    <p className="text-red-300">
                      Toutes les données de cet utilisateur seront définitivement supprimées. 
                      Cette action ne peut pas être annulée.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setUserToDelete(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === 'active'
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-red-600 text-white hover:bg-red-700'
                }`}
              >
                {activeTab === 'active' ? 'Supprimer' : 'Supprimer définitivement'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation de restauration */}
      {showRestoreModal && userToRestore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <RotateCcw className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Restaurer l'utilisateur
                </h3>
                <p className="text-white/70">
                  Cet utilisateur sera restauré, rendu actif et pourra se connecter à nouveau
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {userToRestore.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{userToRestore.name}</p>
                  <p className="text-white/70 text-sm">{userToRestore.email}</p>
                  <p className="text-white/50 text-xs">{getRoleLabel(userToRestore.role)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-start space-x-2">
                <RotateCcw className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-blue-400 font-medium">Restauration complète</p>
                  <p className="text-blue-300">
                    • L'utilisateur sera restauré dans la base de données<br/>
                    • L'utilisateur sera automatiquement rendu actif<br/>
                    • Un compte d'authentification sera recréé<br/>
                    • Mot de passe temporaire : <span className="font-mono bg-white/10 px-1 rounded">TempPassword123!</span><br/>
                    • L'utilisateur devra créer un nouveau mot de passe lors de sa première connexion
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-yellow-400 font-medium">Important</p>
                  <p className="text-yellow-300">
                    L'utilisateur devra changer son mot de passe lors de sa première connexion.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setUserToRestore(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmRestore}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
              >
                Restaurer l'utilisateur
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation du changement de statut */}
      {showToggleStatusModal && userToToggle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className={`p-2 rounded-lg ${userToToggle.isActive ? 'bg-orange-500/20' : 'bg-green-500/20'}`}>
                {userToToggle.isActive ? 
                  <EyeOff className="w-6 h-6 text-orange-400" /> : 
                  <Eye className="w-6 h-6 text-green-400" />
                }
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  {userToToggle.isActive ? 'Désactiver l\'utilisateur' : 'Activer l\'utilisateur'}
                </h3>
                <p className="text-white/70">
                  {userToToggle.isActive 
                    ? 'Cet utilisateur ne pourra plus se connecter' 
                    : 'Cet utilisateur pourra à nouveau se connecter'
                  }
                </p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  userToToggle.isActive ? 'bg-orange-500' : 'bg-green-500'
                }`}>
                  <span className="text-white font-semibold">
                    {userToToggle.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{userToToggle.name}</p>
                  <p className="text-white/70 text-sm">{userToToggle.email}</p>
                  <p className="text-white/50 text-xs">{getRoleLabel(userToToggle.role)}</p>
                </div>
              </div>
            </div>

            <div className={`${userToToggle.isActive ? 'bg-orange-500/10 border-orange-500/20' : 'bg-green-500/10 border-green-500/20'} border rounded-lg p-3 mb-6`}>
              <div className="flex items-start space-x-2">
                <AlertTriangle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${userToToggle.isActive ? 'text-orange-400' : 'text-green-400'}`} />
                <div className="text-sm">
                  <p className={`font-medium ${userToToggle.isActive ? 'text-orange-400' : 'text-green-400'}`}>
                    {userToToggle.isActive ? 'Désactivation' : 'Activation'}
                  </p>
                  <p className={userToToggle.isActive ? 'text-orange-300' : 'text-green-300'}>
                    {userToToggle.isActive 
                      ? 'L\'utilisateur sera désactivé et ne pourra plus accéder au système jusqu\'à réactivation.'
                      : 'L\'utilisateur sera activé et pourra à nouveau accéder au système.'
                    }
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowToggleStatusModal(false);
                  setUserToToggle(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmToggleStatus}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                  userToToggle.isActive
                    ? 'bg-orange-600 text-white hover:bg-orange-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {userToToggle.isActive ? 'Désactiver' : 'Activer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmation pour forcer le changement de mot de passe */}
      {showForcePasswordModal && userToForcePassword && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <RefreshCw className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Réinitialiser le mot de passe
                </h3>
                <p className="text-white/70">
                  Le mot de passe sera réinitialisé avec "TempPassword123!" et l'utilisateur devra le changer lors de sa prochaine connexion
                </p>
              </div>
            </div>

            <div className="bg-white/5 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-500">
                  <span className="text-white font-semibold">
                    {userToForcePassword.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">{userToForcePassword.name}</p>
                  <p className="text-white/70 text-sm">{userToForcePassword.email}</p>
                  <p className="text-white/50 text-xs">{getRoleLabel(userToForcePassword.role)}</p>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 mb-6">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 mt-0.5 flex-shrink-0 text-blue-400" />
                <div className="text-sm">
                  <p className="font-medium text-blue-400">
                    Réinitialisation du mot de passe
                  </p>
                  <p className="text-blue-300">
                    Le mot de passe sera défini sur "TempPassword123!" et l'utilisateur sera invité à créer un nouveau mot de passe sécurisé lors de sa prochaine connexion. Son accès actuel restera valide jusqu'à la déconnexion.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowForcePasswordModal(false);
                  setUserToForcePassword(null);
                }}
                className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmForcePasswordChange}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors"
              >
                Réinitialiser le mot de passe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation des détails utilisateur */}
      {showViewModal && userToView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Détails de l'utilisateur
                  </h3>
                  <p className="text-white/70">
                    Informations complètes de {userToView.name.length > 30 ? `${userToView.name.substring(0, 30)}...` : userToView.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setUserToView(null);
                }}
                className="text-white/60 hover:text-white transition-colors"
              >
                ×
              </button>
            </div>

            {/* Onglets */}
            <div className="flex space-x-1 mb-6 bg-white/5 p-1 rounded-lg">
              <button
                onClick={() => setViewModalTab('info')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewModalTab === 'info'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <UserCog className="w-4 h-4 inline mr-2" />
                Informations
              </button>
              <button
                onClick={() => setViewModalTab('clubs')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewModalTab === 'clubs'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">🏢</span>
                Clubs
              </button>
              <button
                onClick={() => setViewModalTab('permissions')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewModalTab === 'permissions'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">🔐</span>
                Permissions
              </button>
              <button
                onClick={() => setViewModalTab('system')}
                className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  viewModalTab === 'system'
                    ? 'bg-blue-600 text-white'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">ℹ️</span>
                Système
              </button>
            </div>

            {/* Contenu des onglets */}
            <div className="space-y-4">
              {viewModalTab === 'info' && (
                <div className="space-y-4">
                  {/* Informations personnelles */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                      <UserCog className="w-4 h-4" />
                      <span>Informations personnelles</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm">Nom complet</label>
                        <p className="text-white font-medium">{userToView.name.length > 30 ? `${userToView.name.substring(0, 30)}...` : userToView.name}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Email</label>
                        <p className="text-white font-medium">{userToView.email}</p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Téléphone</label>
                        <p className="text-white font-medium">
                          {userToView.user_phone || 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Titre</label>
                        <p className="text-white font-medium">
                          {userToView.user_title || 'Non renseigné'}
                        </p>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Rôle</label>
                        <div className="mt-1">
                          <span className={`admin-badge ${getRoleColor(userToView.role)}`}>
                            {getRoleLabel(userToView.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Statut et accès */}
                  <div className="bg-white/5 rounded-lg p-4">
                    <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Statut et accès</span>
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-white/60 text-sm">Statut</label>
                        <div className="flex items-center space-x-2">
                          <div className={`w-3 h-3 rounded-full ${
                            userToView.isActive ? 'bg-green-500' : 'bg-red-500'
                          }`} />
                          <span className="text-white font-medium">
                            {userToView.isActive ? 'Actif' : 'Inactif'}
                          </span>
                        </div>
                      </div>
                      <div>
                        <label className="text-white/60 text-sm">Dernière connexion</label>
                        <p className="text-white font-medium">
                          {userToView.lastLogin 
                            ? new Date(userToView.lastLogin).toLocaleString('fr-FR')
                            : 'Jamais connecté'
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {viewModalTab === 'clubs' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                    <span>🏢</span>
                    <span>Accès aux clubs</span>
                  </h4>
                  <div>
                    {userToView.role === 'superadmin' ? (
                      <div className="flex items-center space-x-2">
                        <span className="text-green-400 font-medium">Tous les clubs</span>
                        <span className="text-white/60 text-sm">(Super Administrateur)</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {userToView.clubAccess && userToView.clubAccess.length > 0 ? (
                          userToView.clubAccess.map((clubId: string) => (
                            <div key={clubId} className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-white">{dbClubsById[clubId] || clubId}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-white/60">Aucun club assigné</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {viewModalTab === 'permissions' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                    <span>🔐</span>
                    <span>Permissions</span>
                  </h4>
                  <div className="space-y-2">
                    {userToView.permissions && userToView.permissions.length > 0 ? (
                      userToView.permissions.map((permissionId: string) => {
                        const permission = allPermissions.find((p: any) => p.id === permissionId);
                        return (
                          <div key={permissionId} className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-white">{permission?.label || permissionId}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-white/60">Aucune permission assignée</span>
                    )}
                  </div>
                </div>
              )}

              {viewModalTab === 'system' && (
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-4 flex items-center space-x-2">
                    <span>ℹ️</span>
                    <span>Informations système</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-white/60 text-sm">Date de création</label>
                      <p className="text-white font-medium">
                        {new Date(userToView.createdAt).toLocaleString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <label className="text-white/60 text-sm">ID utilisateur</label>
                      <p className="text-white/70 text-xs font-mono break-all">{userToView.id}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setShowViewModal(false);
                  setUserToView(null);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// User Modal Component
const UserModal: React.FC<{
  user: any;
  dbClubsById: Record<string, string>;
  allPermissions: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ user, dbClubsById, allPermissions, onClose, onSave }) => {
  const [formData, setFormData] = useState(user ? {
    name: user.name || '',
    email: user.email || '',
    phone: user.user_phone || '',
    title: user.user_title || '',
    role: user.role || 'club_admin',
    clubAccess: user.clubAccess || [],
    permissions: user.permissions || [],
    isActive: user.isActive !== undefined ? user.isActive : true,
    password: ''
  } : {
    name: '',
    email: '',
    phone: '',
    title: '',
    role: 'club_admin',
    clubAccess: [],
    permissions: [],
    isActive: true,
    password: ''
  });

  // Initialiser la validation de l'email et les données si un utilisateur existe
  React.useEffect(() => {
    if (user) {
      if (user.email) {
        validateEmail(user.email);
      }
      // Mettre à jour le formData avec les données de l'utilisateur
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.user_phone || '',
        title: user.user_title || '',
        role: user.role || 'club_admin',
        clubAccess: user.clubAccess || [],
        permissions: user.permissions || [],
        isActive: user.isActive !== undefined ? user.isActive : true,
        password: ''
      });
    }
  }, [user]);

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('user');
  const [emailValidation, setEmailValidation] = useState<{
    isValid: boolean;
    message: string;
    charCount: number;
    isLimitReached: boolean;
  }>({ isValid: false, message: '', charCount: 0, isLimitReached: false });

  // Fonction pour filtrer les caractères autorisés dans l'email
  const filterEmailInput = (value: string): string => {
    // Caractères autorisés : lettres (a-z, A-Z), chiffres (0-9), @, ., -, _
    return value.replace(/[^a-zA-Z0-9@._-]/g, '');
  };

  // Fonction de validation email en temps réel
  const validateEmail = (value: string) => {
    const charCount = value.length;
    
    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidFormat = emailRegex.test(value);
    
    if (charCount === 0) {
      setEmailValidation({
        isValid: false,
        message: 'Email requis',
        charCount,
        isLimitReached: false
      });
    } else if (charCount === 100) {
      setEmailValidation({
        isValid: true, // Limite atteinte n'est pas une erreur
        message: 'Limite de 100 caractères atteinte',
        charCount,
        isLimitReached: true
      });
    } else if (!isValidFormat && charCount > 0) {
      setEmailValidation({
        isValid: false,
        message: 'Format email invalide',
        charCount,
        isLimitReached: false
      });
    } else if (isValidFormat) {
      setEmailValidation({
        isValid: true,
        message: 'Format email valide',
        charCount,
        isLimitReached: false
      });
    }
  };

  // Gestionnaire de changement d'email avec filtrage
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const filteredValue = filterEmailInput(rawValue);
    
    setFormData({...formData, email: filteredValue});
    validateEmail(filteredValue);
  };

  // Gestionnaire pour les événements de clavier (prévenir la saisie de caractères non autorisés)
  const handleEmailKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Touches de contrôle autorisées
    const allowedKeys = [
      'Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight', 
      'ArrowUp', 'ArrowDown', 'Home', 'End', 'Control', 'Meta', 'Alt',
      'Shift', 'CapsLock'
    ];
    
    // Autoriser toutes les touches de contrôle
    if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }
    
    // Caractères autorisés
    const allowedChars = /[a-zA-Z0-9@._-]/;
    
    // Bloquer seulement les caractères non autorisés
    if (!allowedChars.test(e.key)) {
      e.preventDefault();
    }
  };

  // Fonction pour formater le numéro de téléphone français (XX XX XX XX XX)
  const formatPhoneNumber = (value: string): string => {
    // Supprimer tous les caractères non numériques
    const cleaned = value.replace(/\D/g, '');
    
    // Limiter à 10 chiffres maximum
    const limited = cleaned.slice(0, 10);
    
    // Formater en groupes de 2 chiffres
    if (limited.length === 0) return '';
    if (limited.length <= 2) return limited;
    if (limited.length <= 4) return `${limited.slice(0, 2)} ${limited.slice(2)}`;
    if (limited.length <= 6) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4)}`;
    if (limited.length <= 8) return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6)}`;
    return `${limited.slice(0, 2)} ${limited.slice(2, 4)} ${limited.slice(4, 6)} ${limited.slice(6, 8)} ${limited.slice(8)}`;
  };

  // Gestionnaire de changement de téléphone avec formatage
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;
    const formattedValue = formatPhoneNumber(rawValue);
    setFormData({...formData, phone: formattedValue});
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setFormData({ ...formData, password });
    toast.success('Mot de passe généré');
  };

  const copyPassword = () => {
    if (formData.password) {
      navigator.clipboard.writeText(formData.password);
      toast.success('Mot de passe copié');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation : chaque utilisateur doit avoir au moins un club attribué (sauf Super Administrateur)
    if ((!formData.clubAccess || formData.clubAccess.length === 0) && formData.role !== 'superadmin') {
      toast.error('Chaque utilisateur doit avoir au moins un club attribué');
      return;
    }
    
    let finalData = { ...formData };
    
    // Set permissions based on role (seulement pour la création, pas la modification)
    if (!user) { // Si user est null, c'est une création
    if (formData.role === 'superadmin') {
      finalData.permissions = ['all'];
      finalData.clubAccess = Object.keys(dbClubsById); // Utiliser les UUIDs réels
    } else if (formData.role === 'admin') {
      finalData.clubAccess = Object.keys(dbClubsById); // Utiliser les UUIDs réels
      }
    }
    
    onSave(finalData);
  };

  const handleClubAccessChange = (clubId: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        clubAccess: [...formData.clubAccess, clubId]
      });
    } else {
      setFormData({
        ...formData,
        clubAccess: formData.clubAccess.filter((id: string) => id !== clubId)
      });
    }
  };

  const handleSelectAllClubs = (checked: boolean) => {
    if (checked) {
      // Sélectionner tous les clubs
      const allClubIds = Object.keys(dbClubsById);
      setFormData({
        ...formData,
        clubAccess: allClubIds
      });
    } else {
      // Désélectionner tous les clubs
      setFormData({
        ...formData,
        clubAccess: []
      });
    }
  };

  const handlePermissionChange = (permission: string, checked: boolean) => {
    // Empêcher l'ajout de la permission "users" si l'utilisateur n'est pas superadmin
    if (checked && permission === 'users' && formData.role !== 'superadmin') {
      toast.error('Seuls les Super Administrateurs peuvent avoir la permission "Gestion des utilisateurs"');
      return;
    }
    
    if (checked) {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, permission]
      });
    } else {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((p: string) => p !== permission)
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-900 border border-white/20 rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header amélioré */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${user ? 'bg-blue-500/20' : 'bg-green-500/20'}`}>
              {user ? <Edit className="w-5 h-5 text-blue-400" /> : <Plus className="w-5 h-5 text-green-400" />}
            </div>
            <div>
          <h3 className="text-lg font-semibold text-white">
                {user ? 'Modifier l\'utilisateur' : 'Créer un utilisateur'}
          </h3>
              <p className="text-white/60 text-xs">
                {user ? 'Modifiez les informations' : 'Configurez les accès et permissions'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Onglets */}
          <div className="flex border-b border-white/10 mb-6">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'user'
                  ? 'text-white border-b-2 border-blue-400 bg-blue-400/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Utilisateur
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('clubs')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'clubs'
                  ? 'text-white border-b-2 border-green-400 bg-green-400/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Clubs ({formData.role === 'superadmin' ? 'Tous' : formData.clubAccess.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('permissions')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'permissions'
                  ? 'text-white border-b-2 border-orange-400 bg-orange-400/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              Permissions ({formData.permissions.length})
            </button>
          </div>

          {/* Contenu des onglets */}
          <div className="min-h-[400px]">
            {/* Onglet Utilisateur */}
            {activeTab === 'user' && (
              <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Nom complet <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                maxLength={30}
                className="admin-input focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Prénom Nom"
              />
            </div>
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Titre (optionnel)
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                maxLength={100}
                className="admin-input focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                placeholder="Ex: Trésorier, Professeur, Secrétaire..."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Adresse email <span className="text-red-400">*</span>
              </label>
                    <div className="relative">
              <input
                type="email"
                required
                value={formData.email}
                        onChange={handleEmailChange}
                        onKeyDown={handleEmailKeyDown}
                        maxLength={100}
                        className={`admin-input focus:ring-2 focus:border-transparent transition-all duration-200 ${
                          emailValidation.isValid 
                            ? 'border-green-400 ring-2 ring-green-400' 
                            : emailValidation.charCount > 0 && !emailValidation.isValid
                              ? 'border-red-400 ring-2 ring-red-400'
                              : 'border-white/20 focus:ring-blue-500/50 focus:border-blue-500/50'
                        }`}
                        placeholder="exemple@email.com"
                        title="Caractères autorisés : a-z, A-Z, 0-9, @, ., -, _"
                      />
                    </div>
                    {/* Feedback en temps réel */}
                    {emailValidation.charCount > 0 && (
                      <div className="mt-1 flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          emailValidation.isLimitReached ? 'bg-blue-400' : 
                          emailValidation.isValid ? 'bg-green-400' : 'bg-red-400'
                        }`}></div>
                        <p className={`text-xs ${
                          emailValidation.isLimitReached ? 'text-blue-300' : 
                          emailValidation.isValid ? 'text-green-300' : 'text-red-300'
                        }`}>
                          {emailValidation.message}
                        </p>
                      </div>
                    )}
            </div>
          </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Rôle <span className="text-red-400">*</span>
                    </label>
                    <select
                      required
                      value={formData.role}
                      onChange={(e) => {
                        const newRole = e.target.value;
                        let newPermissions = formData.permissions;
                        
                        // Si le rôle change de superadmin vers autre chose, retirer la permission "users"
                        if (formData.role === 'superadmin' && newRole !== 'superadmin') {
                          newPermissions = formData.permissions.filter((p: string) => p !== 'users');
                        }
                        
                        setFormData({
                          ...formData, 
                          role: newRole,
                          permissions: newPermissions
                        });
                      }}
                      disabled={formData.role === 'superadmin' && user} // Désactivé seulement en modification, pas en création
                      className={`admin-input focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 ${
                        formData.role === 'superadmin' && user ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <option value="club_admin">Admin Club</option>
                      <option value="admin">Administrateur</option>
                      <option value="superadmin">Super Administrateur</option>
                    </select>
                    <div className="text-xs text-white/60">
                      {formData.role === 'club_admin' && 'Gestion des clubs assignés uniquement'}
                      {formData.role === 'admin' && 'Gestion complète de tous les clubs'}
                      {formData.role === 'superadmin' && user && (
                        <span className="text-yellow-400">
                          Accès complet à toutes les fonctionnalités - Le rôle ne peut pas être modifié
                        </span>
                      )}
                      {formData.role === 'superadmin' && !user && (
                        <span className="text-yellow-400">
                          Accès complet à toutes les fonctionnalités
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      maxLength={14} // XX XX XX XX XX = 14 caractères avec espaces
                      className="admin-input focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50"
                      placeholder="01 02 03 04 05"
                      title="Format français : XX XX XX XX XX"
                    />
                  </div>
                </div>

                {/* Mot de passe initial (création seulement) */}
          {!user && (
                  <div className="space-y-1">
                    <label className="block text-sm font-medium text-white/90 mb-1">
                      Mot de passe <span className="text-red-400">*</span>
                      <span className="text-white/60 text-xs ml-2">(8-50 caractères)</span>
              </label>
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!user}
                    minLength={8}
                    maxLength={50}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                          className="admin-input pr-10 focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500/50"
                    placeholder="Minimum 8 caractères, maximum 50"
                  />
                  <button
                    type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center hover:bg-white/5 rounded-r-lg transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                          title={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  >
                    {showPassword ? (
                            <EyeOff className="h-5 w-5 text-white/60 hover:text-white" />
                    ) : (
                            <Eye className="h-5 w-5 text-white/60 hover:text-white" />
                    )}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors flex items-center space-x-2 border border-yellow-500/20"
                        title="Générer un mot de passe sécurisé"
                >
                  <RefreshCw className="w-4 h-4" />
                        <span className="text-sm font-medium">Générer</span>
                </button>
                {formData.password && (
                  <button
                    type="button"
                    onClick={copyPassword}
                          className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center space-x-1 border border-gray-500/20"
                    title="Copier le mot de passe"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
              </div>
              {formData.password && (
                      <div className="flex items-center space-x-3 mt-1 text-xs">
                        <span className="text-white/60">
                          Longueur: <span className="text-white">{formData.password.length}</span>
                        </span>
                        {formData.password.length >= 8 && (
                          <span className="text-green-400 flex items-center space-x-1">
                            <span className="w-1 h-1 bg-green-400 rounded-full"></span>
                            <span>OK</span>
                          </span>
                        )}
                      </div>
                    )}
                </div>
              )}
            </div>
          )}

            {/* Onglet Clubs */}
            {activeTab === 'clubs' && (
              <div className="space-y-4">
                {formData.role === 'superadmin' ? (
                  <div className="text-center py-8 text-white/60">
                    <div className="text-lg font-medium mb-2">Accès complet</div>
                    <div className="text-sm">Le super administrateur a accès à tous les clubs</div>
                  </div>
                ) : (
                  <div className={`p-4 rounded border transition-colors ${
                    (!formData.clubAccess || formData.clubAccess.length === 0) 
                      ? 'border-red-500/50 bg-red-500/10' 
                      : 'border-white/20 bg-white/5'
                  }`}>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-white/90">
                        Clubs assignés <span className="text-red-400">*</span>
            </label>
                      <span className="text-xs text-white/60">
                        {formData.clubAccess.length} / {Object.keys(dbClubsById).length}
                      </span>
          </div>
                    <p className="text-xs text-white/60 mb-4">
                      Au moins un club doit être sélectionné
                    </p>
                    
                    {/* Option "Tous les clubs" */}
                    <div className="mb-4 p-3 bg-white/5 rounded border border-white/10 hover:bg-white/10 transition-colors">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.clubAccess.length === Object.keys(dbClubsById).length && formData.clubAccess.length > 0}
                          onChange={(e) => handleSelectAllClubs(e.target.checked)}
                          className="rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 w-4 h-4"
                        />
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-white">Tous les clubs</span>
                          <span className="text-xs text-white/60 bg-white/10 px-2 py-1 rounded">
                            {Object.keys(dbClubsById).length}
                          </span>
                        </div>
              </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {Object.entries(dbClubsById).map(([clubId, clubName]) => (
                        <label key={clubId} className="flex items-center space-x-2 p-2 rounded hover:bg-white/5 transition-colors cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.clubAccess.includes(clubId)}
                      onChange={(e) => handleClubAccessChange(clubId, e.target.checked)}
                            className="rounded border-white/30 bg-white/10 text-green-500 focus:ring-green-500 w-4 h-4"
                    />
                          <span className="text-xs text-white/90">{clubName}</span>
                  </label>
                ))}
              </div>
                  </div>
                )}
            </div>
          )}

            {/* Onglet Permissions */}
            {activeTab === 'permissions' && (
              <div className="space-y-4">
                {formData.role === 'superadmin' ? (
                  <div className="text-center py-8 text-white/60">
                    <div className="text-lg font-medium mb-2">Permissions complètes</div>
                    <div className="text-sm">Le super administrateur a toutes les permissions</div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-white/90">
                        Fonctionnalités autorisées
              </label>
                      <span className="text-xs text-white/60">
                        {formData.permissions.length} / {allPermissions.length}
                      </span>
                    </div>
                    
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {allPermissions.map(permission => {
                        const isUsersPermission = permission.id === 'users';
                        const isSuperAdmin = formData.role === 'superadmin';
                        const isDisabled = isUsersPermission && !isSuperAdmin;
                        
                        return (
                          <label 
                            key={permission.id} 
                            className={`flex items-center space-x-3 p-3 rounded transition-colors border border-white/10 ${
                              isDisabled 
                                ? 'opacity-50 cursor-not-allowed' 
                                : 'hover:bg-white/5 cursor-pointer'
                            }`}
                          >
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                              disabled={isDisabled}
                              className="rounded border-white/30 bg-white/10 text-orange-500 focus:ring-orange-500 w-4 h-4"
                            />
                            <div className="flex-1">
                              <span className={`text-sm block ${
                                isDisabled ? 'text-white/50' : 'text-white/90'
                              }`}>
                                {permission.label}
                              </span>
                              {isUsersPermission && !isSuperAdmin && (
                                <span className="text-xs text-yellow-400 block mt-1">
                                  Réservé aux Super Administrateurs
                                </span>
                              )}
                            </div>
                  </label>
                        );
                      })}
              </div>
            </div>
          )}
              </div>
            )}
          </div>


          {/* Boutons d'action */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              Annuler
            </button>
            <button
              type="submit"
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                user 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 border border-blue-500/20 hover:border-blue-400/30' 
                  : 'bg-green-600 text-white hover:bg-green-700 border border-green-500/20 hover:border-green-400/30'
              }`}
            >
              {user ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;