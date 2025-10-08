import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  FileText, 
  Calendar, 
  Mail, 
  Image, 
  HelpCircle, 
  UserCog, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X,
  Zap,
  ExternalLink,
  Shield,
  ShieldCheck
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useMaintenance } from '../context/MaintenanceContext';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAdmin();
  const { isMaintenanceMode, isLoading, toggleMaintenanceMode } = useMaintenance();
  const location = useLocation();

  // Fonction pour obtenir le titre de la page actuelle
  const getPageTitle = () => {
    const currentPath = location.pathname;
    switch (currentPath) {
      case '/':
        return 'Dashboard';
      case '/members':
        return 'Gestion des adhérents';
      case '/clubs':
        return 'Gestion des clubs';
      case '/content':
        return 'Gestion des contenus';
      case '/events':
        return 'Gestion des événements';
      case '/communications':
        return 'Gestion des communications';
      case '/media':
        return 'Gestion des médias';
      case '/faq':
        return 'Gestion des FAQ';
      case '/users':
        return 'Gestion des utilisateurs';
      case '/reports':
        return 'Rapports';
      case '/settings':
        return 'Paramètres';
      default:
        return '';
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Adhérents', href: '/members', icon: Users, permission: 'members' },
    { name: 'Clubs', href: '/clubs', icon: Building2 },
    { name: 'Contenus', href: '/content', icon: FileText },
    { name: 'Événements', href: '/events', icon: Calendar },
    { name: 'Communications', href: '/communications', icon: Mail },
    { name: 'Médias', href: '/media', icon: Image },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Utilisateurs', href: '/users', icon: UserCog, permission: 'users' },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

  // Filtrer les éléments de navigation selon les permissions
  const filteredNavigation = navigation.filter(item => {
    if (item.permission) {
      return user?.permissions?.includes(item.permission) || user?.permissions?.includes('all');
    }
    return true;
  });

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };


  return (
    <div className="h-screen bg-gradient-to-br from-slate-900 via-red-900 to-slate-800 flex overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 xl:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out xl:translate-x-0 xl:static xl:inset-0 xl:flex xl:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gradient-to-r from-red-600 to-red-700 border-b border-white/20">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-red-900" />
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">Admin Phuong Long</div>
              <div className="text-xs text-yellow-200">Vo Dao</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="xl:hidden text-white hover:text-yellow-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8 overflow-y-auto">
          <div className="px-4 space-y-2 pb-4">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-yellow-400/20 to-red-500/20 text-white border-r-2 border-yellow-400 shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white hover:shadow-md'
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* User info and logout */}
        <div className="flex-shrink-0 p-4 border-t border-white/20 bg-white/5">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.name}
              </p>
              <p className="text-xs text-yellow-200 truncate">
                {user?.role === 'superadmin' ? 'Super Admin' : 
                 user?.role === 'admin' ? 'Administrateur' : 'Admin Club'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-white/80 hover:bg-white/10 hover:text-white rounded-lg transition-all duration-200 hover:shadow-md"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - Fixe */}
        <div className="flex-shrink-0 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <div className="flex items-center justify-between h-12 lg:h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-3 lg:space-x-4 min-w-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="xl:hidden text-white/80 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              {getPageTitle() && (
                <h1 className="text-base lg:text-xl font-bold text-white truncate max-w-[45vw] lg:max-w-none">
                  {getPageTitle()}
                </h1>
              )}
              <span className="hidden lg:inline text-sm text-white/70">
                Dernière connexion: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-2 lg:space-x-4">
              {/* Bouton Site - version mobile icône seule */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex lg:hidden items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                title="Aller sur le site principal"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
              {/* Bouton Site - version desktop texte + icône */}
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                title="Aller sur le site principal"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Site</span>
              </a>

              {/* Mode Maintenance Switch */}
              <div className="flex items-center space-x-2">
                {isMaintenanceMode ? (
                  <ShieldCheck className="w-4 h-4 text-orange-500" />
                ) : (
                  <Shield className="w-4 h-4 text-white/60" />
                )}
                <button
                  onClick={toggleMaintenanceMode}
                  disabled={isLoading}
                  className={`relative inline-flex h-5 w-9 lg:h-6 lg:w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMaintenanceMode ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                  title={isLoading ? 'Chargement...' : (isMaintenanceMode ? 'Désactiver le mode maintenance' : 'Activer le mode maintenance')}
                >
                  <span
                    className={`inline-block h-3 w-3 lg:h-4 lg:w-4 transform rounded-full bg-white transition-transform ${
                      isMaintenanceMode ? 'translate-x-5 lg:translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="hidden lg:inline text-xs text-white/70">
                  {isLoading ? '...' : (isMaintenanceMode ? 'Maintenance' : 'Normal')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Internal components handle their own scroll */}
        <main className="flex-1 p-6 overflow-hidden admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;