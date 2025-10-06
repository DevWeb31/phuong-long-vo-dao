import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, supabaseAdmin, supabaseConfig } from '../../config/supabase';
import type { User, Session } from '@supabase/supabase-js';

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
  club_id?: string; // null for general FAQ
  order_index: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  resource: string;
  resourceId: string;
  description: string;
  details: {
    ip: string;
    userAgent: string;
  };
  timestamp: string;
  ipAddress: string;
}

interface AdminContextType {
  user: AdminUser | null;
  loading: boolean;
  sessionRestored: boolean;
  members: Member[];
  users: AdminUser[];
  clubs: AdminClub[];
  events: AdminEvent[];
  facebookPosts: FacebookPost[];
  communications: Communication[];
  mediaFiles: MediaFile[];
  faqs: FAQ[];
  activityLogs: ActivityLog[];
  
  // Auth methods
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  showPasswordChangeModal: boolean;
  isFirstLoginModal: boolean;
  updatePassword: (newPassword: string) => Promise<void>;
  dismissPasswordChangeModal: () => void;
  
  // Member methods
  getMembers: (clubId?: string) => Member[];
  addMember: (member: Omit<Member, 'id'>) => Promise<string>;
  updateMember: (id: string, member: Partial<Member>) => Promise<void>;
  deleteMember: (id: string) => Promise<void>;
  
