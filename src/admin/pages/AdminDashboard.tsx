import React from 'react';
import { 
  Users, 
  Building2, 
  Calendar, 
  TrendingUp, 
  Activity,
  Facebook,
  Mail,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const AdminDashboard: React.FC = () => {
  const { clubs, members, events, facebookPosts, communications, activityLogs } = useAdmin();

  const totalMembers = members.length;
  const activeMembers = members.filter(m => m.status === 'active').length;
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length;
  const recentPosts = facebookPosts.filter(p => 
    new Date(p.date) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
  ).length;

  const stats = [
    {
      name: 'Adhérents actifs',
      value: activeMembers,
      total: totalMembers,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      name: 'Clubs actifs',
      value: clubs.filter(c => c.isActive).length,
      total: clubs.length,
      icon: Building2,
      color: 'bg-green-500',
      change: '0%'
    },
    {
      name: 'Événements à venir',
      value: upcomingEvents,
      total: events.length,
      icon: Calendar,
      color: 'bg-purple-500',
      change: '+25%'
    },
    {
      name: 'Posts cette semaine',
      value: recentPosts,
      total: facebookPosts.length,
      icon: Facebook,
      color: 'bg-blue-600',
      change: '+8%'
    }
  ];

  const recentActivities = activityLogs.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Vue d'ensemble de l'activité</p>
        </div>
        <div className="text-sm text-gray-500">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="admin-card">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.total && (
                      <p className="text-sm text-gray-500 ml-1">
                        /{stat.total}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Activité récente</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">
                      <span className="font-medium">{activity.userName}</span> {activity.details}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Club Overview */}
        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Aperçu des clubs</h3>
            <Building2 className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {clubs.map((club) => (
              <div key={club.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{club.name}</p>
                  <p className="text-sm text-gray-600">{club.city} ({club.department})</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-gray-900">{club.memberCount}</p>
                  <p className="text-xs text-gray-500">membres</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center justify-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Users className="w-6 h-6 text-blue-600 mr-3" />
            <span className="font-medium text-blue-900">Ajouter un adhérent</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <Calendar className="w-6 h-6 text-green-600 mr-3" />
            <span className="font-medium text-green-900">Créer un événement</span>
          </button>
          <button className="flex items-center justify-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <Mail className="w-6 h-6 text-purple-600 mr-3" />
            <span className="font-medium text-purple-900">Envoyer newsletter</span>
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="admin-card">
        <div className="flex items-center mb-4">
          <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
          <h3 className="text-lg font-semibold text-gray-900">Alertes et notifications</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-orange-900">
                3 adhérents ont des cotisations en retard
              </p>
              <p className="text-xs text-orange-700">
                Vérifiez les paiements dans la section adhérents
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
            <Facebook className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">
                Nouveaux posts Facebook à synchroniser
              </p>
              <p className="text-xs text-blue-700">
                2 clubs ont de nouveaux contenus disponibles
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;