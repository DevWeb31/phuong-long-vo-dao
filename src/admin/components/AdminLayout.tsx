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

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Adhérents', href: '/members', icon: Users },
    { name: 'Clubs', href: '/clubs', icon: Building2 },
    { name: 'Contenus', href: '/content', icon: FileText },
    { name: 'Événements', href: '/events', icon: Calendar },
    { name: 'Communications', href: '/communications', icon: Mail },
    { name: 'Médias', href: '/media', icon: Image },
    { name: 'FAQ', href: '/faq', icon: HelpCircle },
    { name: 'Utilisateurs', href: '/users', icon: UserCog },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
    { name: 'Paramètres', href: '/settings', icon: Settings },
  ];

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
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        >
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75"></div>
        </div>
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white/10 backdrop-blur-lg border-r border-white/20 shadow-2xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${
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
            className="lg:hidden text-white hover:text-yellow-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 mt-8 overflow-y-auto">
          <div className="px-4 space-y-2 pb-4">
            {navigation.map((item) => {
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
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-white/80 hover:text-white"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-sm text-white/70">
                Dernière connexion: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    isMaintenanceMode ? 'bg-orange-500' : 'bg-gray-200'
                  }`}
                  title={isLoading ? 'Chargement...' : (isMaintenanceMode ? 'Désactiver le mode maintenance' : 'Activer le mode maintenance')}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isMaintenanceMode ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className="text-xs text-white/70">
                  {isLoading ? '...' : (isMaintenanceMode ? 'Maintenance' : 'Normal')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 p-6 overflow-y-auto admin-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;