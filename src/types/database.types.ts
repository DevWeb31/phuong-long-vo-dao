/**
 * Types de la base de données
 * Ces types seront générés automatiquement par Supabase CLI
 * Pour l'instant, on définit les types manuellement
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "superadmin" | "admin_club" | "coach" | "membre";
export type MemberStatus = "active" | "inactive" | "pending";
export type EventStatus = "draft" | "published" | "cancelled" | "completed";
export type RegistrationStatus = "pending" | "confirmed" | "cancelled" | "waitlist";
export type PostStatus = "draft" | "published" | "archived";

export interface Organization {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  emails: string[];
  phones: string[];
  social_links: Json;
  facebook_group_id: string | null;
  facebook_group_url: string | null;
  facebook_page_url: string | null;
  address: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  logo_url: string | null;
  cover_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Location {
  id: string;
  organization_id: string;
  name: string;
  address: string;
  city: string;
  postal_code: string;
  latitude: number | null;
  longitude: number | null;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Class {
  id: string;
  organization_id: string;
  location_id: string | null;
  coach_id: string | null;
  title: string;
  description: string | null;
  level: string;
  day_of_week: number; // 0 = Dimanche, 1 = Lundi, etc.
  start_time: string; // HH:mm format
  end_time: string;
  capacity: number | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Coach {
  id: string;
  organization_id: string;
  user_id: string | null;
  name: string;
  bio: string | null;
  photo_url: string | null;
  grade: string | null;
  specialties: string[];
  email: string | null;
  phone: string | null;
  social_links: Json;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  user_id: string;
  organization_id: string;
  role: UserRole;
  status: MemberStatus;
  joined_at: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  organization_id: string;
  location_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  start_at: string;
  end_at: string | null;
  capacity: number | null;
  price: number | null;
  registration_deadline: string | null;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface Registration {
  id: string;
  event_id: string;
  user_id: string;
  status: RegistrationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  organization_id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  cover_url: string | null;
  author_id: string;
  published_at: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  organization_id: string;
  file_path: string;
  file_name: string;
  mime_type: string;
  size_bytes: number;
  uploaded_by: string;
  created_at: string;
}

export interface AuditLog {
  id: string;
  actor_id: string | null;
  organization_id: string | null;
  action: string;
  target_type: string | null;
  target_id: string | null;
  metadata: Json;
  created_at: string;
}

