import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  Edit, 
  Trash2, 
  Users, 
  MapPin, 
  Clock,
  Filter,
  Download,
  Eye
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import toast from 'react-hot-toast';

const EventManagement: React.FC = () => {
  const { events, clubs, addEvent, updateEvent, deleteEvent } = useAdmin();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [filterClub, setFilterClub] = useState('');

  const filteredEvents = events.filter(event => {
    const matchesType = !filterType || event.type === filterType;
    const matchesClub = !filterClub || event.clubId === filterClub;
    return matchesType && matchesClub;
  });

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club ? club.name : 'Club inconnu';
  };

  const getEventTypeLabel = (type: string) => {
    const labels = {
      competition: 'Compétition',
      stage: 'Stage',
      demonstration: 'Démonstration',
      meeting: 'Réunion'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      competition: 'bg-red-100 text-red-800',
      stage: 'bg-blue-100 text-blue-800',
      demonstration: 'bg-green-100 text-green-800',
      meeting: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      try {
        await deleteEvent(id);
        toast.success('Événement supprimé avec succès');
      } catch (error) {
        toast.error('Erreur lors de la suppression');
      }
    }
  };

  const exportEvents = () => {
    const csvContent = [
      ['Titre', 'Date', 'Heure', 'Lieu', 'Type', 'Club', 'Participants', 'Places max'].join(','),
      ...filteredEvents.map(event => [
        event.title,
        event.date,
        event.time,
        event.location,
        getEventTypeLabel(event.type),
        getClubName(event.clubId),
        event.currentParticipants,
        event.maxParticipants
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'evenements.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
          <p className="text-gray-600">{filteredEvents.length} événement(s) trouvé(s)</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={exportEvents}
            className="admin-button-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Exporter</span>
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un événement</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les types</option>
            <option value="competition">Compétitions</option>
            <option value="stage">Stages</option>
            <option value="demonstration">Démonstrations</option>
            <option value="meeting">Réunions</option>
          </select>
          
          <select
            value={filterClub}
            onChange={(e) => setFilterClub(e.target.value)}
            className="admin-input"
          >
            <option value="">Tous les clubs</option>
            {clubs.map(club => (
              <option key={club.id} value={club.id}>{club.name}</option>
            ))}
          </select>
          
          <button className="admin-button-secondary flex items-center justify-center space-x-2">
            <Filter className="w-4 h-4" />
            <span>Filtres avancés</span>
          </button>
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="admin-card hover:shadow-lg transition-shadow">
            {/* Event Image */}
            {event.image && (
              <div className="mb-4">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Event Header */}
            <div className="flex items-center justify-between mb-3">
              <span className={`admin-badge ${getEventTypeColor(event.type)}`}>
                {getEventTypeLabel(event.type)}
              </span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowDetailModal(true);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                  title="Voir détails"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setSelectedEvent(event);
                    setShowCreateModal(true);
                  }}
                  className="text-green-600 hover:text-green-800"
                  title="Modifier"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="text-red-600 hover:text-red-800"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Event Info */}
            <div className="space-y-2 mb-4">
              <h3 className="font-semibold text-gray-900">{event.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{event.description}</p>
              
              <div className="space-y-1 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="truncate">{event.location}</span>
                </div>
              </div>
            </div>

            {/* Event Stats */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="w-4 h-4" />
                <span>{event.currentParticipants}/{event.maxParticipants}</span>
              </div>
              <div className="text-gray-600">
                {getClubName(event.clubId)}
              </div>
            </div>

            {/* Registration Status */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className={`admin-badge ${
                  event.registrationOpen ? 'admin-badge-success' : 'admin-badge-error'
                }`}>
                  {event.registrationOpen ? 'Inscriptions ouvertes' : 'Inscriptions fermées'}
                </span>
                {event.price > 0 && (
                  <span className="text-sm font-medium text-gray-900">
                    {event.price}€
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="admin-card text-center py-12">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun événement trouvé
          </h3>
          <p className="text-gray-600 mb-4">
            Aucun événement ne correspond aux critères sélectionnés.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="admin-button-primary"
          >
            Créer le premier événement
          </button>
        </div>
      )}

      {/* Create/Edit Event Modal */}
      {showCreateModal && (
        <EventModal
          event={selectedEvent}
          clubs={clubs}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedEvent(null);
          }}
          onSave={async (eventData) => {
            try {
              if (selectedEvent) {
                await updateEvent(selectedEvent.id, eventData);
                toast.success('Événement modifié avec succès');
              } else {
                await addEvent(eventData);
                toast.success('Événement créé avec succès');
              }
              setShowCreateModal(false);
              setSelectedEvent(null);
            } catch (error) {
              toast.error('Erreur lors de la sauvegarde');
            }
          }}
        />
      )}

      {/* Event Detail Modal */}
      {showDetailModal && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          club={clubs.find(c => c.id === selectedEvent.clubId)}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedEvent(null);
          }}
        />
      )}
    </div>
  );
};

