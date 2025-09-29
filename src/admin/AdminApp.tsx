import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import PasswordChangeModal from './components/PasswordChangeModal';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MemberManagement from './pages/MemberManagement';
import ClubManagement from './pages/ClubManagement';
import ContentManagement from './pages/ContentManagement';
import EventManagement from './pages/EventManagement';
import CommunicationManagement from './pages/CommunicationManagement';
import MediaManagement from './pages/MediaManagement';
import FAQManagement from './pages/FAQManagement';
import UserManagement from './pages/UserManagement';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import AdminLayout from './components/AdminLayout';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { MaintenanceProvider, useMaintenance } from './context/MaintenanceContext';
import MaintenancePage from './pages/MaintenancePage';
import './admin.css';
import { Sword } from 'lucide-react';

const AdminAppContent: React.FC = () => {
  const { user, loading, sessionRestored, showPasswordChangeModal, isFirstLoginModal, updatePassword, dismissPasswordChangeModal } = useAdmin();

  // Afficher le loading tant que la session n'est pas restaurée
  if (loading || !sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-red-900 to-slate-800">
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto">
            <Sword className="w-10 h-10 text-red-400 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-45 animate-bounce" />
            <Sword className="w-10 h-10 text-white/70 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rotate-45 animate-bounce [animation-delay:150ms]" />
          </div>
          <p className="mt-4 text-white/80">Préparation de votre dojo…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin />;
  }

  return (
    <>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/members" element={<MemberManagement />} />
          <Route path="/clubs" element={<ClubManagement />} />
          <Route path="/content" element={<ContentManagement />} />
          <Route path="/events" element={<EventManagement />} />
          <Route path="/communications" element={<CommunicationManagement />} />
          <Route path="/media" element={<MediaManagement />} />
          <Route path="/faq" element={<FAQManagement />} />
          <Route path="/users" element={<UserManagement />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminLayout>
      
      {/* Modal de changement de mot de passe */}
      <PasswordChangeModal
        isOpen={showPasswordChangeModal}
        onUpdatePassword={updatePassword}
        onDismiss={dismissPasswordChangeModal}
        isFirstLogin={isFirstLoginModal}
      />
    </>
  );
};

const AdminApp: React.FC = () => {
  return (
    <AdminProvider>
      <MaintenanceProvider>
        <Router basename="/admin">
          <div className="admin-app">
            <AdminAppContent />
            <Toaster position="top-right" />
          </div>
        </Router>
      </MaintenanceProvider>
    </AdminProvider>
  );
};

export default AdminApp;