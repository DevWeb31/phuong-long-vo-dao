import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { MaintenanceService } from '../../services/maintenanceService';

interface MaintenanceContextType {
  isMaintenanceMode: boolean;
  isLoading: boolean;
  toggleMaintenanceMode: () => Promise<void>;
  setMaintenanceMode: (enabled: boolean, message?: string) => Promise<void>;
  refreshMaintenanceStatus: () => Promise<void>;
}

const MaintenanceContext = createContext<MaintenanceContextType | undefined>(undefined);

interface MaintenanceProviderProps {
  children: ReactNode;
}

export const MaintenanceProvider: React.FC<MaintenanceProviderProps> = ({ children }) => {
  const [isMaintenanceMode, setIsMaintenanceMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Initialiser la maintenance au démarrage
  useEffect(() => {
    initializeMaintenance();
  }, []);

  const initializeMaintenance = async () => {
    try {
      setIsLoading(true);
      
      // Initialiser la table maintenance si nécessaire
      await MaintenanceService.initializeMaintenanceTable();
      
      // Charger l'état actuel depuis Supabase
      const status = await MaintenanceService.getMaintenanceStatus();
      setIsMaintenanceMode(status);
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de la maintenance:', error);
      // Fallback sur localStorage en cas d'erreur
      const savedState = localStorage.getItem('maintenance-mode');
      if (savedState !== null) {
        setIsMaintenanceMode(JSON.parse(savedState));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaintenanceMode = async () => {
    try {
      const newStatus = !isMaintenanceMode;
      await setMaintenanceMode(newStatus);
    } catch (error) {
      console.error('Erreur lors du toggle maintenance:', error);
    }
  };

  const setMaintenanceMode = async (enabled: boolean, message?: string) => {
    try {
      setIsLoading(true);
      
      const success = await MaintenanceService.setMaintenanceMode(
        enabled, 
        message || `Mode maintenance ${enabled ? 'activé' : 'désactivé'}`, 
        'admin' // TODO: Remplacer par l'ID de l'utilisateur connecté
      );

      if (success) {
        setIsMaintenanceMode(enabled);
        // Sauvegarder aussi en localStorage comme backup
        localStorage.setItem('maintenance-mode', JSON.stringify(enabled));
      } else {
        console.error('Échec de la mise à jour du mode maintenance');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du mode maintenance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshMaintenanceStatus = async () => {
    try {
      const status = await MaintenanceService.getMaintenanceStatus();
      setIsMaintenanceMode(status);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du statut maintenance:', error);
    }
  };

  const value: MaintenanceContextType = {
    isMaintenanceMode,
    isLoading,
    toggleMaintenanceMode,
    setMaintenanceMode,
    refreshMaintenanceStatus,
  };

  return (
    <MaintenanceContext.Provider value={value}>
      {children}
    </MaintenanceContext.Provider>
  );
};

export const useMaintenance = (): MaintenanceContextType => {
  const context = useContext(MaintenanceContext);
  if (context === undefined) {
    throw new Error('useMaintenance must be used within a MaintenanceProvider');
  }
  return context;
};
