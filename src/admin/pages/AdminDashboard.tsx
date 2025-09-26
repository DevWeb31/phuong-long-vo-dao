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
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-white/70">Vue d'ensemble de l'activité</p>
        </div>
        <div className="text-sm text-white/60">
          Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200">
              <div className="flex items-center">
                <div className="p-3 bg-gradient-to-br from-yellow-400/20 to-red-500/20 rounded-lg border border-white/20">
                  <Icon className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-white/80">{stat.name}</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-semibold text-white">
                      {stat.value}
                    </p>
                    {stat.total && (
                      <p className="text-sm text-white/60 ml-1">
                        /{stat.total}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-yellow-300">{stat.change}</span>
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
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Activité récente</h3>
            <Activity className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto admin-scroll">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white">
                      <span className="font-medium text-yellow-300">{activity.userName}</span> {activity.description}
                    </p>
                    <p className="text-xs text-white/60">
                      {new Date(activity.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-white/60 text-center py-4">Aucune activité récente</p>
            )}
          </div>
        </div>

        {/* Club Overview */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Aperçu des clubs</h3>
            <Building2 className="w-5 h-5 text-yellow-400" />
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto admin-scroll">
            {clubs.map((club) => (
              <div key={club.id} className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-lg">
                <div>
                  <p className="font-medium text-white">{club.name}</p>
                  <p className="text-sm text-white/70">{club.city} ({club.department})</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-semibold text-white">{club.memberCount}</p>
                  <p className="text-xs text-white/60">membres</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <div className="admin-card">
          <h3 className="text-lg font-semibold text-white mb-4">Actions rapides</h3>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-blue-600 mr-3" />
              <span className="font-medium text-blue-900">Ajouter un adhérent</span>
            </button>
            <button className="flex items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
              <Calendar className="w-5 h-5 text-green-600 mr-3" />
              <span className="font-medium text-green-900">Créer un événement</span>
            </button>
            <button className="flex items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
              <Mail className="w-5 h-5 text-purple-600 mr-3" />
              <span className="font-medium text-purple-900">Envoyer newsletter</span>
            </button>
          </div>
        </div>

        {/* Alerts */}
        <div className="admin-card">
          <div className="flex items-center mb-4">
            <AlertCircle className="w-5 h-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-white">Alertes et notifications</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
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
              <Facebook className="w-4 h-4 text-blue-500 mt-0.5" />
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
    </div>
  );
};

export default AdminDashboard;