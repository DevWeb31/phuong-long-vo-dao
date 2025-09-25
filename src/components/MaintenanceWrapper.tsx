import React from 'react';
import { useMaintenance } from '../admin/context/MaintenanceContext';
import MaintenancePage from '../admin/pages/MaintenancePage';

interface MaintenanceWrapperProps {
  children: React.ReactNode;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const { isMaintenanceMode } = useMaintenance();

  // Si le mode maintenance est activé, afficher la page de maintenance
  if (isMaintenanceMode) {
    return <MaintenancePage />;
  }

  // Sinon, afficher le contenu normal
  return <>{children}</>;
};

export default MaintenanceWrapper;
