import React, { createContext, useContext, ReactNode } from 'react';

export interface Club {
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
  facebookPosts: FacebookPost[];
}

export interface Instructor {
  name: string;
  grade: string;
  bio: string;
  photo: string;
}

export interface FacebookPost {
  id: string;
  content: string;
  date: string;
  image?: string;
  likes: number;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: 'competition' | 'stage' | 'demonstration';
  description: string;
  image: string;
}

const clubs: Club[] = [
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
    instructors: [
      {
        name: 'Maître Chen Wei',
        grade: '7ème Dang',
        bio: 'Pratiquant depuis plus de 30 ans, spécialiste des formes traditionnelles.',
        photo: 'https://images.pexels.com/photos/7045765/pexels-photo-7045765.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    description: 'Notre club historique fondé en 1985, lieu de préservation des traditions du Vo Dao sino-vietnamien.',
    photos: [
      'https://images.pexels.com/photos/7045873/pexels-photo-7045873.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/7045678/pexels-photo-7045678.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    facebookPosts: [
      {
        id: '1',
        content: 'Excellent entraînement ce soir ! Travail sur les formes Thieu Lam.',
        date: '2024-01-15',
        likes: 12
      }
    ]
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
    instructors: [
      {
        name: 'Sifu Marie Dubois',
        grade: '5ème Dang',
        bio: 'Spécialiste de l\'enseignement aux jeunes, formatrice certifiée.',
        photo: 'https://images.pexels.com/photos/7045872/pexels-photo-7045872.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    description: 'Club dynamique axé sur la transmission aux nouvelles générations avec un environnement familial.',
    photos: [
      'https://images.pexels.com/photos/7045679/pexels-photo-7045679.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    facebookPosts: [
      {
        id: '2',
        content: 'Stage jeunes ce weekend ! Inscriptions ouvertes.',
        date: '2024-01-14',
        image: 'https://images.pexels.com/photos/7045680/pexels-photo-7045680.jpeg?auto=compress&cs=tinysrgb&w=400',
        likes: 8
      }
    ]
  },
  {
    id: 'lanester',
    name: 'Club Lanester',
    city: 'Lanester',
    department: '56',
    address: 'Dojo Municipal, Avenue Jean Jaurès, 56600 Lanester',
    phone: '02 97 76 32 15',
    email: 'lanester@phuonglong.fr',
    schedules: ['Mardi 19h-21h', 'Jeudi 19h-21h', 'Samedi 10h-12h'],
    specialties: ['Combat traditionnel', 'Qi Gong', 'Préparation physique'],
    instructors: [
      {
        name: 'Maître Nguyen Thanh',
        grade: '6ème Dang',
        bio: 'Expert en combat traditionnel, ancien champion national.',
        photo: 'https://images.pexels.com/photos/7045764/pexels-photo-7045764.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    description: 'Club reconnu pour son excellence en compétition et sa pratique authentique du Vo Dao.',
    photos: [
      'https://images.pexels.com/photos/7045681/pexels-photo-7045681.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    facebookPosts: [
      {
        id: '3',
        content: 'Félicitations à nos compétiteurs pour leurs excellents résultats au championnat régional !',
        date: '2024-01-13',
        likes: 15
      }
    ]
  },
  {
    id: 'cublize',
    name: 'Club Cublize',
    city: 'Cublize',
    department: '69',
    address: 'Salle polyvalente, Route de Lyon, 69550 Cublize',
    phone: '04 74 89 65 23',
    email: 'cublize@phuonglong.fr',
    schedules: ['Mercredi 19h-21h', 'Vendredi 19h-21h', 'Dimanche 9h-11h'],
    specialties: ['Vo Dao traditionnel', 'Armes anciennes', 'Philosophie martiale'],
    instructors: [
      {
        name: 'Sensei Pierre Martin',
        grade: '4ème Dang',
        bio: 'Passionné des arts martiaux asiatiques, spécialiste des armes.',
        photo: 'https://images.pexels.com/photos/7045766/pexels-photo-7045766.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    description: 'Club intimiste privilégiant la qualité de l\'enseignement et l\'approfondissement des techniques.',
    photos: [
      'https://images.pexels.com/photos/7045682/pexels-photo-7045682.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    facebookPosts: [
      {
        id: '4',
        content: 'Démonstration d\'armes traditionnelles lors de la fête de la ville. Bravo à tous !',
        date: '2024-01-12',
        likes: 10
      }
    ]
  },
  {
    id: 'wimille',
    name: 'Club Wimille',
    city: 'Wimille',
    department: '62',
    address: 'Centre culturel, Place Charles de Gaulle, 62126 Wimille',
    phone: '03 21 33 47 89',
    email: 'wimille@phuonglong.fr',
    schedules: ['Lundi 19h-21h', 'Mercredi 19h-21h', 'Samedi 14h-16h'],
    specialties: ['Self-défense féminine', 'Vo Dao adapté', 'Relaxation'],
    instructors: [
      {
        name: 'Professeur Anne Lefebvre',
        grade: '3ème Dang',
        bio: 'Spécialisée dans l\'adaptation des techniques aux différents publics.',
        photo: 'https://images.pexels.com/photos/7045767/pexels-photo-7045767.jpeg?auto=compress&cs=tinysrgb&w=300'
      }
    ],
    description: 'Club moderne privilégiant l\'accessibilité et l\'adaptation des pratiques à tous les âges.',
    photos: [
      'https://images.pexels.com/photos/7045683/pexels-photo-7045683.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    facebookPosts: [
      {
        id: '5',
        content: 'Nouveau cours de self-défense féminine tous les mercredis !',
        date: '2024-01-11',
        likes: 18
      }
    ]
  }
];

const events: Event[] = [
  {
    id: '1',
    title: 'Championnat Régional Vo Dao',
    date: '2024-03-15',
    time: '9h00',
    location: 'Palais des Sports, Toulouse',
    type: 'competition',
    description: 'Compétition annuelle regroupant tous les clubs de la région.',
    image: 'https://images.pexels.com/photos/7045874/pexels-photo-7045874.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    title: 'Stage Maître Invité',
    date: '2024-02-20',
    time: '14h00',
    location: 'Dojo Central, Montaigut sur Save',
    type: 'stage',
    description: 'Stage exceptionnel avec Maître Ling Wei, 9ème Dang.',
    image: 'https://images.pexels.com/photos/7045875/pexels-photo-7045875.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

interface ClubContextType {
  clubs: Club[];
  events: Event[];
  getClub: (id: string) => Club | undefined;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const ClubProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const getClub = (id: string) => clubs.find(club => club.id === id);

  return (
    <ClubContext.Provider value={{ clubs, events, getClub }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};