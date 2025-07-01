import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const Footer = ({ siteData }) => {
  const { language, toggleLanguage } = useContext(LanguageContext);

  const translations = {
    en: {
      contact: 'Contact',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      openingHours: 'Opening Hours',
      followUs: 'Follow Us',
      allRightsReserved: 'All Rights Reserved',
      bookNow: 'Book Now'
    },
    ar: {
      contact: 'اتصل بنا',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      openingHours: 'ساعات العمل',
      followUs: 'تابعنا',
      allRightsReserved: 'جميع الحقوق محفوظة',
      bookNow: 'احجز الآن'
    }
  };

  const t = translations[language];

  return (
    <>
      <style>
        {`
          .contact-item {
            display: flex;
            align-items: center;
            margin-bottom: 1rem;
            transition: transform 0.3s ease;
          }
          
          .contact-item:hover {
            transform: translateX(5px);
          }
          
          .contact-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #cc6600, #b35900);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px rgba(204, 102, 0, 0.3);
            transition: all 0.3s ease;
          }
          
          .contact-item:hover .contact-icon {
            transform: scale(1.1);
            box-shadow: 0 4px 12px rgba(204, 102, 0, 0.4);
          }
          
          .contact-text {
            flex: 1;
          }
          
          .contact-text a {
            color: white;
            text-decoration: none;
            transition: color 0.3s ease;
          }
          
          .contact-text a:hover {
            color: #cc6600;
          }
          
          .opening-hours-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(45deg, #cc6600, #b35900);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            color: white;
            font-size: 1.1rem;
            box-shadow: 0 2px 8px rgba(204, 102, 0, 0.3);
            margin-bottom: 1rem;
          }

          .social-icon {
            color: #cc6600;
            font-size: 1.5rem;
            transition: all 0.3s ease;
            text-decoration: none;
          }

          .social-icon:hover {
            color: #ffa500;
            transform: scale(1.2);
          }
        `}
      </style>
    <footer className="bg-dark text-light py-5 mt-5">
      <div className="container">
        <div className="row">
            <div className="col-md-6 mb-4">
              <div className="opening-hours-icon">
                <i className="fas fa-clock"></i>
          </div>
            <h5>{t.openingHours}</h5>
              <div>
              {siteData?.contact?.opening_hours_en ? (
                  <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-wrap' }}>
                  {siteData.contact.opening_hours_en}
                </pre>
              ) : (
                <p>Monday - Friday: 11:00 AM - 10:00 PM<br />
                Saturday - Sunday: 10:00 AM - 11:00 PM</p>
              )}
            </div>
            
            <h6 className="mt-3">{t.followUs}</h6>
            <div className="d-flex gap-2">
              {siteData?.social?.facebook && (
                  <a href={siteData.social.facebook} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-facebook"></i>
                </a>
              )}
              {siteData?.social?.instagram && (
                  <a href={siteData.social.instagram} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-instagram"></i>
                </a>
              )}
              {siteData?.social?.twitter && (
                  <a href={siteData.social.twitter} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-twitter"></i>
                </a>
              )}
              {siteData?.social?.youtube && (
                  <a href={siteData.social.youtube} target="_blank" rel="noopener noreferrer" className="social-icon">
                    <i className="fab fa-youtube"></i>
                </a>
              )}
            </div>
          </div>
            
            <div className="col-md-6 mb-4">
              <h5>{t.contact}</h5>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-map-marker-alt"></i>
                </div>
                <div className="contact-text">
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(siteData?.contact?.address_en || '123 Main Street, Downtown')}`} target="_blank" rel="noopener noreferrer">
                    {siteData?.contact?.address_en || '123 Main Street, Downtown'}
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="contact-text">
                  <a href={`tel:${siteData?.contact?.phone}`}>
                    {siteData?.contact?.phone || '+1 (555) 123-4567'}
                  </a>
                </div>
              </div>
              
              <div className="contact-item">
                <div className="contact-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="contact-text">
                  <a href={`mailto:${siteData?.contact?.email}`}>
                    {siteData?.contact?.email || 'info@restaurant.com'}
                  </a>
                </div>
              </div>
            </div>
        </div>
        
        <hr className="my-4" />
        
        <div className="row align-items-center">
          <div className="col-md-6">
              <p className="mb-0">
              © 2024 {siteData?.info?.name_en || 'Restaurant'}. {t.allRightsReserved}
            </p>
          </div>
          <div className="col-md-6 text-md-end">
              <div className="d-flex flex-column align-items-end" style={{ gap: '10px' }}>
                <button 
                  className="btn btn-outline-light"
                  onClick={toggleLanguage}
                  style={{ minWidth: '80px' }}
                >
                  {language === 'en' ? 'العربية' : 'English'}
                </button>
                <Link to="/reservation" className="btn btn-danger">
                  {t.bookNow}
            </Link>
              </div>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer; 