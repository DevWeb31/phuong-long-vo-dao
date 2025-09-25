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
    <div className="h-screen bg-gray-100 flex overflow-hidden">
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
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 bg-red-600">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
              <Zap className="w-5 h-5 text-red-900" />
            </div>
            <div className="text-white">
              <div className="font-bold text-sm">Admin Phuong Long</div>
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
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                    isActive(item.href)
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
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
        <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">
                {user?.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.role === 'superadmin' ? 'Super Admin' : 
                 user?.role === 'admin' ? 'Administrateur' : 'Admin Club'}
              </p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center w-full px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar - Fixe */}
        <div className="flex-shrink-0 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-gray-600 hover:text-gray-900"
              >
                <Menu className="w-6 h-6" />
              </button>
              <span className="text-sm text-gray-500">
                Dernière connexion: {user?.lastLogin ? new Date(user.lastLogin).toLocaleString('fr-FR') : 'N/A'}
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors shadow-sm hover:shadow-md"
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
                  <Shield className="w-4 h-4 text-gray-400" />
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
                <span className="text-xs text-gray-600">
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