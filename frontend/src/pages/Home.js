import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';
import backgroundImage from '../assets/img/background-2068215_960_720.jpg';
import aboutImage from '../assets/img/6514c1bc247aa0de075c55fe_picolo1.png';

const Home = ({ siteData }) => {
  const { language } = useContext(LanguageContext);

  const translations = {
    en: {
      welcome: 'Welcome to',
      experience: 'Experience the finest dining',
      description: 'Discover our carefully crafted menu featuring fresh ingredients and authentic flavors. From appetizers to desserts, every dish is prepared with passion and attention to detail.',
      viewMenu: 'View Our Menu',
      bookTable: 'Book a Table',
      aboutUs: 'About Us',
      aboutDescription: 'We are passionate about creating memorable dining experiences. Our team of expert chefs uses only the finest ingredients to bring you authentic flavors that will delight your senses.',
      specialties: 'Our Specialties',
      specialtiesDescription: 'From traditional favorites to innovative creations, our menu offers something for everyone. Each dish is crafted with care and served with warmth.',
      learnMore: 'Learn More'
    },
    ar: {
      welcome: 'مرحباً بكم في',
      experience: 'استمتع بأفضل المأكولات',
      description: 'اكتشف قائمتنا المصممة بعناية والتي تحتوي على مكونات طازجة ونكهات أصيلة. من المقبلات إلى الحلويات، كل طبق يتم إعداده بشغف واهتمام بالتفاصيل.',
      viewMenu: 'عرض القائمة',
      bookTable: 'احجز طاولة',
      aboutUs: 'من نحن',
      aboutDescription: 'نحن شغوفون بخلق تجارب طعام لا تنسى. فريقنا من الطهاة الخبراء يستخدم فقط أفضل المكونات لجلب لكم نكهات أصيلة ستسعد حواسكم.',
      specialties: 'ما نتميز به',
      specialtiesDescription: 'من الأطباق التقليدية المفضلة إلى الإبداعات المبتكرة، قائمتنا تقدم شيئاً للجميع. كل طبق يتم إعداده بعناية ويقدم بدفء.',
      learnMore: 'اعرف المزيد'
    }
  };

  const t = translations[language];

  return (
    <>
      <style>
        {`
          .about-section {
            min-height: 100vh;
            display: flex;
            align-items: center;
          }
          
          .about-image {
            height: 80vh;
            object-fit: cover;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          
          .about-text {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            height: 80vh;
          }
        `}
      </style>
      <div>
        {/* Hero Section */}
        <section className="hero-section position-relative" style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center'
        }}>
          <div className="container text-center text-white">
            <h1 className="display-3 fw-bold mb-4">
              {t.welcome} <br />
              {siteData?.info?.name_en || 'Delicious Restaurant'}
            </h1>
            <p className="lead mb-5">
              {t.experience}
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Link to="/menu" className="btn btn-outline-light btn-lg">
                {t.viewMenu}
              </Link>
              <Link to="/reservation" className="btn btn-outline-light btn-lg">
                {t.bookTable}
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-5 about-section">
          <div className="container">
            <div className="row align-items-center">
              
              <div className="col-lg-6">
                <img 
                  src={aboutImage}
                  alt="About Us"
                  className="about-image w-100"
                  loading="lazy"
                />
              </div>
              <div className="col-lg-6">
                <div className="about-text">
                  <h2 className="display-6 fw-bold mb-4">{t.aboutUs}</h2>
                  <p className="lead mb-4">
                    {t.aboutDescription}
                  </p>
                  <Link to="/menu" className="btn btn-danger">
                    {t.viewMenu}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Specialties Section */}
        <section className="py-5 bg-light">
          <div className="container">
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold mb-4">{t.specialties}</h2>
              <p className="lead text-muted">
                {t.specialtiesDescription}
              </p>
            </div>
            
            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-utensils fa-3x text-danger"></i>
                    </div>
                    <h5 className="card-title">Fresh Ingredients</h5>
                    <p className="card-text text-muted">
                      We source only the freshest ingredients from local suppliers to ensure the highest quality in every dish.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-star fa-3x text-danger"></i>
                    </div>
                    <h5 className="card-title">Expert Chefs</h5>
                    <p className="card-text text-muted">
                      Our team of experienced chefs brings creativity and expertise to every dish they prepare.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="col-md-4">
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body text-center p-4">
                    <div className="mb-3">
                      <i className="fas fa-heart fa-3x text-danger"></i>
                    </div>
                    <h5 className="card-title">Passionate Service</h5>
                    <p className="card-text text-muted">
                      We believe in providing exceptional service with a warm, welcoming atmosphere for all our guests.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-5 bg-danger text-white">
          <div className="container text-center">
            <h2 className="display-6 fw-bold mb-4">
              {language === 'en' ? 'Ready to Experience Great Food?' : 'مستعد لتجربة طعام رائع؟'}
            </h2>
            <p className="lead mb-4">
              {language === 'en' 
                ? 'Book your table today and enjoy an unforgettable dining experience.' 
                : 'احجز طاولتك اليوم واستمتع بتجربة طعام لا تنسى.'
              }
            </p>
            <Link to="/reservation" className="btn btn-light btn-lg">
              {t.bookTable}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default Home; 