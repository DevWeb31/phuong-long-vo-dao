import React, { useState } from 'react';
import { 
  UserCog, 
  Plus, 
  Edit, 
  Trash2, 
  Shield, 
  Eye, 
  EyeOff,
  Search,
  Filter
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const UserManagement: React.FC = () => {
  const { user: currentUser, clubs } = useAdmin();
  const [users, setUsers] = useState([
    {
      id: '1',
      email: 'admin@phuonglong.fr',
      name: 'Administrateur Principal',
      role: 'superadmin',
      clubAccess: ['montaigut', 'tregeux', 'lanester', 'cublize', 'wimille'],
      permissions: ['all'],
      lastLogin: '2024-01-15T10:30:00Z',
      isActive: true,
      createdAt: '2023-01-01T00:00:00Z'
    },
    {
      id: '2',
      email: 'club.montaigut@phuonglong.fr',
      name: 'Admin Montaigut',
      role: 'club_admin',
      clubAccess: ['montaigut'],
      permissions: ['members', 'events', 'content'],
      lastLogin: '2024-01-14T18:45:00Z',
      isActive: true,
      createdAt: '2023-06-15T00:00:00Z'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
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
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteUser = (id: string) => {
    if (id === currentUser?.id) {
      toast.error('Vous ne pouvez pas supprimer votre propre compte');
      return;
    }
    
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== id));
      toast.success('Utilisateur supprimé avec succès');
    }
  };

  const handleToggleStatus = (id: string) => {
    if (id === currentUser?.id) {
      toast.error('Vous ne pouvez pas désactiver votre propre compte');
      return;
    }

    setUsers(users.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    ));
    
    const user = users.find(u => u.id === id);
    toast.success(`Utilisateur ${user?.isActive ? 'désactivé' : 'activé'} avec succès`);
  };

  const handleSaveUser = (userData: any) => {
    if (selectedUser) {
      setUsers(users.map(u => 
        u.id === selectedUser.id ? { ...u, ...userData } : u
      ));
      toast.success('Utilisateur modifié avec succès');
    } else {
      const newUser = {
        ...userData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        lastLogin: null
      };
      setUsers([...users, newUser]);
      toast.success('Utilisateur créé avec succès');
    }
    setShowCreateModal(false);
    setSelectedUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
          <p className="text-gray-600">{filteredUsers.length} utilisateur(s) trouvé(s)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter un utilisateur</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-red-500">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Super Admins</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'superadmin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-500">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Administrateurs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-500">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Admins Club</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.role === 'club_admin').length}
              </p>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-500">
              <UserCog className="w-6 h-6 text-white" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Actifs</p>
              <p className="text-2xl font-semibold text-gray-900">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="admin-input pl-10"
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les rôles</option>
            <option value="superadmin">Super Administrateur</option>
            <option value="admin">Administrateur</option>
            <option value="club_admin">Admin Club</option>
          </select>
          
          <button className="admin-button-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Utilisateur</th>
                <th>Rôle</th>
                <th>Accès clubs</th>
                <th>Statut</th>
                <th>Dernière connexion</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td>
                    <div>
                      <div className="font-medium text-gray-900">{user.name}</div>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${getRoleColor(user.role)}`}>
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td>
                    <div className="text-sm text-gray-900">
                      {user.role === 'superadmin' ? (
                        <span className="text-red-600 font-medium">Tous les clubs</span>
                      ) : (
                        <div className="space-y-1">
                          {user.clubAccess.map(clubId => {
                            const club = clubs.find(c => c.id === clubId);
                            return club ? (
                              <div key={clubId} className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {club.name}
                              </div>
                            ) : null;
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <span className={`admin-badge ${
                        user.isActive ? 'admin-badge-success' : 'admin-badge-error'
                      }`}>
                        {user.isActive ? 'Actif' : 'Inactif'}
                      </span>
                      {user.id === currentUser?.id && (
                        <span className="text-xs text-blue-600">(Vous)</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className="text-sm text-gray-900">
                      {user.lastLogin 
                        ? new Date(user.lastLogin).toLocaleDateString('fr-FR')
                        : 'Jamais'
                      }
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowCreateModal(true);
                        }}
                        className="text-green-600 hover:text-green-800"
                        title="Modifier"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className={`${
                          user.isActive 
                            ? 'text-yellow-600 hover:text-yellow-800' 
                            : 'text-green-600 hover:text-green-800'
                        }`}
                        title={user.isActive ? 'Désactiver' : 'Activer'}
                        disabled={user.id === currentUser?.id}
                      >
                        {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-800"
                        title="Supprimer"
                        disabled={user.id === currentUser?.id}
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
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <UserCog className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Aucun utilisateur trouvé
            </h3>
            <p className="text-gray-600">
              Aucun utilisateur ne correspond aux critères sélectionnés.
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit User Modal */}
      {showCreateModal && (
        <UserModal
          user={selectedUser}
          clubs={clubs}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedUser(null);
          }}
          onSave={handleSaveUser}
        />
      )}
    </div>
  );
};

// User Modal Component
const UserModal: React.FC<{
  user: any;
  clubs: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ user, clubs, onClose, onSave }) => {
  const [formData, setFormData] = useState(user || {
    name: '',
    email: '',
    role: 'club_admin',
    clubAccess: [],
    permissions: [],
    isActive: true,
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    let finalData = { ...formData };
    
    // Set permissions based on role
    if (formData.role === 'superadmin') {
      finalData.permissions = ['all'];
      finalData.clubAccess = clubs.map(c => c.id);
    } else if (formData.role === 'admin') {
      finalData.clubAccess = clubs.map(c => c.id);
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

  const handlePermissionChange = (permission: string, checked: boolean) => {
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
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {user ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom complet *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="admin-input"
              />
            </div>
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
          </div>

          {/* Password */}
          {!user && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mot de passe *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required={!user}
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="admin-input pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rôle *
            </label>
            <select
              required
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="admin-input"
            >
              <option value="club_admin">Admin Club</option>
              <option value="admin">Administrateur</option>
              <option value="superadmin">Super Administrateur</option>
            </select>
          </div>

          {/* Club Access */}
          {formData.role !== 'superadmin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Accès aux clubs
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {clubs.map(club => (
                  <label key={club.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.clubAccess.includes(club.id)}
                      onChange={(e) => handleClubAccessChange(club.id, e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">{club.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Permissions */}
          {formData.role !== 'superadmin' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Permissions
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {allPermissions.map(permission => (
                  <label key={permission.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.permissions.includes(permission.id)}
                      onChange={(e) => handlePermissionChange(permission.id, e.target.checked)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                    <span className="text-sm">{permission.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Utilisateur actif
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
              {user ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;