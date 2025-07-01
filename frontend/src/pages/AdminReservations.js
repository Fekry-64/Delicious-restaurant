import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const AdminReservations = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalReservation, setModalReservation] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [filter, setFilter] = useState('all');
  const [editModalReservation, setEditModalReservation] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [savingEdit, setSavingEdit] = useState(false);

  const translations = {
    en: {
      reservationManagement: 'Reservation Management',
      backToDashboard: 'Back to Dashboard',
      reservationNumber: 'Reservation #',
      customerName: 'Customer Name',
      email: 'Email',
      phone: 'Phone',
      date: 'Date',
      time: 'Time',
      guests: 'Guests',
      status: 'Status',
      noReservations: 'No reservations found',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
      actions: 'Actions',
      viewDetails: 'View Details',
      updateStatus: 'Update Status',
      confirm: 'Confirm',
      cancel: 'Cancel',
      edit: 'Edit',
      save: 'Save',
      close: 'Close',
      specialRequests: 'Special Requests'
    },
    ar: {
      reservationManagement: 'إدارة الحجوزات',
      backToDashboard: 'العودة إلى لوحة الإدارة',
      reservationNumber: 'رقم الحجز #',
      customerName: 'اسم العميل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      date: 'التاريخ',
      time: 'الوقت',
      guests: 'عدد الضيوف',
      status: 'الحالة',
      noReservations: 'لا توجد حجوزات',
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      cancelled: 'ملغي',
      completed: 'مكتمل',
      actions: 'الإجراءات',
      viewDetails: 'عرض التفاصيل',
      updateStatus: 'تحديث الحالة',
      confirm: 'تأكيد',
      cancel: 'إلغاء',
      edit: 'تعديل',
      save: 'حفظ',
      close: 'إغلاق',
      specialRequests: 'طلبات خاصة'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/all-reservations');
      const data = await response.json();
      if (data.success) {
        setReservations(data.data.data || data.data);
      }
    } catch (error) {
      console.error('Error fetching reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'badge bg-warning',
      confirmed: 'badge bg-success',
      cancelled: 'badge bg-danger',
      completed: 'badge bg-secondary'
    };
    return statusClasses[status] || 'badge bg-secondary';
  };

  const handleStatusUpdate = async (reservationId, newStatus) => {
    setUpdatingId(reservationId);
    // Optimistically update UI
    setReservations(prev => prev.map(r => r.id === reservationId ? { ...r, status: newStatus } : r));
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reservations/${reservationId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      const result = await response.json();
      setUpdatingId(null);
      if (!result.success) {
        alert('Failed to update status');
        fetchReservations(); // fallback to refresh
      }
    } catch (error) {
      setUpdatingId(null);
      console.error('Error updating status:', error);
      alert('Error updating status');
      fetchReservations();
    }
  };

  const handleEditClick = (reservation) => {
    setEditForm({ ...reservation });
    setEditModalReservation(reservation);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSave = async () => {
    setSavingEdit(true);
    try {
      const response = await fetch(`http://localhost:8000/api/v1/reservations/${editForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const result = await response.json();
      setSavingEdit(false);
      if (result.success) {
        setReservations((prev) => prev.map(r => r.id === editForm.id ? { ...r, ...editForm } : r));
        setEditModalReservation(null);
      } else {
        alert('Failed to update reservation');
      }
    } catch (error) {
      setSavingEdit(false);
      alert('Error updating reservation');
    }
  };

  // Filtered reservations based on filter state
  const filteredReservations = filter === 'all'
    ? reservations.filter(r => r.status === 'pending')
    : reservations.filter(r => r.status === filter);

  if (loading) {
    return (
      <div className="centered-spinner">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-main-container container">
      <style>{`
        .reservation-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .reservation-filters .btn {
          border-radius: 2rem;
          font-weight: 500;
          min-width: 180px;
          transition: background 0.2s, color 0.2s;
        }
        .reservation-filters .btn.active, .reservation-filters .btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(40,167,69,0.15);
          outline: none;
        }
        .reservation-filters .btn-all {
          background: linear-gradient(90deg, #ffa500 0%, #cc6600 100%);
          color: #fff;
          border: none;
        }
        .reservation-filters .btn-all.active, .reservation-filters .btn-all:focus {
          background: linear-gradient(90deg, #cc6600 0%, #ffa500 100%);
          color: #fff;
        }
        .reservation-filters .btn-confirmed {
          background: #28a745;
          color: #fff;
          border: none;
        }
        .reservation-filters .btn-confirmed.active, .reservation-filters .btn-confirmed:focus {
          background: #218838;
          color: #fff;
        }
        .reservation-filters .btn-cancelled {
          background: #cc6600;
          color: #fff;
          border: none;
        }
        .reservation-filters .btn-cancelled.active, .reservation-filters .btn-cancelled:focus {
          background: #a94d00;
          color: #fff;
        }
      `}</style>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h1 className="mb-3">{t.reservationManagement}</h1>
            <div className="reservation-filters">
              <button onClick={() => setFilter('all')} className={`btn btn-all${filter === 'all' ? ' active' : ''}`}>{t.pending} {t.reservationManagement}</button>
              <button onClick={() => setFilter('confirmed')} className={`btn btn-confirmed${filter === 'confirmed' ? ' active' : ''}`}>{t.confirmed} {t.reservationManagement}</button>
              <button onClick={() => setFilter('cancelled')} className={`btn btn-cancelled${filter === 'cancelled' ? ' active' : ''}`}>{t.cancelled} {t.reservationManagement}</button>
              <button onClick={() => navigate('/admin')} className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>
                {t.backToDashboard}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">{t.reservationManagement}</h5>
              {filteredReservations.length === 0 ? (
                <p className="text-muted">{t.noReservations}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t.reservationNumber}</th>
                        <th>{t.customerName}</th>
                        <th>{t.email}</th>
                        <th>{t.phone}</th>
                        <th>{t.date}</th>
                        <th>{t.time}</th>
                        <th>{t.guests}</th>
                        <th>{t.status}</th>
                        <th>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredReservations.map((reservation) => (
                        <tr key={reservation.id}>
                          <td>#{reservation.id}</td>
                          <td>{reservation.name}</td>
                          <td>{reservation.email}</td>
                          <td>{reservation.phone}</td>
                          <td>{reservation.reservation_date && reservation.reservation_date.substring(0, 10)}</td>
                          <td>{reservation.reservation_time}</td>
                          <td>{reservation.guests}</td>
                          <td>
                            <span className={getStatusBadgeClass(reservation.status)}>
                              {t[reservation.status] || reservation.status}
                            </span>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                                title={t.viewDetails}
                                onClick={() => setModalReservation(reservation)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning me-2 rounded-pill"
                                title={t.edit}
                                onClick={() => handleEditClick(reservation)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              {reservation.status === 'pending' && (
                                <>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-success me-2 rounded-pill"
                                    title={t.confirm}
                                    onClick={() => handleStatusUpdate(reservation.id, 'confirmed')}
                                  >
                                    <i className="fas fa-check"></i>
                                  </button>
                                  <button
                                    type="button"
                                    className="btn btn-sm btn-outline-danger me-2 rounded-pill"
                                    title={t.cancel}
                                    onClick={() => handleStatusUpdate(reservation.id, 'cancelled')}
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for reservation details */}
      {modalReservation && (
        <div className="modal fade show custom-modal-overlay" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reservation Details</h5>
                <button type="button" className="btn-close" onClick={() => setModalReservation(null)}></button>
              </div>
              <div className="modal-body">
                <p><strong>ID:</strong> #{modalReservation.id}</p>
                <p><strong>Name:</strong> {modalReservation.name}</p>
                <p><strong>Email:</strong> {modalReservation.email}</p>
                <p><strong>Phone:</strong> {modalReservation.phone}</p>
                <p><strong>Date:</strong> {modalReservation.reservation_date && modalReservation.reservation_date.substring(0, 10)}</p>
                <p><strong>Time:</strong> {modalReservation.reservation_time}</p>
                <p><strong>Guests:</strong> {modalReservation.guests}</p>
                <p><strong>Status:</strong> {modalReservation.status}</p>
                <p><strong>Special Requests:</strong> {modalReservation.special_requests || '-'}</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalReservation(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal for reservation */}
      {editModalReservation && (
        <div className="modal fade show custom-modal-overlay" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t.edit} {t.reservationNumber} #{editForm.id}</h5>
                <button type="button" className="btn-close" onClick={() => setEditModalReservation(null)}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-2">
                    <label className="form-label">{t.customerName}</label>
                    <input type="text" className="form-control" name="name" value={editForm.name || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.email}</label>
                    <input type="email" className="form-control" name="email" value={editForm.email || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.phone}</label>
                    <input type="text" className="form-control" name="phone" value={editForm.phone || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.date}</label>
                    <input type="date" className="form-control" name="reservation_date" value={editForm.reservation_date || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.time}</label>
                    <input type="time" className="form-control" name="reservation_time" value={editForm.reservation_time || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.guests}</label>
                    <input type="number" className="form-control" name="guests" value={editForm.guests || ''} onChange={handleEditFormChange} />
                  </div>
                  <div className="mb-2">
                    <label className="form-label">{t.specialRequests}</label>
                    <textarea className="form-control" name="special_requests" value={editForm.special_requests || ''} onChange={handleEditFormChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditModalReservation(null)}>{t.close}</button>
                <button type="button" className="btn btn-primary" onClick={handleEditSave} disabled={savingEdit}>{savingEdit ? t.save + '...' : t.save}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReservations; 