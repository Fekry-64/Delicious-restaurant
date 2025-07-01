import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const AdminOrders = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const translations = {
    en: {
      orderManagement: 'Order Management',
      backToDashboard: 'Back to Dashboard',
      orderNumber: 'Order #',
      customer: 'Customer',
      total: 'Total',
      status: 'Status',
      date: 'Date',
      noOrders: 'No orders found',
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      paid: 'Paid',
      failed: 'Failed',
      actions: 'Actions',
      viewDetails: 'View Details',
      updateStatus: 'Update Status'
    },
    ar: {
      orderManagement: 'إدارة الطلبات',
      backToDashboard: 'العودة إلى لوحة الإدارة',
      orderNumber: 'رقم الطلب #',
      customer: 'العميل',
      total: 'المجموع',
      status: 'الحالة',
      date: 'التاريخ',
      noOrders: 'لا توجد طلبات',
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      paid: 'مدفوع',
      failed: 'فشل',
      actions: 'الإجراءات',
      viewDetails: 'عرض التفاصيل',
      updateStatus: 'تحديث الحالة'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/all-orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.data || data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'badge bg-warning',
      confirmed: 'badge bg-info',
      preparing: 'badge bg-primary',
      ready: 'badge bg-success',
      delivered: 'badge bg-secondary',
      cancelled: 'badge bg-danger',
      paid: 'badge bg-success',
      failed: 'badge bg-danger'
    };
    return statusClasses[status] || 'badge bg-secondary';
  };

  const getPaymentStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'badge bg-warning',
      paid: 'badge bg-success',
      failed: 'badge bg-danger'
    };
    return statusClasses[status] || 'badge bg-secondary';
  };

  const handleViewDetails = (order) => {
    navigate(`/admin/orders/${order.id}`, { state: { mode: 'view' } });
  };

  const handleEditOrder = (order) => {
    navigate(`/admin/orders/${order.id}`, { state: { mode: 'edit' } });
  };

  // Filtered orders based on filter state
  const filteredOrders = filter === 'all'
    ? orders.filter(order => order.order_status !== 'cancelled' && order.order_status !== 'delivered')
    : orders.filter(order => order.order_status === filter);

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
    <div className="admin-main-container container" style={{ marginTop: '100px' }}>
      <style>{`
        .order-filters {
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          margin-bottom: 1.5rem;
        }
        .order-filters .btn {
          border-radius: 2rem;
          font-weight: 500;
          min-width: 150px;
          transition: background 0.2s, color 0.2s;
        }
        .order-filters .btn.active, .order-filters .btn:focus {
          box-shadow: 0 0 0 0.2rem rgba(204,102,0,0.15);
          outline: none;
        }
        .order-filters .btn-pending {
          background: linear-gradient(90deg, #ffa500 0%, #cc6600 100%);
          color: #fff;
          border: none;
        }
        .order-filters .btn-pending.active, .order-filters .btn-pending:focus {
          background: linear-gradient(90deg, #cc6600 0%, #ffa500 100%);
          color: #fff;
        }
        .order-filters .btn-cancelled {
          background: #cc6600;
          color: #fff;
          border: none;
        }
        .order-filters .btn-cancelled.active, .order-filters .btn-cancelled:focus {
          background: #a94d00;
          color: #fff;
        }
        .order-filters .btn-delivered {
          background: #28a745;
          color: #fff;
          border: none;
        }
        .order-filters .btn-delivered.active, .order-filters .btn-delivered:focus {
          background: #218838;
          color: #fff;
        }
        .order-filters .btn-refresh {
          background: #fff;
          color: #cc6600;
          border: 2px solid #ffa500;
        }
        .order-filters .btn-refresh:hover, .order-filters .btn-refresh:focus {
          background: #ffa500;
          color: #fff;
        }
        .order-filters .btn-back {
          background: #fff;
          color: #333;
          border: 2px solid #ccc;
        }
        .order-filters .btn-back:hover, .order-filters .btn-back:focus {
          background: #eee;
          color: #333;
        }
      `}</style>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center flex-wrap">
            <h1 className="mb-3">{t.orderManagement}</h1>
            <div className="order-filters">
              <button onClick={fetchOrders} className="btn btn-refresh" title="Refresh">
                <i className="fas fa-sync-alt me-1"></i> {t.refresh || (language === 'ar' ? 'تحديث' : 'Refresh')}
              </button>
              <button onClick={() => setFilter('all')} className={`btn btn-pending${filter === 'all' ? ' active' : ''}`}>{t.pending} {t.orderManagement}</button>
              <button onClick={() => setFilter('cancelled')} className={`btn btn-cancelled${filter === 'cancelled' ? ' active' : ''}`}>{t.cancelled} {t.orderManagement}</button>
              <button onClick={() => setFilter('delivered')} className={`btn btn-delivered${filter === 'delivered' ? ' active' : ''}`}>{t.delivered} {t.orderManagement}</button>
              <button onClick={() => navigate('/admin')} className="btn btn-back">
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
              <h5 className="card-title">{t.orderManagement}</h5>
              {filteredOrders.length === 0 ? (
                <p className="text-muted">{t.noOrders}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t.orderNumber}</th>
                        <th>{t.customer}</th>
                        <th>{t.total}</th>
                        <th>{t.status}</th>
                        <th>{t.date}</th>
                        <th>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td>#{order.id}</td>
                          <td>{order.customer_name || 'N/A'}</td>
                          <td>${order.total}</td>
                          <td>
                            <span className={getStatusBadgeClass(order.order_status)}>
                              {t[order.order_status] || order.order_status}
                            </span>
                          </td>
                          <td>{new Date(order.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                                title={t.viewDetails}
                                onClick={() => handleViewDetails(order)}
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-warning me-2 rounded-pill"
                                title={t.updateStatus}
                                onClick={() => handleEditOrder(order)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
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
    </div>
  );
};

export default AdminOrders; 