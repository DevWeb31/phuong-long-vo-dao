import React, { useState } from 'react';
import { 
  Building2, 
  Edit, 
  Save, 
  Plus, 
  Trash2, 
  Users, 
  MapPin, 
  Phone, 
  Mail,
  Clock,
  Award
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const ClubManagement: React.FC = () => {
  const { clubs, updateClub } = useAdmin();
  const [editingClub, setEditingClub] = useState<string | null>(null);
  const [editData, setEditData] = useState<any>({});

  const handleEdit = (club: any) => {
    setEditingClub(club.id);
    setEditData({ ...club });
  };

  const handleSave = async (clubId: string) => {
    try {
      await updateClub(clubId, editData);
      setEditingClub(null);
      setEditData({});
      toast.success('Club mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const handleCancel = () => {
    setEditingClub(null);
    setEditData({});
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des clubs</h1>
          <p className="text-gray-600">{clubs.length} club(s) enregistré(s)</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {clubs.map((club) => (
          <div key={club.id} className="admin-card">
            {editingClub === club.id ? (
              <EditClubForm
                club={editData}
                onChange={setEditData}
                onSave={() => handleSave(club.id)}
                onCancel={handleCancel}
              />
            ) : (
              <ClubDisplay
                club={club}
                onEdit={() => handleEdit(club)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const ClubDisplay: React.FC<{
  club: any;
  onEdit: () => void;
}> = ({ club, onEdit }) => {
  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
            <p className="text-sm text-gray-600">{club.city} ({club.department})</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`admin-badge ${club.isActive ? 'admin-badge-success' : 'admin-badge-error'}`}>
            {club.isActive ? 'Actif' : 'Inactif'}
          </span>
          <button
            onClick={onEdit}
            className="text-blue-600 hover:text-blue-800"
            title="Modifier"
          >
            <Edit className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Users className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <p className="text-lg font-semibold text-gray-900">{club.memberCount}</p>
          <p className="text-xs text-gray-600">Adhérents</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Clock className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <p className="text-lg font-semibold text-gray-900">{club.schedules.length}</p>
          <p className="text-xs text-gray-600">Créneaux</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <Award className="w-5 h-5 text-gray-600 mx-auto mb-1" />
          <p className="text-lg font-semibold text-gray-900">{club.specialties.length}</p>
          <p className="text-xs text-gray-600">Spécialités</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{club.address}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{club.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{club.email}</span>
        </div>
      </div>

      {/* Schedules */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Horaires</h4>
        <div className="space-y-1">
          {club.schedules.map((schedule: string, index: number) => (
            <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-2 mb-1">
              {schedule}
            </span>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div className="mb-4">
        <h4 className="font-medium text-gray-900 mb-2">Spécialités</h4>
        <div className="space-y-1">
          {club.specialties.map((specialty: string, index: number) => (
            <span key={index} className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2 mb-1">
              {specialty}
            </span>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <h4 className="font-medium text-gray-900 mb-2">Description</h4>
        <p className="text-sm text-gray-600">{club.description}</p>
      </div>
    </div>
  );
};

const EditClubForm: React.FC<{
  club: any;
  onChange: (data: any) => void;
  onSave: () => void;
  onCancel: () => void;
}> = ({ club, onChange, onSave, onCancel }) => {
  const handleScheduleChange = (index: number, value: string) => {
    const newSchedules = [...club.schedules];
    newSchedules[index] = value;
    onChange({ ...club, schedules: newSchedules });
  };

  const addSchedule = () => {
    onChange({ ...club, schedules: [...club.schedules, ''] });
  };

  const removeSchedule = (index: number) => {
    const newSchedules = club.schedules.filter((_: any, i: number) => i !== index);
    onChange({ ...club, schedules: newSchedules });
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    const newSpecialties = [...club.specialties];
    newSpecialties[index] = value;
    onChange({ ...club, specialties: newSpecialties });
  };

  const addSpecialty = () => {
    onChange({ ...club, specialties: [...club.specialties, ''] });
  };

  const removeSpecialty = (index: number) => {
    const newSpecialties = club.specialties.filter((_: any, i: number) => i !== index);
    onChange({ ...club, specialties: newSpecialties });
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Modifier le club</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onCancel}
            className="admin-button-secondary text-sm px-3 py-1"
          >
            Annuler
          </button>
          <button
            onClick={onSave}
            className="admin-button-primary text-sm px-3 py-1 flex items-center space-x-1"
          >
            <Save className="w-4 h-4" />
            <span>Sauvegarder</span>
          </button>
        </div>
      </div>

      {/* Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom du club
          </label>
          <input
            type="text"
            value={club.name}
            onChange={(e) => onChange({ ...club, name: e.target.value })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ville
          </label>
          <input
            type="text"
            value={club.city}
            onChange={(e) => onChange({ ...club, city: e.target.value })}
            className="admin-input"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
        <input
          type="text"
          value={club.address}
          onChange={(e) => onChange({ ...club, address: e.target.value })}
          className="admin-input"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Téléphone
          </label>
          <input
            type="tel"
            value={club.phone}
            onChange={(e) => onChange({ ...club, phone: e.target.value })}
            className="admin-input"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            value={club.email}
            onChange={(e) => onChange({ ...club, email: e.target.value })}
            className="admin-input"
          />
        </div>
      </div>

      {/* Schedules */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Horaires
          </label>
          <button
            onClick={addSchedule}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
        <div className="space-y-2">
          {club.schedules.map((schedule: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={schedule}
                onChange={(e) => handleScheduleChange(index, e.target.value)}
                className="admin-input flex-1"
                placeholder="Ex: Mardi 19h-21h"
              />
              <button
                onClick={() => removeSchedule(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Specialties */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">
            Spécialités
          </label>
          <button
            onClick={addSpecialty}
            className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
          >
            <Plus className="w-4 h-4" />
            <span>Ajouter</span>
          </button>
        </div>
        <div className="space-y-2">
          {club.specialties.map((specialty: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <input
                type="text"
                value={specialty}
                onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                className="admin-input flex-1"
                placeholder="Ex: Vo Dao traditionnel"
              />
              <button
                onClick={() => removeSpecialty(index)}
                className="text-red-600 hover:text-red-800"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={club.description}
          onChange={(e) => onChange({ ...club, description: e.target.value })}
          rows={3}
          className="admin-input"
        />
      </div>

      {/* Status */}
      <div>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={club.isActive}
            onChange={(e) => onChange({ ...club, isActive: e.target.checked })}
            className="rounded border-gray-300 text-red-600 focus:ring-red-500"
          />
          <span className="text-sm font-medium text-gray-700">Club actif</span>
        </label>
      </div>
    </div>
  );
};

export default ClubManagement;