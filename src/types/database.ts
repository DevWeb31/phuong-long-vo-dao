export interface Database {
  public: {
    Tables: {
      maintenance: {
        Row: {
          id: string;
          is_active: boolean;
          message: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          is_active?: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          is_active?: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'superadmin' | 'admin' | 'club_admin';
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'superadmin' | 'admin' | 'club_admin';
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'superadmin' | 'admin' | 'club_admin';
          last_login?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      clubs: {
        Row: {
          id: string;
          name: string;
          city: string;
          department: string;
          is_active: boolean;
          member_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          city: string;
          department: string;
          is_active?: boolean;
          member_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          city?: string;
          department?: string;
          is_active?: boolean;
          member_count?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}
