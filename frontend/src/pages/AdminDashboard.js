import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const AdminDashboard = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });

  const translations = {
    en: {
      adminDashboard: 'Admin Dashboard',
      welcomeMessage: 'Welcome to the Admin Dashboard',
      menuManagement: 'Menu Management',
      menuDescription: 'Add, edit, and manage menu items',
      orderManagement: 'Order Management',
      orderDescription: 'View and manage customer orders',
      reservationManagement: 'Reservation Management',
      reservationDescription: 'Manage table reservations',
      login: 'Login',
      username: 'Username',
      password: 'Password',
      invalidCredentials: 'Invalid credentials',
      logout: 'Logout'
    },
    ar: {
      adminDashboard: 'لوحة الإدارة',
      welcomeMessage: 'مرحباً بك في لوحة الإدارة',
      menuManagement: 'إدارة القائمة',
      menuDescription: 'إضافة وتعديل وإدارة عناصر القائمة',
      orderManagement: 'إدارة الطلبات',
      orderDescription: 'عرض وإدارة طلبات العملاء',
      reservationManagement: 'إدارة الحجوزات',
      reservationDescription: 'إدارة حجوزات الطاولات',
      login: 'تسجيل الدخول',
      username: 'اسم المستخدم',
      password: 'كلمة المرور',
      invalidCredentials: 'بيانات اعتماد غير صحيحة',
      logout: 'تسجيل الخروج'
    }
  };

  const t = translations[language];

  // Simple admin credentials (in production, this should be handled by backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
    } else {
      alert(t.invalidCredentials);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
  };

  const handleMenuManagement = () => {
    navigate('/admin/menu');
  };

  const handleOrderManagement = () => {
    navigate('/admin/orders');
  };

  const handleReservationManagement = () => {
    navigate('/admin/reservations');
  };

  if (!isAuthenticated) {
    return (
      <div className="admin-main-container container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-body">
                <h3 className="card-title text-center mb-4">{t.adminDashboard}</h3>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label htmlFor="username" className="form-label">{t.username}</label>
                    <input
                      type="text"
                      className="form-control"
                      id="username"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">{t.password}</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    {t.login}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main-container container">
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1 className="mb-0">{t.adminDashboard}</h1>
            <button onClick={handleLogout} className="btn btn-outline-danger">
              <i className="fas fa-sign-out-alt me-2"></i>
              {t.logout}
            </button>
          </div>
          <p className="text-muted mt-2">{t.welcomeMessage}</p>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm hover-card" onClick={handleMenuManagement} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-utensils fa-3x text-primary"></i>
              </div>
              <h5 className="card-title">{t.menuManagement}</h5>
              <p className="card-text text-muted">{t.menuDescription}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm hover-card" onClick={handleOrderManagement} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-shopping-cart fa-3x text-success"></i>
              </div>
              <h5 className="card-title">{t.orderManagement}</h5>
              <p className="card-text text-muted">{t.orderDescription}</p>
            </div>
          </div>
        </div>

        <div className="col-md-4 mb-4">
          <div className="card h-100 shadow-sm hover-card" onClick={handleReservationManagement} style={{ cursor: 'pointer' }}>
            <div className="card-body text-center">
              <div className="mb-3">
                <i className="fas fa-calendar-alt fa-3x text-warning"></i>
              </div>
              <h5 className="card-title">{t.reservationManagement}</h5>
              <p className="card-text text-muted">{t.reservationDescription}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 