import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const Navbar = ({ siteData }) => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const heroHeight = window.innerHeight; // 100vh
      const isHomePage = location.pathname === '/';
      
      // Only transparent when on home page and over hero section
      if (isHomePage) {
        setIsScrolled(scrollPosition > heroHeight);
      } else {
        // On other pages, always have background
        setIsScrolled(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

  // Trigger scroll handler when page changes
  useEffect(() => {
    const scrollPosition = window.scrollY;
    const heroHeight = window.innerHeight;
    const isHomePage = location.pathname === '/';
    
    if (isHomePage) {
      setIsScrolled(scrollPosition > heroHeight);
    } else {
      setIsScrolled(true);
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Remove focus from button when closing menu to hide outline
    if (isMobileMenuOpen) {
      // Menu is closing, remove focus
      setTimeout(() => {
        document.activeElement?.blur();
      }, 100);
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Remove focus from toggle button when menu closes
    setTimeout(() => {
      document.activeElement?.blur();
    }, 100);
  };

  const translations = {
    en: {
      home: 'Home',
      menu: 'Menu',
      reservation: 'Reservation',
      contact: 'Contact',
      bookTable: 'Book a Table',
      bookNow: 'Book Now'
    },
    ar: {
      home: 'الرئيسية',
      menu: 'القائمة',
      reservation: 'الحجز',
      contact: 'اتصل بنا',
      bookTable: 'احجز طاولة',
      bookNow: 'احجز الآن'
    }
  };

  const t = translations[language];
  const isActive = (path) => (location.pathname === path ? 'active' : '');

  return (
    <>
      <style>
        {`
          .custom-navbar {
            background-color: transparent;
            position: fixed;
            top: 0;
            width: 100%;
            z-index: 1030;
            padding: 1.125rem 1rem;
            transition: background-color 0.3s ease;
          }

          .custom-navbar.scrolled {
            background-color: rgba(33, 37, 41, 0.95);
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            backdrop-filter: blur(10px);
          }

          .navbar-brand {
            font-size: 1.8rem;
            font-weight: bold;
            color: #fff !important;
            margin-left: 25px;
            margin-right: 25px;
          }

          .nav-link {
            color: #fff !important;
            font-size: 1rem;
            margin: 0 1rem;
            text-decoration: none;
          }

          .nav-link:hover,
          .navbar-brand:hover {
            color: #cc6600 !important;
          }

          .nav-container {
            display: flex;
            justify-content: center;
            align-items: center;
            max-width: 900px;
            margin: 0 auto;
            width: 100%;
          }

          .side-links {
            display: flex;
            gap: 20px;
            flex: 1;
            justify-content: flex-start;
          }

          .left-links {
            justify-content: flex-end;
          }

          .brand-container {
            flex: 0 0 auto;
            text-align: center;
            margin: 0 20px;
          }

          /* Responsive: hide desktop, show mobile */
          .desktop-navbar {
            display: flex;
          }

          .mobile-navbar {
            display: none;
          }

          @media (max-width: 768px) {
            .desktop-navbar {
              display: none;
            }

            .mobile-navbar {
              display: flex;
              flex-direction: column;
              align-items: center;
            }

            .mobile-toggle {
              display: flex;
              justify-content: space-between;
              align-items: center;
              width: 100%;
            }

            .mobile-menu {
              display: none;
              flex-direction: column;
              margin-top: 0.5rem;
              width: 100%;
              text-align: center;
              opacity: 0;
              transform: translateY(-10px);
              transition: all 0.3s ease;
              background: rgba(33, 37, 41, 0.95);
              backdrop-filter: blur(10px);
              border-radius: 10px;
              padding: 1rem 0;
              box-shadow: 0 4px 20px rgba(0,0,0,0.2);
            }

            .mobile-menu.show {
              display: flex;
              opacity: 1;
              transform: translateY(0);
            }

            .mobile-menu .nav-link {
              padding: 0.75rem 1rem;
              margin: 0.25rem 0;
              border-radius: 5px;
              transition: all 0.3s ease;
            }

            .mobile-menu .nav-link:hover {
              background: rgba(255, 255, 255, 0.1);
              transform: translateX(5px);
            }

            .navbar-toggler {
              transition: transform 0.3s ease;
              background: none !important;
              border: none !important;
              color: #fff !important;
              font-size: 1.5rem !important;
              padding: 8px;
              cursor: pointer;
              border-radius: 6px;
            }

            .navbar-toggler.rotated {
              transform: rotate(90deg);
            }

            .navbar-toggler:hover,
            .navbar-toggler:focus {
              outline: 2px solid rgba(255, 255, 255, 0.8) !important;
              outline-offset: 4px !important;
              border-radius: 6px !important;
              transition: all 0.3s ease !important;
            }

            .navbar-toggler:focus {
              outline: 2px solid rgba(255, 255, 255, 1) !important;
              outline-offset: 4px !important;
            }
          }
        `}
      </style>

      {/* ✅ Desktop Navbar */}
      <nav className={`custom-navbar desktop-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          {/* Left Links */}
          <div className="side-links left-links">
            <Link className={`nav-link ${isActive('/')}`} to="/">{t.home}</Link>
            <Link className={`nav-link ${isActive('/menu')}`} to="/menu">{t.menu}</Link>
          </div>

          {/* Brand */}
          <div className="brand-container">
            <Link className="navbar-brand" to="/">
              {siteData?.info?.name_en || 'Restaurant'}
            </Link>
          </div>

          {/* Right Links */}
          <div className="side-links right-links">
            <Link className={`nav-link ${isActive('/contact')}`} to="/contact">{t.contact}</Link>
            <Link className={`nav-link ${isActive('/bookTable')}`} to="/reservation">{t.bookTable}</Link>
          </div>
        </div>
      </nav>

      {/* ✅ Mobile Navbar */}
      <nav className={`custom-navbar mobile-navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="mobile-toggle">
          <Link className="navbar-brand" to="/">
            {siteData?.info?.name_en || 'Restaurant'}
          </Link>
          <button
            className={`navbar-toggler ${isMobileMenuOpen ? 'rotated' : ''}`}
            onClick={toggleMobileMenu}
          >
            ☰
          </button>
        </div>

        <div id="mobileMenu" className={`mobile-menu ${isMobileMenuOpen ? 'show' : ''}`}>
          <Link className={`nav-link ${isActive('/')}`} to="/" onClick={closeMobileMenu}>{t.home}</Link>
          <Link className={`nav-link ${isActive('/menu')}`} to="/menu" onClick={closeMobileMenu}>{t.menu}</Link>
          <Link className={`nav-link ${isActive('/contact')}`} to="/contact" onClick={closeMobileMenu}>{t.contact}</Link>
          <Link className={`nav-link ${isActive('/bookTable')}`} to="/reservation" onClick={closeMobileMenu}>{t.bookTable}</Link>
      </div>
    </nav>
    </>
  );
};

export default Navbar; 
