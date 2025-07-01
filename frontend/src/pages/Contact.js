import React, { useContext, useEffect, useRef, useState } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default markers in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const Contact = ({ siteData }) => {
  const { language } = useContext(LanguageContext);
  const [coords, setCoords] = useState(null);
  const [geoError, setGeoError] = useState(false);
  const mapContainerRef = useRef(null); // DOM node for map
  const mapInstanceRef = useRef(null); // Leaflet map instance
  const markerRef = useRef(null);

  useEffect(() => {
    if (siteData?.contact?.address_en) {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(siteData.contact.address_en)}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.length > 0) {
            setCoords({ lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) });
            setGeoError(false);
          } else {
            setGeoError(true);
          }
        })
        .catch(() => setGeoError(true));
    }
  }, [siteData?.contact?.address_en]);

  useEffect(() => {
    if (coords && mapContainerRef.current) {
      // Clean up any previous map instance
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
      // Create new map instance
      mapInstanceRef.current = L.map(mapContainerRef.current).setView([coords.lat, coords.lon], 16);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);
      markerRef.current = L.marker([coords.lat, coords.lon]).addTo(mapInstanceRef.current);
    }
    // Clean up on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
        }
    };
  }, [coords]);

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'Get in touch with us for reservations, questions, or feedback',
      contactInfo: 'Contact Information',
      address: 'Address',
      phone: 'Phone',
      email: 'Email',
      openingHours: 'Opening Hours',
      location: 'Our Location',
      sendMessage: 'Send Message',
      name: 'Your Name',
      emailLabel: 'Your Email',
      subject: 'Subject',
      message: 'Message',
      submit: 'Send Message',
      submitting: 'Sending...',
      success: 'Message sent successfully!',
      error: 'Error sending message',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      followUs: 'Follow Us',
      visitUs: 'Visit Us',
      callUs: 'Call Us',
      emailUs: 'Email Us'
    },
    ar: {
      title: 'اتصل بنا',
      subtitle: 'تواصل معنا للحجوزات أو الأسئلة أو الملاحظات',
      contactInfo: 'معلومات الاتصال',
      address: 'العنوان',
      phone: 'الهاتف',
      email: 'البريد الإلكتروني',
      openingHours: 'ساعات العمل',
      location: 'موقعنا',
      sendMessage: 'إرسال رسالة',
      name: 'اسمك',
      emailLabel: 'بريدك الإلكتروني',
      subject: 'الموضوع',
      message: 'الرسالة',
      submit: 'إرسال الرسالة',
      submitting: 'جاري الإرسال...',
      success: 'تم إرسال الرسالة بنجاح!',
      error: 'خطأ في إرسال الرسالة',
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      followUs: 'تابعنا',
      visitUs: 'زرنا',
      callUs: 'اتصل بنا',
      emailUs: 'راسلنا'
    }
  };

  const t = translations[language];

  return (
    <div className="container py-5 mt-5 contact-page">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold mb-3">{t.title}</h1>
        <p className="lead text-muted">{t.subtitle}</p>
      </div>

      <div className="row">
        {/* Map - Full width on mobile, 8 columns on desktop */}
        <div className="col-12 col-lg-8 mb-5 order-1 order-lg-2">
          <div className="card border-0 shadow h-100">
            <div className="card-body p-4">
              <h3 className="card-title mb-4 text-center">{t.location}</h3>
              <div className="map-wrapper">
                {siteData?.contact?.address_en && coords && !geoError ? (
                  <div className="map-container">
                    <div ref={mapContainerRef} className="interactive-map" />
                  </div>
                ) : (
                  <div className="map-container">
                    <div className="map-placeholder">
                      <div className="map-placeholder-content">
                        <i className="fas fa-map-marker-alt fa-3x mb-3"></i>
                        <h5 className="mb-2">Our Location</h5>
                        <p className="mb-3 text-muted">{siteData?.contact?.address_en || 'Address not available'}</p>
                        <a 
                          href={`https://maps.google.com/?q=${encodeURIComponent(siteData?.contact?.address_en || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary"
                        >
                          <i className="fas fa-external-link-alt me-2"></i>
                          Open in Google Maps
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information - Full width on mobile, 4 columns on desktop */}
        <div className="col-12 col-lg-4 mb-5 order-2 order-lg-1">
          <div className="card border-0 shadow h-100">
            <div className="card-body p-4">
              <h3 className="card-title mb-4">{t.contactInfo}</h3>
              
              <div className="contact-info-container">
                {/* Address */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div className="contact-content">
                    <h6 className="contact-label">{t.address}</h6>
                    <p className="contact-value">
                      {siteData?.contact?.address_en || '123 Main Street, Downtown, City, State 12345'}
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-phone"></i>
                  </div>
                  <div className="contact-content">
                    <h6 className="contact-label">{t.phone}</h6>
                    <a href={`tel:${siteData?.contact?.phone}`} className="contact-value contact-link">
                      {siteData?.contact?.phone || '+1 (555) 123-4567'}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div className="contact-content">
                    <h6 className="contact-label">{t.email}</h6>
                    <a href={`mailto:${siteData?.contact?.email}`} className="contact-value contact-link">
                      {siteData?.contact?.email || 'info@restaurant.com'}
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="contact-item">
                  <div className="contact-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="contact-content">
                    <h6 className="contact-label">{t.openingHours}</h6>
                    <div className="contact-value">
                      {siteData?.contact?.opening_hours_en ? (
                        <pre className="opening-hours">
                          {siteData.contact.opening_hours_en}
                        </pre>
                      ) : (
                        <div className="opening-hours">
                          <div>Monday - Friday: 11:00 AM - 10:00 PM</div>
                          <div>Saturday - Sunday: 10:00 AM - 11:00 PM</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              <div className="social-section">
                <h6 className="social-title">{t.followUs}</h6>
                <div className="social-links">
                  {siteData?.social?.facebook && (
                    <a href={siteData.social.facebook} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-facebook"></i>
                    </a>
                  )}
                  {siteData?.social?.instagram && (
                    <a href={siteData.social.instagram} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-instagram"></i>
                    </a>
                  )}
                  {siteData?.social?.twitter && (
                    <a href={siteData.social.twitter} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-twitter"></i>
                    </a>
                  )}
                  {siteData?.social?.youtube && (
                    <a href={siteData.social.youtube} target="_blank" rel="noopener noreferrer" className="social-link">
                      <i className="fab fa-youtube"></i>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-0 shadow">
            <div className="card-body p-4">
              <h3 className="text-center mb-4">
                {language === 'en' ? 'Quick Actions' : 'إجراءات سريعة'}
              </h3>
              <div className="row text-center">
                <div className="col-6 col-md-3 mb-3">
                  <a href={`tel:${siteData?.contact?.phone}`} className="text-decoration-none">
                    <div className="p-3">
                      <i className="fas fa-phone fa-2x text-danger mb-2"></i>
                      <h6>{t.callUs}</h6>
                    </div>
                  </a>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <a href={`mailto:${siteData?.contact?.email}`} className="text-decoration-none">
                    <div className="p-3">
                      <i className="fas fa-envelope fa-2x text-danger mb-2"></i>
                      <h6>{t.emailUs}</h6>
                    </div>
                  </a>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <a href="/reservation" className="text-decoration-none">
                    <div className="p-3">
                      <i className="fas fa-calendar fa-2x text-danger mb-2"></i>
                      <h6>{language === 'en' ? 'Book Table' : 'احجز طاولة'}</h6>
                    </div>
                  </a>
                </div>
                <div className="col-6 col-md-3 mb-3">
                  <a href="/menu" className="text-decoration-none">
                    <div className="p-3">
                      <i className="fas fa-utensils fa-2x text-danger mb-2"></i>
                      <h6>{language === 'en' ? 'View Menu' : 'عرض القائمة'}</h6>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          /* Contact Information Styling - Specific to contact page */
          .contact-page .contact-info-container {
            margin-bottom: 2rem;
          }

          .contact-page .contact-item {
            display: flex;
            align-items: flex-start;
            margin-bottom: 1.5rem;
            padding: 1rem;
            background: white;
            border-radius: 10px;
            transition: all 0.3s ease;
            border: 1px solid #e9ecef;
          }

          .contact-page .contact-item:hover {
            background: #f8f9fa;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-color: #cc6600;
          }

          .contact-page .contact-icon {
            background: linear-gradient(135deg, #ffa500, #cc6600);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 1rem;
            flex-shrink: 0;
            font-size: 1rem;
          }

          .contact-page .contact-content {
            flex: 1;
            min-width: 0;
          }

          .contact-page .contact-label {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.5rem;
            font-size: 0.9rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .contact-page .contact-value {
            color: #666;
            margin-bottom: 0;
            font-size: 0.95rem;
            line-height: 1.4;
          }

          .contact-page .contact-link {
            text-decoration: none;
            color: #666;
            transition: color 0.3s ease;
          }

          .contact-page .contact-link:hover {
            color: #cc6600;
          }

          .contact-page .opening-hours {
            font-family: inherit;
            white-space: pre-wrap;
            margin: 0;
            line-height: 1.5;
          }

          /* Social Media Section */
          .contact-page .social-section {
            border-top: 1px solid #dee2e6;
            padding-top: 1.5rem;
          }

          .contact-page .social-title {
            font-weight: 600;
            color: #333;
            margin-bottom: 1rem;
            text-align: center;
          }

          .contact-page .social-links {
            display: flex;
            justify-content: center;
            gap: 1rem;
          }

          .contact-page .social-link {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 45px;
            height: 45px;
            background: linear-gradient(135deg, #ffa500, #cc6600);
            color: white;
            border-radius: 50%;
            text-decoration: none;
            transition: all 0.3s ease;
            font-size: 1.2rem;
          }

          .contact-page .social-link:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 20px rgba(255, 165, 0, 0.3);
            color: white;
          }

          /* Map Container Styles */
          .map-wrapper {
            width: 100%;
            height: 420px;
            max-height: 60vh;
            min-height: 280px;
            border-radius: 15px;
            overflow: hidden;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            margin: 0 auto 1.5rem auto;
            display: flex;
            flex-direction: column;
            flex: 1;
          }

          .map-container {
            position: relative;
            width: 100%;
            height: 100%;
            flex: 1;
            display: flex;
          }

          .interactive-map {
            width: 100%;
            height: 100%;
            min-height: 220px;
            max-height: 60vh;
            border-radius: 15px;
            z-index: 1;
            flex: 1;
          }

          .map-placeholder {
            position: relative;
            width: 100%;
            height: 100%;
            border-radius: 15px;
            overflow: hidden;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
          }

          .map-placeholder:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          }

          .map-placeholder-content {
            text-align: center;
            padding: 2rem;
            color: white;
          }

          .map-placeholder-content i {
            color: white;
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.9;
          }

          .map-placeholder-content h5 {
            color: white;
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 1.25rem;
          }

          .map-placeholder-content p {
            color: rgba(255, 255, 255, 0.9);
            margin: 0 0 1.5rem 0;
            font-size: 0.95rem;
            line-height: 1.4;
          }

          .map-placeholder-content .btn {
            background: linear-gradient(135deg, #ffa500, #cc6600);
            border: none;
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            text-decoration: none;
            transition: all 0.3s ease;
            font-weight: 500;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
          }

          .map-placeholder-content .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(255, 165, 0, 0.4);
            color: white;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .contact-page .contact-item {
              margin-bottom: 1rem;
              padding: 0.75rem;
            }

            .contact-page .contact-icon {
              width: 35px;
              height: 35px;
              font-size: 0.9rem;
              margin-right: 0.75rem;
            }

            .contact-page .contact-label {
              font-size: 0.85rem;
            }

            .contact-page .contact-value {
              font-size: 0.9rem;
            }

            .map-wrapper {
              height: 260px;
              min-height: 180px;
              max-height: 40vh;
            }

            .map-placeholder-content {
              padding: 1.5rem;
            }

            .map-placeholder-content i {
              font-size: 2.5rem;
            }

            .map-placeholder-content h5 {
              font-size: 1.1rem;
            }

            .map-placeholder-content p {
              font-size: 0.9rem;
            }

            .map-placeholder-content .btn {
              padding: 0.6rem 1.2rem;
              font-size: 0.9rem;
            }
          }

          @media (max-width: 576px) {
            .map-wrapper {
              height: 180px;
              min-height: 120px;
              max-height: 30vh;
            }

            .map-placeholder-content {
              padding: 1rem;
            }

            .map-placeholder-content i {
              font-size: 2rem;
            }

            .map-placeholder-content h5 {
              font-size: 1rem;
            }

            .map-placeholder-content p {
              font-size: 0.85rem;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Contact; 