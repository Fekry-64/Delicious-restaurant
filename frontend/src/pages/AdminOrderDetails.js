import React, { useEffect, useState, useContext } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const statusOptions = [
  'pending',
  'confirmed',
  'preparing',
  'ready',
  'delivered',
  'cancelled'
];

const AdminOrderDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { language } = useContext(LanguageContext);
  const t = {
    en: {
      pending: 'Pending',
      confirmed: 'Confirmed',
      preparing: 'Preparing',
      ready: 'Ready',
      delivered: 'Delivered',
      cancelled: 'Cancelled',
      back: 'Back',
      orderDetails: 'Order',
      details: 'Details',
      customer: 'Customer',
      email: 'Email',
      phone: 'Phone',
      address: 'Address',
      status: 'Status',
      total: 'Total',
      created: 'Created',
      items: 'Items',
      saveStatus: 'Save Status',
      saving: 'Saving...',
      loading: 'Loading...',
      notFound: 'Order not found.',
      updated: 'Order status updated!',
      failed: 'Failed to update order status.',
      each: 'each',
    },
    ar: {
      pending: 'في الانتظار',
      confirmed: 'مؤكد',
      preparing: 'قيد التحضير',
      ready: 'جاهز',
      delivered: 'تم التوصيل',
      cancelled: 'ملغي',
      back: 'رجوع',
      orderDetails: 'طلب',
      details: 'تفاصيل',
      customer: 'العميل',
      email: 'البريد الإلكتروني',
      phone: 'الهاتف',
      address: 'العنوان',
      status: 'الحالة',
      total: 'الإجمالي',
      created: 'تاريخ الإنشاء',
      items: 'العناصر',
      saveStatus: 'حفظ الحالة',
      saving: 'جارٍ الحفظ...',
      loading: 'جارٍ التحميل...',
      notFound: 'الطلب غير موجود.',
      updated: 'تم تحديث حالة الطلب!',
      failed: 'فشل في تحديث حالة الطلب.',
      each: 'لكل واحد',
    }
  }[language];
  const mode = location.state?.mode || 'view';
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8000/api/v1/orders/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setOrder(data.data);
          setStatus(data.data.order_status);
        }
        setLoading(false);
      });
  }, [id]);

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleSave = async () => {
    setSaving(true);
    const response = await fetch(`http://localhost:8000/api/v1/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order_status: status })
    });
    const result = await response.json();
    setSaving(false);
    if (result.success) {
      alert(t.updated);
      navigate(-1);
    } else {
      alert(t.failed);
    }
  };

  if (loading) return <div className="text-center mt-5">{t.loading}</div>;
  if (!order) return <div className="text-center mt-5">{t.notFound}</div>;

  return (
    <div className="admin-main-container container">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>&larr; {t.back}</button>
      <h2>{t.orderDetails} #{order.id} {t.details}</h2>
      <div className="card p-4 mb-4">
        <div><strong>{t.customer}:</strong> {order.customer_name}</div>
        <div><strong>{t.email}:</strong> {order.customer_email}</div>
        <div><strong>{t.phone}:</strong> {order.customer_phone}</div>
        <div><strong>{t.address}:</strong> {order.delivery_address}</div>
        <div><strong>{t.status}:</strong> {mode === 'edit' ? (
          <select value={status} onChange={handleStatusChange} className="form-select w-auto d-inline-block ms-2">
            {statusOptions.map(opt => <option key={opt} value={opt}>{t[opt]}</option>)}
          </select>
        ) : (
          <span className="ms-2">{t[order.order_status] || order.order_status}</span>
        )}</div>
        <div><strong>{t.total}:</strong> ${order.total}</div>
        <div><strong>{t.created}:</strong> {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
        <div className="mt-3">
          <strong>{t.items}:</strong>
          <ul>
            {order.order_items?.map(item => (
              <li key={item.id}>{item.item_name_en} x {item.quantity} (${item.unit_price} {t.each})</li>
            ))}
          </ul>
        </div>
        {mode === 'edit' && (
          <button className="btn btn-primary mt-3" onClick={handleSave} disabled={saving}>
            {saving ? t.saving : t.saveStatus}
          </button>
        )}
      </div>
    </div>
  );
};

export default AdminOrderDetails; 