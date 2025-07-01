import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const NotFound = () => {
  const { language } = useContext(LanguageContext);

  const translations = {
    en: {
      title: '404 - Page Not Found',
      subtitle: 'Oops! The page you are looking for does not exist.',
      description: 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.',
      backHome: 'Back to Home',
      or: 'or',
      goMenu: 'Go to Menu',
      goContact: 'Contact Us'
    },
    ar: {
      title: '404 - الصفحة غير موجودة',
      subtitle: 'عذراً! الصفحة التي تبحث عنها غير موجودة.',
      description: 'الصفحة التي تبحث عنها قد تكون محذوفة، أو تم تغيير اسمها، أو غير متاحة مؤقتاً.',
      backHome: 'العودة للرئيسية',
      or: 'أو',
      goMenu: 'اذهب للقائمة',
      goContact: 'اتصل بنا'
    }
  };

  const t = translations[language];

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6 text-center">
          <div className="error-page">
            {/* 404 Number */}
            <div className="error-number">
              <h1 className="display-1 fw-bold text-muted">404</h1>
            </div>

            {/* Error Content */}
            <div className="error-content">
              <h2 className="h3 mb-3">{t.title}</h2>
              <p className="lead text-muted mb-4">{t.subtitle}</p>
              <p className="text-muted mb-5">{t.description}</p>

              {/* Action Buttons */}
              <div className="error-actions">
                <Link to="/" className="btn btn-primary btn-lg me-3 mb-2">
                  <i className="fas fa-home me-2"></i>
                  {t.backHome}
                </Link>
                
                <div className="d-flex flex-column flex-sm-row justify-content-center align-items-center gap-2">
                  <Link to="/menu" className="btn btn-outline-primary">
                    <i className="fas fa-utensils me-2"></i>
                    {t.goMenu}
                  </Link>
                  <span className="text-muted">{t.or}</span>
                  <Link to="/contact" className="btn btn-outline-secondary">
                    <i className="fas fa-envelope me-2"></i>
                    {t.goContact}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          .error-page {
            padding: 3rem 0;
          }

          .error-number {
            margin-bottom: 2rem;
          }

          .error-number h1 {
            font-size: 8rem;
            color: #e9ecef;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 0;
          }

          .error-content h2 {
            color: #333;
            font-weight: 600;
          }

          .error-content .lead {
            font-size: 1.25rem;
            color: #6c757d;
          }

          .error-actions {
            margin-top: 2rem;
          }

          .error-actions .btn {
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .error-actions .btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.15);
          }

          .error-actions .btn-primary {
            background: linear-gradient(135deg, #ffa500, #cc6600);
            border: none;
          }

          .error-actions .btn-primary:hover {
            background: linear-gradient(135deg, #cc6600, #ffa500);
            color: white;
          }

          .error-actions .btn-outline-primary {
            border-color: #ffa500;
            color: #ffa500;
          }

          .error-actions .btn-outline-primary:hover {
            background-color: #ffa500;
            border-color: #ffa500;
            color: white;
          }

          .error-actions .btn-outline-secondary {
            border-color: #6c757d;
            color: #6c757d;
          }

          .error-actions .btn-outline-secondary:hover {
            background-color: #6c757d;
            border-color: #6c757d;
            color: white;
          }

          /* RTL Support */
          .rtl .error-actions .btn {
            margin-left: 0;
            margin-right: 1rem;
          }

          .rtl .error-actions .btn:last-child {
            margin-right: 0;
          }

          /* Mobile Responsive */
          @media (max-width: 768px) {
            .error-number h1 {
              font-size: 6rem;
            }

            .error-content h2 {
              font-size: 1.5rem;
            }

            .error-content .lead {
              font-size: 1.1rem;
            }

            .error-actions .btn {
              padding: 0.6rem 1.2rem;
              font-size: 0.9rem;
            }
          }

          @media (max-width: 576px) {
            .error-number h1 {
              font-size: 4rem;
            }

            .error-actions {
              flex-direction: column;
            }

            .error-actions .btn {
              margin: 0.25rem 0;
              width: 100%;
            }
          }
        `}
      </style>
    </div>
  );
};

export default NotFound; 