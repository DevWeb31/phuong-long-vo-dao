import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'club_admin';
  clubAccess: string[]; // Club IDs the user can access
  permissions: string[];
  lastLogin: string;
  isActive: boolean;
}

export interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  clubId: string;
  status: 'active' | 'inactive' | 'suspended';
  membershipType: 'annual' | 'monthly' | 'trial';
  joinDate: string;
  lastPayment: string;
  birthDate: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  medicalInfo: string;
  belt: string;
  notes: string;
}

export interface AdminClub {
  id: string;
  name: string;
  city: string;
  department: string;
  address: string;
  phone: string;
  email: string;
  schedules: string[];
  specialties: string[];
  instructors: Instructor[];
  description: string;
  photos: string[];
  facebookPageId: string;
  isActive: boolean;
  memberCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  grade: string;
  bio: string;
  photo: string;
  email: string;
  phone: string;
  specialties: string[];
  isActive: boolean;
}

export interface AdminEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  clubId: string;
  type: 'competition' | 'stage' | 'demonstration' | 'meeting';
  maxParticipants: number;
  currentParticipants: number;
  registrationOpen: boolean;
  price: number;
  image: string;
  participants: string[]; // Member IDs
  createdBy: string;
  createdAt: string;
}

export interface FacebookPost {
  id: string;
  clubId: string;
  content: string;
  date: string;
  image?: string;
  likes: number;
  comments: number;
  shares: number;
  isImported: boolean;
  isPublished: boolean;
  facebookPostId?: string;
}

export interface Communication {
  id: string;
  title: string;
  content: string;
  type: 'newsletter' | 'notification' | 'announcement';
  recipients: string[]; // Member IDs or 'all'
  clubIds: string[];
  sentAt: string;
  sentBy: string;
  status: 'draft' | 'sent' | 'scheduled';
  scheduledFor?: string;
  openRate: number;
  clickRate: number;
}

