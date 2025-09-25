import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Clubs from './pages/Clubs';
import ClubDetail from './pages/ClubDetail';
import Events from './pages/Events';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import { ClubProvider } from './context/ClubContext';
import AdminApp from './admin/AdminApp';
import { MaintenanceProvider } from './admin/context/MaintenanceContext';
import MaintenanceWrapper from './components/MaintenanceWrapper';

function App() {
  const [isAdminMode, setIsAdminMode] = useState(window.location.pathname.startsWith('/admin'));

  // Admin mode
  if (isAdminMode || window.location.pathname.startsWith('/admin')) {
    return <AdminApp />;
  }

  // Public site
  return (
    <MaintenanceProvider>
      <ClubProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <MaintenanceWrapper>
              <Header />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/clubs" element={<Clubs />} />
                  <Route path="/club/:id" element={<ClubDetail />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
                </Routes>
              </main>
              <Footer />
            </MaintenanceWrapper>
          </div>
        </Router>
      </ClubProvider>
    </MaintenanceProvider>
  );
}

export default App;