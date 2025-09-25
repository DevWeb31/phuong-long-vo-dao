import { supabase, supabaseAdmin } from '../config/supabase';
import { Database } from '../types/database';

type MaintenanceRow = Database['public']['Tables']['maintenance']['Row'];
type MaintenanceInsert = Database['public']['Tables']['maintenance']['Insert'];
type MaintenanceUpdate = Database['public']['Tables']['maintenance']['Update'];

export class MaintenanceService {
  /**
   * Récupère l'état actuel de la maintenance
   */
  static async getMaintenanceStatus(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('maintenance')
        .select('is_active')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
        console.error('Erreur lors de la récupération du statut maintenance:', error);
        return false;
      }

      return data?.is_active || false;
    } catch (error) {
      console.error('Erreur lors de la récupération du statut maintenance:', error);
      return false;
    }
  }

  /**
   * Active ou désactive le mode maintenance
   */
  static async setMaintenanceMode(
    isActive: boolean, 
    message?: string, 
    userId?: string
  ): Promise<boolean> {
    try {
      const maintenanceData: MaintenanceInsert = {
        is_active: isActive,
        message: message || null,
        created_by: userId || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabaseAdmin
        .from('maintenance')
        .insert(maintenanceData);

      if (error) {
        console.error('Erreur lors de la mise à jour du mode maintenance:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mode maintenance:', error);
      return false;
    }
  }

  /**
   * Récupère l'historique de la maintenance
   */
  static async getMaintenanceHistory(): Promise<MaintenanceRow[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('maintenance')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Erreur lors de la récupération de l\'historique maintenance:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique maintenance:', error);
      return [];
    }
  }

  /**
   * Initialise la table maintenance si elle n'existe pas
   */
  static async initializeMaintenanceTable(): Promise<boolean> {
    try {
      // Vérifier si la table existe déjà
      const { data, error } = await supabaseAdmin
        .from('maintenance')
        .select('id')
        .limit(1);

      if (error && error.code !== 'PGRST116') {
        console.error('Erreur lors de la vérification de la table maintenance:', error);
        return false;
      }

      // Si aucune donnée n'existe, créer un enregistrement initial
      if (!data || data.length === 0) {
        const initialData: MaintenanceInsert = {
          is_active: false,
          message: 'Initialisation de la maintenance',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const { error: insertError } = await supabaseAdmin
          .from('maintenance')
          .insert(initialData);

        if (insertError) {
          console.error('Erreur lors de l\'initialisation de la maintenance:', insertError);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la maintenance:', error);
      return false;
    }
  }
}