// Event Modal Component
const EventModal: React.FC<{
  event: any;
  clubs: any[];
  onClose: () => void;
  onSave: (data: any) => void;
}> = ({ event, clubs, onClose, onSave }) => {
  const [formData, setFormData] = useState(event || {
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    clubId: '',
    type: 'stage',
    maxParticipants: 20,
    registrationOpen: true,
    price: 0,
    image: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      currentParticipants: event ? event.currentParticipants : 0,
      participants: event ? event.participants : []
    });
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">
            {event ? 'Modifier l\'événement' : 'Créer un événement'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Titre *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="admin-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              rows={3}
              className="admin-input"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Heure *
              </label>
              <input
                type="time"
                required
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="admin-input"
              >
                <option value="stage">Stage</option>
                <option value="competition">Compétition</option>
                <option value="demonstration">Démonstration</option>
                <option value="meeting">Réunion</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lieu *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Club *
              </label>
              <select
                required
                value={formData.clubId}
                onChange={(e) => setFormData({...formData, clubId: e.target.value})}
                className="admin-input"
              >
                <option value="">Sélectionner un club</option>
                {clubs.map(club => (
                  <option key={club.id} value={club.id}>{club.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Participants max
              </label>
              <input
                type="number"
                min="1"
                value={formData.maxParticipants}
                onChange={(e) => setFormData({...formData, maxParticipants: parseInt(e.target.value)})}
                className="admin-input"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prix (€)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                className="admin-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image (URL)
            </label>
            <input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({...formData, image: e.target.value})}
              className="admin-input"
            />
          </div>

          <div>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={formData.registrationOpen}
                onChange={(e) => setFormData({...formData, registrationOpen: e.target.checked})}
                className="rounded border-gray-300 text-red-600 focus:ring-red-500"
              />
              <span className="text-sm font-medium text-gray-700">
                Inscriptions ouvertes
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
              {event ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Event Detail Modal Component
const EventDetailModal: React.FC<{
  event: any;
  club: any;
  onClose: () => void;
}> = ({ event, club, onClose }) => {
  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Détails de l'événement</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            ×
          </button>
        </div>

        <div className="space-y-6">
          {event.image && (
            <div>
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          <div>
            <h4 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h4>
            <p className="text-gray-600">{event.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-medium text-gray-900 mb-3">Informations pratiques</h5>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{new Date(event.date).toLocaleDateString('fr-FR')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{event.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                </div>
              </div>
            </div>

            <div>
              <h5 className="font-medium text-gray-900 mb-3">Détails</h5>
              <div className="space-y-2 text-sm">
                <p><span className="font-medium">Club:</span> {club?.name}</p>
                <p><span className="font-medium">Type:</span> {event.type}</p>
                <p><span className="font-medium">Prix:</span> {event.price > 0 ? `${event.price}€` : 'Gratuit'}</p>
                <p><span className="font-medium">Inscriptions:</span> {event.registrationOpen ? 'Ouvertes' : 'Fermées'}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6">
          <button onClick={onClose} className="admin-button-primary">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventManagement;