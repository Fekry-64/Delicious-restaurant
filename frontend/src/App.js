import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './App.css';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LanguageContext from './contexts/LanguageContext';

// Pages
import Home from './pages/Home';
import Menu from './pages/Menu';
import Reservation from './pages/Reservation';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import AdminDashboard from './pages/AdminDashboard';
import AdminMenu from './pages/AdminMenu';
import AdminOrders from './pages/AdminOrders';
import AdminReservations from './pages/AdminReservations';
import Payment from './pages/Payment';
import NotFound from './pages/NotFound';
import AdminOrderDetails from './pages/AdminOrderDetails';

// Scroll to top component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [language, setLanguage] = useState('en');
  const [siteData, setSiteData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const [isInStandaloneMode, setIsInStandaloneMode] = useState(false);

  useEffect(() => {
    // Fetch site data
    fetchSiteData();

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const ios = /iphone|ipad|ipod/.test(userAgent);
    setIsIos(ios);
    // Detect if in standalone mode
    setIsInStandaloneMode(window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true);

    // Listen for the beforeinstallprompt event (Android/Chrome)
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const fetchSiteData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/site/all');
      const data = await response.json();
      if (data.success) {
        setSiteData(data.data);
      }
    } catch (error) {
      console.error('Error fetching site data:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowInstallPrompt(false);
        setDeferredPrompt(null);
      }
    }
  };

  const handleClosePrompt = () => setShowInstallPrompt(false);

  if (loading) {
    return (
      <div className="fullscreen-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      <Router>
        <div className={`App ${language === 'ar' ? 'rtl' : 'ltr'}`}>
          <ScrollToTop />
          <Navbar siteData={siteData} />
          <main>
            <Routes>
              <Route path="/" element={<Home siteData={siteData} />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/contact" element={<Contact siteData={siteData} />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<AdminMenu />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetails />} />
              <Route path="/admin/reservations" element={<AdminReservations />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer siteData={siteData} 
            canInstall={!!deferredPrompt && !isInStandaloneMode}
            onInstallClick={handleInstallClick}
            isIos={isIos}
            isInStandaloneMode={isInStandaloneMode}
          />
          {/* PWA Install Prompt */}
          {showInstallPrompt && !isInStandaloneMode && !isIos && (
            <div style={{position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 16, display: 'flex', alignItems: 'center', gap: 12}}>
              <span>Install this app for a better experience!</span>
              <button className="btn btn-primary" onClick={handleInstallClick}>Install</button>
              <button className="btn btn-link" onClick={handleClosePrompt} style={{color: '#888'}}>Dismiss</button>
            </div>
          )}
          {/* iOS Install Instructions */}
          {isIos && !isInStandaloneMode && (
            <div style={{position: 'fixed', bottom: 24, right: 24, zIndex: 9999, background: '#fff', border: '1px solid #ccc', borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', padding: 16, display: 'flex', alignItems: 'center', gap: 12, maxWidth: 320}}>
              <span style={{fontSize: 14}}>
                Install this app on your iPhone/iPad: tap <span style={{fontWeight: 'bold'}}>&#x2191;</span> then <b>Add to Home Screen</b>
              </span>
              <button className="btn btn-link" onClick={handleClosePrompt} style={{color: '#888'}}>Dismiss</button>
            </div>
          )}
        </div>
      </Router>
    </LanguageContext.Provider>
  );
}

export default App;
