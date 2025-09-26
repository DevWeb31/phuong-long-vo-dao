import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  Globe, 
  Mail, 
  Bell, 
  Shield, 
  Database,
  Palette,
  Facebook,
  Key
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const Settings: React.FC = () => {
  const { user } = useAdmin();
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      associationName: 'Phuong Long Vo Dao',
      description: 'Fédération de 5 clubs dédiés à la pratique authentique du Vo Dao sino-vietnamien',
      email: 'contact@phuonglong.fr',
      phone: '05 61 85 42 30',
      address: 'Siège social - France',
      website: 'https://phuonglong.fr',
      timezone: 'Europe/Paris',
      language: 'fr'
    },
    notifications: {
      emailNotifications: true,
      newMemberNotifications: true,
      eventReminders: true,
      facebookSyncNotifications: true,
      systemAlerts: true,
      weeklyReports: true,
      monthlyReports: true
    },
    facebook: {
      autoSync: true,
      syncInterval: 60, // minutes
      publishToSite: true,
      moderateComments: false,
      clubs: {
        montaigut: { pageId: 'montaigut-vo-dao', enabled: true },
        tregeux: { pageId: 'tregeux-vo-dao', enabled: true },
        lanester: { pageId: 'lanester-vo-dao', enabled: true },
        cublize: { pageId: 'cublize-vo-dao', enabled: true },
        wimille: { pageId: 'wimille-vo-dao', enabled: true }
      }
    },
    security: {
      sessionTimeout: 120, // minutes
      passwordMinLength: 8,
      requireTwoFactor: false,
      allowMultipleSessions: true,
      logRetentionDays: 90,
      backupFrequency: 'daily'
    },
    appearance: {
      theme: 'light',
      primaryColor: '#DC2626',
      secondaryColor: '#F59E0B',
      logoUrl: '',
      faviconUrl: '',
      customCss: ''
    }
  });

  const tabs = [
    { id: 'general', label: 'Général', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'facebook', label: 'Facebook', icon: Facebook },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette }
  ];

  const handleSave = (section: string) => {
    // Here you would save the settings to your backend
    toast.success(`Paramètres ${section} sauvegardés avec succès`);
  };

  const updateSetting = (section: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const updateNestedSetting = (section: string, parentKey: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [parentKey]: {
          ...(prev[section as keyof typeof prev] as any)[parentKey],
          [key]: value
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Paramètres</h1>
          <p className="text-white/70">Configuration de l'application</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="admin-card">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      activeTab === tab.id
                        ? 'bg-red-100 text-red-700'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5 mr-3" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Paramètres généraux</h3>
                <button
                  onClick={() => handleSave('général')}
                  className="admin-button-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Nom de l'association
                    </label>
                    <input
                      type="text"
                      value={settings.general.associationName}
                      onChange={(e) => updateSetting('general', 'associationName', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Email principal
                    </label>
                    <input
                      type="email"
                      value={settings.general.email}
                      onChange={(e) => updateSetting('general', 'email', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Description
                  </label>
                  <textarea
                    value={settings.general.description}
                    onChange={(e) => updateSetting('general', 'description', e.target.value)}
                    rows={3}
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      value={settings.general.phone}
                      onChange={(e) => updateSetting('general', 'phone', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Site web
                    </label>
                    <input
                      type="url"
                      value={settings.general.website}
                      onChange={(e) => updateSetting('general', 'website', e.target.value)}
                      className="admin-input"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Adresse
                  </label>
                  <input
                    type="text"
                    value={settings.general.address}
                    onChange={(e) => updateSetting('general', 'address', e.target.value)}
                    className="admin-input"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Fuseau horaire
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={(e) => updateSetting('general', 'timezone', e.target.value)}
                      className="admin-input"
                    >
                      <option value="Europe/Paris">Europe/Paris</option>
                      <option value="Europe/London">Europe/London</option>
                      <option value="America/New_York">America/New_York</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-1">
                      Langue
                    </label>
                    <select
                      value={settings.general.language}
                      onChange={(e) => updateSetting('general', 'language', e.target.value)}
                      className="admin-input"
                    >
                      <option value="fr">Français</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Settings */}
          {activeTab === 'notifications' && (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Notifications</h3>
                <button
                  onClick={() => handleSave('notifications')}
                  className="admin-button-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-white mb-4">Notifications par email</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'emailNotifications', label: 'Activer les notifications par email' },
                      { key: 'newMemberNotifications', label: 'Nouveaux adhérents' },
                      { key: 'eventReminders', label: 'Rappels d\'événements' },
                      { key: 'facebookSyncNotifications', label: 'Synchronisation Facebook' },
                      { key: 'systemAlerts', label: 'Alertes système' }
                    ].map((notification) => (
                      <label key={notification.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.notifications[notification.key as keyof typeof settings.notifications] as boolean}
                          onChange={(e) => updateSetting('notifications', notification.key, e.target.checked)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-white/80">{notification.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-white mb-4">Rapports automatiques</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'weeklyReports', label: 'Rapports hebdomadaires' },
                      { key: 'monthlyReports', label: 'Rapports mensuels' }
                    ].map((report) => (
                      <label key={report.key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={settings.notifications[report.key as keyof typeof settings.notifications] as boolean}
                          onChange={(e) => updateSetting('notifications', report.key, e.target.checked)}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <span className="text-sm text-white/80">{report.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Facebook Settings */}
          {activeTab === 'facebook' && (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Intégration Facebook</h3>
                <button
                  onClick={() => handleSave('Facebook')}
                  className="admin-button-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-white mb-4">Synchronisation automatique</h4>
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.facebook.autoSync}
                        onChange={(e) => updateSetting('facebook', 'autoSync', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Synchronisation automatique activée</span>
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1">
                          Intervalle de synchronisation (minutes)
                        </label>
                        <input
                          type="number"
                          min="15"
                          max="1440"
                          value={settings.facebook.syncInterval}
                          onChange={(e) => updateSetting('facebook', 'syncInterval', parseInt(e.target.value))}
                          className="admin-input"
                        />
                      </div>
                    </div>

                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.facebook.publishToSite}
                        onChange={(e) => updateSetting('facebook', 'publishToSite', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Publier automatiquement sur le site</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Configuration des clubs</h4>
                  <div className="space-y-4">
                    {Object.entries(settings.facebook.clubs).map(([clubId, config]) => (
                      <div key={clubId} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 capitalize">{clubId}</h5>
                          <label className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={config.enabled}
                              onChange={(e) => updateNestedSetting('facebook', 'clubs', clubId, {
                                ...config,
                                enabled: e.target.checked
                              })}
                              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                            />
                            <span className="text-sm text-gray-700">Activé</span>
                          </label>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-white/80 mb-1">
                            ID de la page Facebook
                          </label>
                          <input
                            type="text"
                            value={config.pageId}
                            onChange={(e) => updateNestedSetting('facebook', 'clubs', clubId, {
                              ...config,
                              pageId: e.target.value
                            })}
                            className="admin-input"
                            placeholder="nom-de-la-page"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Sécurité</h3>
                <button
                  onClick={() => handleSave('sécurité')}
                  className="admin-button-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Authentification</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Durée de session (minutes)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="480"
                        value={settings.security.sessionTimeout}
                        onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Longueur minimale du mot de passe
                      </label>
                      <input
                        type="number"
                        min="6"
                        max="20"
                        value={settings.security.passwordMinLength}
                        onChange={(e) => updateSetting('security', 'passwordMinLength', parseInt(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 mt-4">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.security.requireTwoFactor}
                        onChange={(e) => updateSetting('security', 'requireTwoFactor', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Authentification à deux facteurs obligatoire</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={settings.security.allowMultipleSessions}
                        onChange={(e) => updateSetting('security', 'allowMultipleSessions', e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-gray-700">Autoriser les sessions multiples</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Journalisation et sauvegarde</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Rétention des logs (jours)
                      </label>
                      <input
                        type="number"
                        min="30"
                        max="365"
                        value={settings.security.logRetentionDays}
                        onChange={(e) => updateSetting('security', 'logRetentionDays', parseInt(e.target.value))}
                        className="admin-input"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Fréquence de sauvegarde
                      </label>
                      <select
                        value={settings.security.backupFrequency}
                        onChange={(e) => updateSetting('security', 'backupFrequency', e.target.value)}
                        className="admin-input"
                      >
                        <option value="daily">Quotidienne</option>
                        <option value="weekly">Hebdomadaire</option>
                        <option value="monthly">Mensuelle</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <div className="admin-card">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Apparence</h3>
                <button
                  onClick={() => handleSave('apparence')}
                  className="admin-button-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Sauvegarder</span>
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Thème</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Mode d'affichage
                      </label>
                      <select
                        value={settings.appearance.theme}
                        onChange={(e) => updateSetting('appearance', 'theme', e.target.value)}
                        className="admin-input"
                      >
                        <option value="light">Clair</option>
                        <option value="dark">Sombre</option>
                        <option value="auto">Automatique</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Couleur principale
                      </label>
                      <input
                        type="color"
                        value={settings.appearance.primaryColor}
                        onChange={(e) => updateSetting('appearance', 'primaryColor', e.target.value)}
                        className="admin-input h-10"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        Couleur secondaire
                      </label>
                      <input
                        type="color"
                        value={settings.appearance.secondaryColor}
                        onChange={(e) => updateSetting('appearance', 'secondaryColor', e.target.value)}
                        className="admin-input h-10"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-md font-medium text-gray-900 mb-4">Logos et icônes</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        URL du logo
                      </label>
                      <input
                        type="url"
                        value={settings.appearance.logoUrl}
                        onChange={(e) => updateSetting('appearance', 'logoUrl', e.target.value)}
                        className="admin-input"
                        placeholder="https://..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1">
                        URL du favicon
                      </label>
                      <input
                        type="url"
                        value={settings.appearance.faviconUrl}
                        onChange={(e) => updateSetting('appearance', 'faviconUrl', e.target.value)}
                        className="admin-input"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    CSS personnalisé
                  </label>
                  <textarea
                    value={settings.appearance.customCss}
                    onChange={(e) => updateSetting('appearance', 'customCss', e.target.value)}
                    rows={6}
                    className="admin-input font-mono text-sm"
                    placeholder="/* Votre CSS personnalisé ici */"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Attention : Le CSS personnalisé peut affecter l'apparence de l'interface d'administration.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;