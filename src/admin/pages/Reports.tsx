import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Users, 
  TrendingUp,
  PieChart,
  Activity,
  FileText
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart, Line } from 'recharts';

const Reports: React.FC = () => {
  const { members, clubs, events, communications, facebookPosts } = useAdmin();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Data preparation
  const membersByClub = clubs.map(club => ({
    name: club.name,
    members: members.filter(m => m.clubId === club.id).length,
    active: members.filter(m => m.clubId === club.id && m.status === 'active').length
  }));

  const membersByStatus = [
    { name: 'Actifs', value: members.filter(m => m.status === 'active').length, color: '#10B981' },
    { name: 'Inactifs', value: members.filter(m => m.status === 'inactive').length, color: '#F59E0B' },
    { name: 'Suspendus', value: members.filter(m => m.status === 'suspended').length, color: '#EF4444' }
  ];

  const eventsByType = [
    { name: 'Stages', value: events.filter(e => e.type === 'stage').length, color: '#3B82F6' },
    { name: 'Compétitions', value: events.filter(e => e.type === 'competition').length, color: '#EF4444' },
    { name: 'Démonstrations', value: events.filter(e => e.type === 'demonstration').length, color: '#10B981' },
    { name: 'Réunions', value: events.filter(e => e.type === 'meeting').length, color: '#8B5CF6' }
  ];

  const monthlyActivity = [
    { month: 'Jan', members: 45, events: 3, posts: 8 },
    { month: 'Fév', members: 48, events: 2, posts: 12 },
    { month: 'Mar', members: 52, events: 4, posts: 15 },
    { month: 'Avr', members: 55, events: 3, posts: 10 },
    { month: 'Mai', members: 58, events: 5, posts: 18 },
    { month: 'Jun', members: 62, events: 2, posts: 14 }
  ];

  const exportReport = (type: string) => {
    let csvContent = '';
    let filename = '';

    switch (type) {
      case 'members':
        csvContent = [
          ['Club', 'Membres totaux', 'Membres actifs', 'Taux d\'activité'].join(','),
          ...membersByClub.map(club => [
            club.name,
            club.members,
            club.active,
            `${Math.round((club.active / club.members) * 100)}%`
          ].join(','))
        ].join('\n');
        filename = 'rapport-adherents.csv';
        break;
      
      case 'events':
        csvContent = [
          ['Titre', 'Date', 'Type', 'Club', 'Participants', 'Statut'].join(','),
          ...events.map(event => [
            event.title,
            event.date,
            event.type,
            clubs.find(c => c.id === event.clubId)?.name || 'Inconnu',
            `${event.currentParticipants}/${event.maxParticipants}`,
            event.registrationOpen ? 'Ouvert' : 'Fermé'
          ].join(','))
        ].join('\n');
        filename = 'rapport-evenements.csv';
        break;
      
      default:
        return;
    }

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rapports et statistiques</h1>
          <p className="text-gray-600">Analyse des données de l'association</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="admin-input"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="admin-card">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'overview', label: 'Vue d\'ensemble', icon: BarChart3 },
            { id: 'members', label: 'Adhérents', icon: Users },
            { id: 'events', label: 'Événements', icon: Calendar },
            { id: 'engagement', label: 'Engagement', icon: Activity }
          ].map(report => {
            const Icon = report.icon;
            return (
              <button
                key={report.id}
                onClick={() => setSelectedReport(report.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedReport === report.id
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{report.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Overview Report */}
      {selectedReport === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total adhérents</p>
                  <p className="text-2xl font-semibold text-gray-900">{members.length}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+8.2%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-500">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Événements</p>
                  <p className="text-2xl font-semibold text-gray-900">{events.length}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+15.3%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-500">
                  <Activity className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Posts Facebook</p>
                  <p className="text-2xl font-semibold text-gray-900">{facebookPosts.length}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+12.1%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="admin-card">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-yellow-500">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Communications</p>
                  <p className="text-2xl font-semibold text-gray-900">{communications.length}</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">+5.7%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Chart */}
          <div className="admin-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Évolution mensuelle</h3>
              <button
                onClick={() => exportReport('activity')}
                className="admin-button-secondary flex items-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Exporter</span>
              </button>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyActivity}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="members" stroke="#3B82F6" strokeWidth={2} name="Adhérents" />
                  <Line type="monotone" dataKey="events" stroke="#10B981" strokeWidth={2} name="Événements" />
                  <Line type="monotone" dataKey="posts" stroke="#8B5CF6" strokeWidth={2} name="Posts" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Members Report */}
      {selectedReport === 'members' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Members by Club */}
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Adhérents par club</h3>
                <button
                  onClick={() => exportReport('members')}
                  className="admin-button-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={membersByClub}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="members" fill="#3B82F6" name="Total" />
                    <Bar dataKey="active" fill="#10B981" name="Actifs" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Members by Status */}
            <div className="admin-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Répartition par statut</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={membersByStatus} cx="50%" cy="50%" outerRadius={80}>
                      {membersByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center space-x-4 mt-4">
                {membersByStatus.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Detailed Members Table */}
          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Détail par club</h3>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Club</th>
                    <th>Total adhérents</th>
                    <th>Actifs</th>
                    <th>Inactifs</th>
                    <th>Taux d'activité</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {membersByClub.map((club) => (
                    <tr key={club.name}>
                      <td className="font-medium text-gray-900">{club.name}</td>
                      <td>{club.members}</td>
                      <td>
                        <span className="admin-badge admin-badge-success">
                          {club.active}
                        </span>
                      </td>
                      <td>
                        <span className="admin-badge admin-badge-warning">
                          {club.members - club.active}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${(club.active / club.members) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">
                            {Math.round((club.active / club.members) * 100)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Events Report */}
      {selectedReport === 'events' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events by Type */}
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Événements par type</h3>
                <button
                  onClick={() => exportReport('events')}
                  className="admin-button-secondary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Exporter</span>
                </button>
              </div>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Tooltip />
                    <RechartsPieChart data={eventsByType} cx="50%" cy="50%" outerRadius={80}>
                      {eventsByType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </RechartsPieChart>
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-2 mt-4">
                {eventsByType.map((entry, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-sm text-gray-600">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Event Participation */}
            <div className="admin-card">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Taux de participation</h3>
              <div className="space-y-4">
                {events.slice(0, 5).map((event) => (
                  <div key={event.id} className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {event.title}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(event.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2 ml-4">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ 
                            width: `${(event.currentParticipants / event.maxParticipants) * 100}%` 
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-16 text-right">
                        {event.currentParticipants}/{event.maxParticipants}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Report */}
      {selectedReport === 'engagement' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="admin-card text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Taux d'ouverture</h3>
              <p className="text-3xl font-bold text-blue-600">
                {communications.length > 0 
                  ? Math.round(communications.reduce((acc, c) => acc + c.openRate, 0) / communications.length)
                  : 0}%
              </p>
              <p className="text-sm text-gray-600">Communications</p>
            </div>

            <div className="admin-card text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Engagement Facebook</h3>
              <p className="text-3xl font-bold text-green-600">
                {facebookPosts.reduce((acc, p) => acc + p.likes + p.comments + p.shares, 0)}
              </p>
              <p className="text-sm text-gray-600">Interactions totales</p>
            </div>

            <div className="admin-card text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Participation événements</h3>
              <p className="text-3xl font-bold text-purple-600">
                {events.reduce((acc, e) => acc + e.currentParticipants, 0)}
              </p>
              <p className="text-sm text-gray-600">Participants totaux</p>
            </div>
          </div>

          <div className="admin-card">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance des communications</h3>
            <div className="overflow-x-auto">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Titre</th>
                    <th>Type</th>
                    <th>Date d'envoi</th>
                    <th>Destinataires</th>
                    <th>Taux d'ouverture</th>
                    <th>Taux de clic</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {communications.filter(c => c.status === 'sent').map((comm) => (
                    <tr key={comm.id}>
                      <td className="font-medium text-gray-900">{comm.title}</td>
                      <td>
                        <span className="admin-badge bg-blue-100 text-blue-800">
                          {comm.type}
                        </span>
                      </td>
                      <td>{new Date(comm.sentAt).toLocaleDateString('fr-FR')}</td>
                      <td>{comm.recipients.length}</td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-600 h-2 rounded-full" 
                              style={{ width: `${comm.openRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{comm.openRate}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${comm.clickRate}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-600">{comm.clickRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;