export interface MediaFile {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'document' | 'video';
  size: number;
  clubId?: string;
  folder: string;
  uploadedBy: string;
  uploadedAt: string;
  tags: string[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  clubId?: string; // null for general FAQ
  order: number;
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  details: string;
  timestamp: string;
  ipAddress: string;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  members: Member[];
  clubs: AdminClub[];
  events: AdminEvent[];
  facebookPosts: FacebookPost[];
  communications: Communication[];
  mediaFiles: MediaFile[];
  faqs: FAQ[];
  activityLogs: ActivityLog[];
  
  // Auth methods
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  
  // Member methods
  getMembers: (clubId?: string) => Member[];
  addMember: (member: Omit<Member, 'id'>) => Promise<string>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  // Club methods
  updateClub: (id: string, club: Partial<AdminClub>) => Promise<void>;
  
  // Event methods
  addEvent: (event: Omit<AdminEvent, 'id' | 'createdAt' | 'createdBy'>) => Promise<string>;
  updateEvent: (id: string, event: Partial<AdminEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  
  // Facebook methods
  syncFacebookPosts: (clubId: string) => Promise<void>;
  publishPost: (id: string) => Promise<void>;
  
  // Communication methods
  sendCommunication: (communication: Omit<Communication, 'id' | 'sentAt' | 'sentBy'>) => Promise<string>;
  
  // Media methods
  uploadMedia: (file: File, folder: string, clubId?: string) => Promise<string>;
  deleteMedia: (id: string) => Promise<void>;
  
  // FAQ methods
  addFAQ: (faq: Omit<FAQ, 'id' | 'createdAt' | 'createdBy'>) => Promise<string>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  
  // Activity log
  logActivity: (action: string, resource: string, resourceId: string, details: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [clubs, setClubs] = useState<AdminClub[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  // Initialize mock data
  useEffect(() => {
    const initializeData = async () => {
      // Mock clubs data
      const mockClubs: AdminClub[] = [
        {
          id: 'montaigut',
          name: 'Club Montaigut sur Save',
          city: 'Montaigut sur Save',
          department: '31',
          address: 'Salle des sports, Place de la Mairie, 31530 Montaigut sur Save',
          phone: '05 61 85 42 30',
          email: 'montaigut@phuonglong.fr',
          schedules: ['Mardi 19h-21h', 'Jeudi 19h-21h', 'Samedi 14h-16h'],
          specialties: ['Vo Dao traditionnel', 'Combat sportif', 'Armes traditionnelles'],
          instructors: [],
          description: 'Club historique fondé en 1985',
          photos: [],
          facebookPageId: 'montaigut-vo-dao',
          isActive: true,
          memberCount: 45
        },
        {
          id: 'tregeux',
          name: 'Club Trégeux',
          city: 'Trégeux',
          department: '22',
          address: 'Complexe sportif de Trégeux, Rue du Stade, 22950 Trégeux',
          phone: '02 96 71 58 42',
          email: 'tregeux@phuonglong.fr',
          schedules: ['Lundi 18h30-20h', 'Mercredi 18h30-20h', 'Vendredi 18h30-20h'],
          specialties: ['Vo Dao jeunes', 'Self-défense', 'Méditation martiale'],
          instructors: [],
          description: 'Club dynamique axé sur la transmission aux nouvelles générations',
          photos: [],
          facebookPageId: 'tregeux-vo-dao',
          isActive: true,
          memberCount: 32
        }
      ];

      // Mock members data
      const mockMembers: Member[] = [
        {
          id: '1',
          firstName: 'Jean',
          lastName: 'Dupont',
          email: 'jean.dupont@email.com',
          phone: '06 12 34 56 78',
          clubId: 'montaigut',
          status: 'active',
          membershipType: 'annual',
          joinDate: '2023-09-01',
          lastPayment: '2024-01-15',
          birthDate: '1985-03-15',
          address: '123 Rue de la Paix, 31530 Montaigut sur Save',
          emergencyContact: {
            name: 'Marie Dupont',
            phone: '06 98 76 54 32',
            relation: 'Épouse'
          },
          medicalInfo: 'Aucune restriction',
          belt: 'Ceinture bleue',
          notes: 'Pratiquant assidu, bon esprit'
        }
      ];

      setClubs(mockClubs);
      setMembers(mockMembers);
      setLoading(false);
    };

    initializeData();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    if (email === 'admin@phuonglong.fr' && password === 'admin123') {
      const mockUser: AdminUser = {
        id: '1',
        email: 'admin@phuonglong.fr',
        name: 'Administrateur Principal',
        role: 'superadmin',
        clubAccess: ['montaigut', 'tregeux', 'lanester', 'cublize', 'wimille'],
        permissions: ['all'],
        lastLogin: new Date().toISOString(),
        isActive: true
      };
      setUser(mockUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const getMembers = (clubId?: string) => {
    if (clubId) {
      return members.filter(member => member.clubId === clubId);
    }
    return members;
  };

  const addMember = async (member: Omit<Member, 'id'>): Promise<string> => {
    const newMember: Member = {
      ...member,
      id: Date.now().toString()
    };
    setMembers(prev => [...prev, newMember]);
    logActivity('CREATE', 'member', newMember.id, `Ajout du membre ${member.firstName} ${member.lastName}`);
    return newMember.id;
  };

  const updateMember = async (id: string, memberUpdate: Partial<Member>): Promise<void> => {
    setMembers(prev => prev.map(member => 
      member.id === id ? { ...member, ...memberUpdate } : member
    ));
    logActivity('UPDATE', 'member', id, 'Modification des informations du membre');
  };

  const deleteMember = async (id: string): Promise<void> => {
    const member = members.find(m => m.id === id);
    setMembers(prev => prev.filter(member => member.id !== id));
    logActivity('DELETE', 'member', id, `Suppression du membre ${member?.firstName} ${member?.lastName}`);
  };

  const updateClub = async (id: string, clubUpdate: Partial<AdminClub>): Promise<void> => {
    setClubs(prev => prev.map(club => 
      club.id === id ? { ...club, ...clubUpdate } : club
    ));
    logActivity('UPDATE', 'club', id, 'Modification des informations du club');
  };

  const addEvent = async (event: Omit<AdminEvent, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    const newEvent: AdminEvent = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: user?.id || ''
    };
    setEvents(prev => [...prev, newEvent]);
    logActivity('CREATE', 'event', newEvent.id, `Création de l'événement ${event.title}`);
    return newEvent.id;
  };

  const updateEvent = async (id: string, eventUpdate: Partial<AdminEvent>): Promise<void> => {
    setEvents(prev => prev.map(event => 
      event.id === id ? { ...event, ...eventUpdate } : event
    ));
    logActivity('UPDATE', 'event', id, 'Modification de l\'événement');
  };

  const deleteEvent = async (id: string): Promise<void> => {
    const event = events.find(e => e.id === id);
    setEvents(prev => prev.filter(event => event.id !== id));
    logActivity('DELETE', 'event', id, `Suppression de l'événement ${event?.title}`);
  };

  const syncFacebookPosts = async (clubId: string): Promise<void> => {
    // Mock Facebook sync
    logActivity('SYNC', 'facebook', clubId, 'Synchronisation des posts Facebook');
  };

  const publishPost = async (id: string): Promise<void> => {
    setFacebookPosts(prev => prev.map(post => 
      post.id === id ? { ...post, isPublished: true } : post
    ));
    logActivity('PUBLISH', 'facebook_post', id, 'Publication du post');
  };

  const sendCommunication = async (communication: Omit<Communication, 'id' | 'sentAt' | 'sentBy'>): Promise<string> => {
    const newCommunication: Communication = {
      ...communication,
      id: Date.now().toString(),
      sentAt: new Date().toISOString(),
      sentBy: user?.id || '',
      openRate: 0,
      clickRate: 0
    };
    setCommunications(prev => [...prev, newCommunication]);
    logActivity('SEND', 'communication', newCommunication.id, `Envoi de la communication ${communication.title}`);
    return newCommunication.id;
  };

  const uploadMedia = async (file: File, folder: string, clubId?: string): Promise<string> => {
    const newMedia: MediaFile = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('image/') ? 'image' : 'document',
      size: file.size,
      clubId,
      folder,
      uploadedBy: user?.id || '',
      uploadedAt: new Date().toISOString(),
      tags: []
    };
    setMediaFiles(prev => [...prev, newMedia]);
    logActivity('UPLOAD', 'media', newMedia.id, `Upload du fichier ${file.name}`);
    return newMedia.id;
  };

  const deleteMedia = async (id: string): Promise<void> => {
    const media = mediaFiles.find(m => m.id === id);
    setMediaFiles(prev => prev.filter(media => media.id !== id));
    logActivity('DELETE', 'media', id, `Suppression du fichier ${media?.name}`);
  };

  const addFAQ = async (faq: Omit<FAQ, 'id' | 'createdAt' | 'createdBy'>): Promise<string> => {
    const newFAQ: FAQ = {
      ...faq,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      createdBy: user?.id || '',
      updatedAt: new Date().toISOString()
    };
    setFaqs(prev => [...prev, newFAQ]);
    logActivity('CREATE', 'faq', newFAQ.id, `Ajout de la FAQ: ${faq.question}`);
    return newFAQ.id;
  };

  const updateFAQ = async (id: string, faqUpdate: Partial<FAQ>): Promise<void> => {
    setFaqs(prev => prev.map(faq => 
      faq.id === id ? { ...faq, ...faqUpdate, updatedAt: new Date().toISOString() } : faq
    ));
    logActivity('UPDATE', 'faq', id, 'Modification de la FAQ');
  };

  const deleteFAQ = async (id: string): Promise<void> => {
    const faq = faqs.find(f => f.id === id);
    setFaqs(prev => prev.filter(faq => faq.id !== id));
    logActivity('DELETE', 'faq', id, `Suppression de la FAQ: ${faq?.question}`);
  };

  const logActivity = (action: string, resource: string, resourceId: string, details: string) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      userId: user?.id || '',
      userName: user?.name || '',
      action,
      resource,
      resourceId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1'
    };
    setActivityLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  return (
    <AdminContext.Provider value={{
      user,
      loading,
      members,
      clubs,
      events,
      facebookPosts,
      communications,
      mediaFiles,
      faqs,
      activityLogs,
      login,
      logout,
      getMembers,
      addMember,
      updateMember,
      deleteMember,
      updateClub,
      addEvent,
      updateEvent,
      deleteEvent,
      syncFacebookPosts,
      publishPost,
      sendCommunication,
      uploadMedia,
      deleteMedia,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      logActivity
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};