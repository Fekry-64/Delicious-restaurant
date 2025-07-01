import React, { useState, useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';

const Reservation = () => {
  const { language } = useContext(LanguageContext);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    reservation_date: '',
    reservation_time: '',
    guests: 2,
    special_requests: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const translations = {
    en: {
      title: 'Make a Reservation',
      subtitle: 'Book your table and enjoy an unforgettable dining experience',
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Phone Number',
      date: 'Reservation Date',
      time: 'Reservation Time',
      guests: 'Number of Guests',
      specialRequests: 'Special Requests',
      submit: 'Book Reservation',
      submitting: 'Booking...',
      success: 'Reservation Submitted Successfully!',
      successMessage: 'Thank you for your reservation. We will confirm your booking shortly.',
      error: 'Error submitting reservation',
      errorMessage: 'Please try again or contact us directly.',
      required: 'This field is required',
      invalidEmail: 'Please enter a valid email address',
      invalidPhone: 'Please enter a valid phone number',
      invalidDate: 'Please select a future date',
      invalidGuests: 'Please select between 1 and 20 guests'
    },
    ar: {
      title: 'احجز طاولة',
      subtitle: 'احجز طاولتك واستمتع بتجربة طعام لا تنسى',
      name: 'الاسم الكامل',
      email: 'البريد الإلكتروني',
      phone: 'رقم الهاتف',
      date: 'تاريخ الحجز',
      time: 'وقت الحجز',
      guests: 'عدد الضيوف',
      specialRequests: 'طلبات خاصة',
      submit: 'احجز الطاولة',
      submitting: 'جاري الحجز...',
      success: 'تم إرسال الحجز بنجاح!',
      successMessage: 'شكراً لحجزك. سنؤكد حجزك قريباً.',
      error: 'خطأ في إرسال الحجز',
      errorMessage: 'يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.',
      required: 'هذا الحقل مطلوب',
      invalidEmail: 'يرجى إدخال بريد إلكتروني صحيح',
      invalidPhone: 'يرجى إدخال رقم هاتف صحيح',
      invalidDate: 'يرجى اختيار تاريخ في المستقبل',
      invalidGuests: 'يرجى اختيار بين 1 و 20 ضيف'
    }
  };

  const t = translations[language];

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = t.required;
    }

    if (!formData.email.trim()) {
      newErrors.email = t.required;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t.invalidEmail;
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t.required;
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t.invalidPhone;
    }

    if (!formData.reservation_date) {
      newErrors.reservation_date = t.required;
    } else {
      const selectedDate = new Date(formData.reservation_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.reservation_date = t.invalidDate;
      }
    }

    if (!formData.reservation_time) {
      newErrors.reservation_time = t.required;
    }

    if (formData.guests < 1 || formData.guests > 20) {
      newErrors.guests = t.invalidGuests;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('http://localhost:8000/api/v1/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          reservation_date: '',
          reservation_time: '',
          guests: 2,
          special_requests: ''
        });
      } else {
        setSubmitStatus('error');
        if (data.errors) {
          setErrors(data.errors);
        }
      }
    } catch (error) {
      console.error('Error submitting reservation:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="container py-5 mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">{t.title}</h1>
            <p className="lead text-muted">{t.subtitle}</p>
          </div>

          {/* Success/Error Messages */}
          {submitStatus === 'success' && (
            <div className="alert alert-success alert-dismissible fade show" role="alert">
              <h5>{t.success}</h5>
              <p className="mb-0">{t.successMessage}</p>
              <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="alert alert-danger alert-dismissible fade show" role="alert">
              <h5>{t.error}</h5>
              <p className="mb-0">{t.errorMessage}</p>
              <button type="button" className="btn-close" onClick={() => setSubmitStatus(null)}></button>
            </div>
          )}

          {/* Reservation Form */}
          <div className="card border-0 shadow">
            <div className="card-body p-5">
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="name" className="form-label">{t.name} *</label>
                    <input
                      type="text"
                      className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">{t.email} *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="phone" className="form-label">{t.phone} *</label>
                    <input
                      type="tel"
                      className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="guests" className="form-label">{t.guests} *</label>
                    <select
                      className={`form-select ${errors.guests ? 'is-invalid' : ''}`}
                      id="guests"
                      name="guests"
                      value={formData.guests}
                      onChange={handleChange}
                    >
                      {[...Array(19)].map((_, i) => (
                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                      ))}
                    </select>
                    {errors.guests && <div className="invalid-feedback">{errors.guests}</div>}
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="reservation_date" className="form-label">{t.date} *</label>
                    <input
                      type="date"
                      className={`form-control ${errors.reservation_date ? 'is-invalid' : ''}`}
                      id="reservation_date"
                      name="reservation_date"
                      value={formData.reservation_date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.reservation_date && <div className="invalid-feedback">{errors.reservation_date}</div>}
                  </div>

                  <div className="col-md-6 mb-3">
                    <label htmlFor="reservation_time" className="form-label">{t.time} *</label>
                    <input
                      type="time"
                      className={`form-control ${errors.reservation_time ? 'is-invalid' : ''}`}
                      id="reservation_time"
                      name="reservation_time"
                      value={formData.reservation_time}
                      onChange={handleChange}
                    />
                    {errors.reservation_time && <div className="invalid-feedback">{errors.reservation_time}</div>}
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="special_requests" className="form-label">{t.specialRequests}</label>
                  <textarea
                    className="form-control"
                    id="special_requests"
                    name="special_requests"
                    rows="3"
                    value={formData.special_requests}
                    onChange={handleChange}
                    placeholder={language === 'en' ? 'Any special requests or dietary requirements...' : 'أي طلبات خاصة أو متطلبات غذائية...'}
                  ></textarea>
                </div>

                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-danger btn-lg px-5"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t.submitting : t.submit}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reservation; 