  // Club methods
  loadClubs: () => Promise<void>;
  loadUsers: () => Promise<void>;
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
  loadFAQs: () => Promise<void>;
  addFAQ: (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<string>;
  updateFAQ: (id: string, faq: Partial<FAQ>) => Promise<void>;
  deleteFAQ: (id: string) => Promise<void>;
  getAccessibleFAQs: () => FAQ[];
  canEditFAQ: (faqId: string) => boolean;
  
  // Activity log
  logActivity: (action: string, resource: string, resourceId: string, details: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [sessionRestored, setSessionRestored] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [clubs, setClubs] = useState<AdminClub[]>([]);
  const [events, setEvents] = useState<AdminEvent[]>([]);
  const [facebookPosts, setFacebookPosts] = useState<FacebookPost[]>([]);
  const [communications, setCommunications] = useState<Communication[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [isFirstLoginModal, setIsFirstLoginModal] = useState(false);

  // Initialize mock data
  useEffect(() => {
    const initializeData = async () => {
      // Mock clubs data - utiliser des IDs qui existent ou null pour les tests
      const mockClubs: AdminClub[] = [
        {
          id: 'general-club-id', // ID spécial pour les FAQ générales
          name: 'Global',
          city: 'Général',
          department: '00',
          address: 'FAQ générales pour tous les clubs',
          phone: '',
          email: '',
          schedules: [],
          specialties: [],
          instructors: [],
          description: 'FAQ générales applicables à tous les clubs',
          photos: [],
          facebookPageId: '',
          isActive: true,
          memberCount: 0
        },
        {
          id: 'montaigut-club-id',
          name: 'Club Montaigut sur Save',
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
          clubId: '550e8400-e29b-41d4-a716-446655440001',
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

      setMembers(mockMembers);
      
      // Load clubs, users and FAQ from database
      await loadClubs();
      await loadUsers();
      await loadFAQs();
      
      setLoading(false);
    };

    // Restaurer la session au chargement
    restoreSession();
    initializeData();

    // Écouter les changements d'état d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
      } else if (event === 'SIGNED_IN' && session) {
        // La session sera restaurée automatiquement par restoreSession
      }
    });

    // Nettoyer l'abonnement au démontage
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Fonction pour restaurer la session
  const restoreSession = async () => {
    try {
      // Vérifier s'il y a une session Supabase active
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erreur lors de la récupération de la session:', error);
        return;
      }

      if (session?.user) {
        // Récupérer les données utilisateur depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', session.user.email)
          .single();

        if (userError || !userData) {
          console.error('Utilisateur non trouvé dans la table users');
          return;
        }

        if (userData.is_active === false) {
          console.warn('Compte administrateur inactif, déconnexion de la session');
          await supabase.auth.signOut();
          setUser(null);
          localStorage.removeItem('adminUser');
          localStorage.removeItem('adminToken');
          setSessionRestored(true);
          return;
        }

        // Vérifier si c'est la première connexion (pas de last_login)
        const isFirstLogin = !userData.last_login;
        
        // Vérifier si l'utilisateur doit changer son mot de passe (mot de passe temporaire)
        const needsPasswordChange = !userData.last_login;

        // Récupérer les accès clubs et permissions depuis la base de données
        const [clubAccessResult, permissionsResult] = await Promise.all([
          supabase
            .from('user_club_access')
            .select('club_id')
            .eq('user_id', userData.id),
          supabase
            .from('user_permissions')
            .select('permission_id')
            .eq('user_id', userData.id)
        ]);

        const clubAccess = clubAccessResult.data?.map(row => row.club_id) || [];
        const permissions = permissionsResult.data?.map(row => row.permission_id) || [];

        // Créer l'objet utilisateur admin
        const adminUser: AdminUser = {
          id: session.user.id,
          email: session.user.email || '',
          name: userData.name,
          role: userData.role,
          clubAccess,
          permissions,
          lastLogin: userData.last_login || new Date().toISOString(),
          isActive: userData.is_active === true
        };

        setUser(adminUser);
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminToken', session.access_token);
        setSessionRestored(true);

        // Si l'utilisateur doit changer son mot de passe (première connexion ou mot de passe temporaire),
        // afficher le modal de changement de mot de passe
        if (needsPasswordChange) {
          setShowPasswordChangeModal(true);
          setIsFirstLoginModal(true);
        }
        
      } else {
        // Vérifier le localStorage en fallback
        const savedUser = localStorage.getItem('adminUser');
        const savedToken = localStorage.getItem('adminToken');
        
        if (savedUser && savedToken) {
          try {
            const parsedUser = JSON.parse(savedUser);
            setUser(parsedUser);
            setSessionRestored(true);
          } catch (error) {
            console.error('Erreur lors du parsing du localStorage:', error);
            localStorage.removeItem('adminUser');
            localStorage.removeItem('adminToken');
          }
        }
      }
      
      // Marquer la session comme restaurée même si pas d'utilisateur
      setSessionRestored(true);
    } catch (error) {
      console.error('Erreur lors de la restauration de session:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Authentification avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Erreur de connexion:', error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Vérifier si l'utilisateur a les droits admin
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();

        if (userError || !userData) {
          return { success: false, error: 'Utilisateur non autorisé' };
        }

        if (userData.is_active === false) {
          await supabase.auth.signOut();
          return { success: false, error: 'Compte inactif. Contactez un administrateur.' };
        }

        // Vérifier si c'est la première connexion (pas de last_login)
        const isFirstLogin = !userData.last_login;
        
        // Vérifier si l'utilisateur doit changer son mot de passe (mot de passe temporaire)
        // On considère qu'un utilisateur restauré récemment avec un mot de passe temporaire
        // doit le changer s'il n'a pas encore de last_login après restauration
        const needsPasswordChange = !userData.last_login;
        

        // Récupérer les accès clubs et permissions depuis la base de données
        const [clubAccessResult, permissionsResult] = await Promise.all([
          supabase
            .from('user_club_access')
            .select('club_id')
            .eq('user_id', userData.id),
          supabase
            .from('user_permissions')
            .select('permission_id')
            .eq('user_id', userData.id)
        ]);

        const clubAccess = clubAccessResult.data?.map(row => row.club_id) || [];
        const permissions = permissionsResult.data?.map(row => row.permission_id) || [];

        // Créer l'objet utilisateur admin
        const adminUser: AdminUser = {
          id: data.user.id,
          email: data.user.email || email,
          name: userData.name,
          role: userData.role,
          clubAccess,
          permissions,
          lastLogin: userData.last_login || new Date().toISOString(),
          isActive: userData.is_active === true
        };

        setUser(adminUser);
        localStorage.setItem('adminUser', JSON.stringify(adminUser));
        localStorage.setItem('adminToken', data.session?.access_token || '');

        // Si l'utilisateur doit changer son mot de passe (première connexion ou mot de passe temporaire),
        // afficher le modal de changement de mot de passe
        // et ne pas mettre à jour last_login tant que le mot de passe n'est pas changé
        if (needsPasswordChange) {
          setShowPasswordChangeModal(true);
          setIsFirstLoginModal(true);
        } else {
          // Mettre à jour la dernière connexion dans la DB seulement si l'utilisateur n'a pas besoin de changer son mot de passe
          await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('email', email);
        }

        // Ajouter à l'historique d'activité
        const loginActivity: ActivityLog = {
          id: Date.now().toString(),
          userId: adminUser.id,
          userName: adminUser.name,
          action: 'login',
          resource: 'auth',
          resourceId: adminUser.id,
          description: `Connexion de ${adminUser.email}`,
          details: {
            ip: '127.0.0.1',
            userAgent: navigator.userAgent
          },
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        };

        setActivityLogs(prev => [loginActivity, ...prev.slice(0, 49)]);

        return { success: true };
      }

      return { success: false, error: 'Erreur de connexion' };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return { success: false, error: 'Erreur de connexion' };
    }
  };

  const logout = async () => {
    try {
      // Déconnexion Supabase
      await supabase.auth.signOut();
      
      // Nettoyer le state local
      setUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
      
      // Ajouter à l'historique d'activité
      if (user) {
        const logoutActivity: ActivityLog = {
          id: Date.now().toString(),
          userId: user.id,
          userName: user.name,
          action: 'logout',
          resource: 'auth',
          resourceId: user.id,
          description: `Déconnexion de ${user.email}`,
          details: {
            ip: '127.0.0.1',
            userAgent: navigator.userAgent
          },
          timestamp: new Date().toISOString(),
          ipAddress: '127.0.0.1'
        };
        
        setActivityLogs(prev => [logoutActivity, ...prev.slice(0, 49)]);
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      // Nettoyer quand même le state local
      setUser(null);
      localStorage.removeItem('adminUser');
      localStorage.removeItem('adminToken');
    }
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

  const loadClubs = async (): Promise<void> => {
    try {
      // Vérifier si Supabase est configuré
      const isSupabaseConfigured = supabaseConfig.url !== 'your_supabase_url_dev_here' && 
                                   supabaseConfig.url !== 'your_supabase_url_prod_here';
      
      if (!isSupabaseConfigured) {
        return; // Garder les clubs mockés
      }

      const { data: clubsData, error } = await supabase
        .from('clubs')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des clubs:', error);
        return;
      }

      // Convertir les données Supabase au format AdminClub
      const supabaseClubs: AdminClub[] = clubsData?.map(club => ({
        id: club.id,
        name: club.name,
        city: club.city || '',
        department: club.department || '',
        address: club.address || '',
        phone: club.phone || '',
        email: club.email || '',
        schedules: club.schedules || [],
        specialties: club.specialties || [],
        instructors: [], // À implémenter si nécessaire
        description: club.description || '',
        photos: club.photos || [],
        facebookPageId: club.facebook_page_id || '',
        isActive: club.is_active !== false,
        memberCount: club.member_count || 0
      })) || [];

      setClubs(supabaseClubs);
    } catch (error) {
      console.error('Erreur lors du chargement des clubs:', error);
    }
  };

  const loadUsers = async (): Promise<void> => {
    try {
      // Vérifier si Supabase est configuré
      const isSupabaseConfigured = supabaseConfig.url !== 'your_supabase_url_dev_here' && 
                                   supabaseConfig.url !== 'your_supabase_url_prod_here';
      
      if (!isSupabaseConfigured) {
        return; // Garder les utilisateurs mockés
      }

      const { data: usersData, error } = await supabase
        .from('users')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des utilisateurs:', error);
        return;
      }

      // Convertir les données Supabase au format AdminUser
      const supabaseUsers: AdminUser[] = usersData?.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        clubAccess: user.club_access || [],
        isActive: user.is_active !== false,
        lastLogin: user.last_login,
        createdAt: user.created_at
      })) || [];

      setUsers(supabaseUsers);
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
    }
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

  const loadFAQs = async (): Promise<void> => {
    try {
      // Vérifier si Supabase est configuré
      const isSupabaseConfigured = supabaseConfig.url !== 'your_supabase_url_dev_here' && 
                                   supabaseConfig.url !== 'your_supabase_url_prod_here';
      
      if (!isSupabaseConfigured) {
        // Utiliser des données mockées
        const mockFAQs: FAQ[] = [
          {
            id: 'faq-1',
            question: 'Comment s\'inscrire au club ?',
            answer: 'Vous pouvez vous inscrire en remplissant le formulaire d\'inscription disponible sur notre site.',
            category: 'general',
            club_id: null,
            order_index: 1,
            is_active: true,
            created_by: 'admin-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'faq-2',
            question: 'Quels sont les horaires du club Montaigut ?',
            answer: 'Les cours ont lieu le mardi et jeudi de 19h à 21h, et le samedi de 14h à 16h.',
            category: 'horaires',
            club_id: null, // FAQ générale pour les tests
            order_index: 2,
            is_active: true,
            created_by: 'admin-1',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        ];
        setFaqs(mockFAQs);
        return;
      }

      const { data, error } = await supabase
        .from('faq')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) {
        console.error('Erreur lors du chargement des FAQ:', error);
        return;
      }

      setFaqs(data || []);
    } catch (error) {
      console.error('Erreur lors du chargement des FAQ:', error);
    }
  };

  const addFAQ = async (faq: Omit<FAQ, 'id' | 'created_at' | 'updated_at' | 'created_by'>): Promise<string> => {
    try {
      // Vérifier les permissions
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Si c'est une FAQ de club, vérifier que l'utilisateur a accès à ce club
      if (faq.club_id && !user.clubAccess.includes(faq.club_id) && user.role !== 'superadmin') {
        throw new Error('Vous n\'avez pas les droits pour créer une FAQ pour ce club');
      }

      // Vérifier si Supabase est configuré
      const isSupabaseConfigured = supabaseConfig.url !== 'your_supabase_url_dev_here' && 
                                   supabaseConfig.url !== 'your_supabase_url_prod_here';
      
      // Traiter les IDs des clubs
      let processedClubId = faq.club_id;
      
      // Si c'est un ID spécial mock, le convertir
      if (faq.club_id === 'general-club-id') {
        processedClubId = null; // FAQ générale
      } else if (faq.club_id === 'montaigut-club-id') {
        // Pour les tests avec des clubs mock, utiliser null
        processedClubId = null;
      } else if (faq.club_id && faq.club_id !== '') {
        // Vérifier que le club existe dans la liste des clubs chargés
        const clubExists = clubs.find(c => c.id === faq.club_id);
        if (!clubExists) {
          processedClubId = null;
        }
      }

      // Calculer l'ordre automatiquement pour éviter les conflits
      const faqsForSameClub = faqs.filter(f => 
        (processedClubId === null && f.club_id === null) || 
        (processedClubId !== null && f.club_id === processedClubId)
      );
      
      const maxOrder = faqsForSameClub.length > 0 
        ? Math.max(...faqsForSameClub.map(f => f.order_index))
        : 0;
      
      const newOrder = maxOrder + 1;
      
      if (!isSupabaseConfigured) {
        // Mode mock : créer une FAQ simulée
        const newFAQ: FAQ = {
          id: `faq-mock-${Date.now()}`,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          club_id: processedClubId,
          order_index: newOrder, // Utiliser l'ordre calculé
          is_active: faq.is_active,
          created_by: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        setFaqs(prev => [...prev, newFAQ]);
        logActivity('CREATE', 'faq', newFAQ.id, `Ajout de la FAQ: ${faq.question}`);
        return newFAQ.id;
      }

      const { data, error } = await supabase
        .from('faq')
        .insert([{
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          club_id: processedClubId,
          order_index: newOrder, // Utiliser l'ordre calculé
          is_active: faq.is_active,
          created_by: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout de la FAQ:', error);
        throw error;
      }

      setFaqs(prev => [...prev, data]);
      logActivity('CREATE', 'faq', data.id, `Ajout de la FAQ: ${faq.question}`);
      return data.id;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la FAQ:', error);
      throw error;
    }
  };

  const updateFAQ = async (id: string, faqUpdate: Partial<FAQ>): Promise<void> => {
    try {
      // Vérifier les permissions
      if (!user) throw new Error('Utilisateur non connecté');
      
      // Récupérer la FAQ existante pour vérifier les permissions
      const existingFAQ = faqs.find(f => f.id === id);
      if (!existingFAQ) throw new Error('FAQ non trouvée');
      
      // Vérifier les permissions selon le type de FAQ
      if (existingFAQ.club_id) {
        // FAQ de club - vérifier que l'utilisateur a accès à ce club
        if (!user.clubAccess.includes(existingFAQ.club_id) && user.role !== 'superadmin') {
          throw new Error('Vous n\'avez pas les droits pour modifier cette FAQ de club');
        }
      } else {
        // FAQ générale - seuls les superadmin peuvent les modifier
        if (user.role !== 'superadmin') {
          throw new Error('Seuls les superadministrateurs peuvent modifier les FAQ générales');
        }
      }

      // Vérifier si Supabase est configuré
      const isSupabaseConfigured = supabaseConfig.url !== 'your_supabase_url_dev_here' && 
                                   supabaseConfig.url !== 'your_supabase_url_prod_here';
      
      // Si c'est une mise à jour d'ordre, vérifier qu'on ne crée pas de conflit
      if (faqUpdate.order_index !== undefined && faqUpdate.order_index !== existingFAQ.order_index) {
        const faqsForSameClub = faqs.filter(f => 
          (existingFAQ.club_id === null && f.club_id === null) || 
          (existingFAQ.club_id !== null && f.club_id === existingFAQ.club_id)
        );
        
        const conflictingFAQ = faqsForSameClub.find(f => f.id !== id && f.order_index === faqUpdate.order_index);
        if (conflictingFAQ) {
          
          // Réorganiser automatiquement toutes les FAQ du même club
          const sortedFAQs = faqsForSameClub
            .filter(f => f.id !== id) // Exclure la FAQ en cours de modification
            .sort((a, b) => a.order_index - b.order_index);
          
          // Insérer la FAQ à sa nouvelle position et réajuster les ordres
          const insertIndex = faqUpdate.order_index - 1;
          sortedFAQs.splice(insertIndex, 0, { ...existingFAQ, order_index: faqUpdate.order_index });
          
          // Réassigner les ordres de manière séquentielle
          const updatePromises = sortedFAQs.map((faq, index) => {
            const newOrder = index + 1;
            if (faq.order_index !== newOrder) {
              return supabase
                .from('faq')
                .update({ order_index: newOrder, updated_at: new Date().toISOString() })
                .eq('id', faq.id);
            }
            return Promise.resolve();
          });
          
          if (!isSupabaseConfigured) {
            // Mode mock : mise à jour locale
            setFaqs(prev => prev.map(faq => {
              const updatedFAQ = sortedFAQs.find(f => f.id === faq.id);
              return updatedFAQ ? { ...faq, order_index: updatedFAQ.order_index, updated_at: new Date().toISOString() } : faq;
            }));
          } else {
            await Promise.all(updatePromises);
            // Recharger les FAQ pour s'assurer de la cohérence
            await loadFAQs();
            logActivity('UPDATE', 'faq', id, 'Réorganisation automatique des FAQ');
            return;
          }
        }
      }
      
      if (!isSupabaseConfigured) {
        // Mode mock : mise à jour simulée
        setFaqs(prev => prev.map(faq => 
          faq.id === id ? { ...faq, ...faqUpdate, updated_at: new Date().toISOString() } : faq
        ));
        logActivity('UPDATE', 'faq', id, 'Modification de la FAQ');
        return;
      }

      const updateData: any = {};
      if (faqUpdate.question !== undefined) updateData.question = faqUpdate.question;
      if (faqUpdate.answer !== undefined) updateData.answer = faqUpdate.answer;
      if (faqUpdate.category !== undefined) updateData.category = faqUpdate.category;
      if (faqUpdate.order_index !== undefined) updateData.order_index = faqUpdate.order_index;
      if (faqUpdate.is_active !== undefined) updateData.is_active = faqUpdate.is_active;
      
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabase
        .from('faq')
        .update(updateData)
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la mise à jour de la FAQ:', error);
        throw error;
      }

      setFaqs(prev => prev.map(faq => 
        faq.id === id ? { ...faq, ...faqUpdate, updated_at: new Date().toISOString() } : faq
      ));
      logActivity('UPDATE', 'faq', id, 'Modification de la FAQ');
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la FAQ:', error);
      throw error;
    }
  };

  const deleteFAQ = async (id: string): Promise<void> => {
    try {
      // Vérifier les permissions
      if (!user) throw new Error('Utilisateur non connecté');
      
      const faq = faqs.find(f => f.id === id);
      if (!faq) throw new Error('FAQ non trouvée');
      
      // Vérifier les permissions selon le type de FAQ
      if (faq.club_id) {
        // FAQ de club - vérifier que l'utilisateur a accès à ce club
        if (!user.clubAccess.includes(faq.club_id) && user.role !== 'superadmin') {
          throw new Error('Vous n\'avez pas les droits pour supprimer cette FAQ de club');
        }
      } else {
        // FAQ générale - seuls les superadmin peuvent les supprimer
        if (user.role !== 'superadmin') {
          throw new Error('Seuls les superadministrateurs peuvent supprimer les FAQ générales');
        }
      }
      
      const { error } = await supabase
        .from('faq')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erreur lors de la suppression de la FAQ:', error);
        throw error;
      }

      setFaqs(prev => prev.filter(faq => faq.id !== id));
      logActivity('DELETE', 'faq', id, `Suppression de la FAQ: ${faq.question}`);
    } catch (error) {
      console.error('Erreur lors de la suppression de la FAQ:', error);
      throw error;
    }
  };

  const getAccessibleFAQs = (): FAQ[] => {
    if (!user) return [];
    
    // Les superadmin voient toutes les FAQ
    if (user.role === 'superadmin') {
      return faqs;
    }
    
    // Les autres utilisateurs voient seulement :
    // - Les FAQ générales (club_id = null)
    // - Les FAQ des clubs auxquels ils ont accès
    return faqs.filter(faq => 
      !faq.club_id || user.clubAccess.includes(faq.club_id)
    );
  };

  const canEditFAQ = (faqId: string): boolean => {
    if (!user) return false;
    
    const faq = faqs.find(f => f.id === faqId);
    if (!faq) return false;
    
    // Les superadmin peuvent tout modifier
    if (user.role === 'superadmin') {
      return true;
    }
    
    // Pour les FAQ de club, vérifier l'accès au club
    if (faq.club_id) {
      return user.clubAccess.includes(faq.club_id);
    }
    
    // Pour les FAQ générales, seuls les superadmin peuvent les modifier
    return false;
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
      sessionRestored,
      members,
      users,
      clubs,
      events,
      facebookPosts,
      communications,
      mediaFiles,
      faqs,
      activityLogs,
      login,
      logout,
      showPasswordChangeModal,
      isFirstLoginModal,
      updatePassword: async (newPassword: string) => {
        if (!user) return;
        
        try {
          // Mettre à jour le mot de passe dans Supabase Auth
          const { error: authError } = await supabaseAdmin.auth.admin.updateUserById(
            user.id,
            { password: newPassword }
          );
          
          if (authError) {
            throw authError;
          }
          
          // Mettre à jour last_login dans la table users (utiliser email car les IDs peuvent différer)
          const { error: dbError } = await supabase
            .from('users')
            .update({ last_login: new Date().toISOString() })
            .eq('email', user.email);
            
          if (dbError) {
            console.error('Erreur lors de la mise à jour de last_login:', dbError);
            throw dbError;
          }
          
          
          // Fermer le modal et réinitialiser l'état
          setShowPasswordChangeModal(false);
          setIsFirstLoginModal(false);
          
          // Mettre à jour l'objet utilisateur avec la nouvelle date de connexion
          const updatedUser = { ...user, lastLogin: new Date().toISOString() };
          setUser(updatedUser);
          localStorage.setItem('adminUser', JSON.stringify(updatedUser));
          
        } catch (error) {
          console.error('Erreur lors de la mise à jour du mot de passe:', error);
          throw error;
        }
      },
      dismissPasswordChangeModal: () => {
        setShowPasswordChangeModal(false);
        setIsFirstLoginModal(false);
      },
      getMembers,
      addMember,
      updateMember,
      deleteMember,
      loadClubs,
      loadUsers,
      updateClub,
      addEvent,
      updateEvent,
      deleteEvent,
      syncFacebookPosts,
      publishPost,
      sendCommunication,
      uploadMedia,
      deleteMedia,
      loadFAQs,
      addFAQ,
      updateFAQ,
      deleteFAQ,
      getAccessibleFAQs,
      canEditFAQ,
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