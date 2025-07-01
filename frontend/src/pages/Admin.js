import React, { useState, useEffect, useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import AdminOrderDetails from './AdminOrderDetails';
import { Routes, Route } from 'react-router-dom';

const Admin = () => {
  const { language } = useContext(LanguageContext);
  const [activeTab, setActiveTab] = useState('menu');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: ''
  });
  const [formData, setFormData] = useState({
    name_en: '',
    name_ar: '',
    description_en: '',
    description_ar: '',
    price: '',
    category: 'main',
    image: null,
    is_available: true
  });
  const [editingItem, setEditingItem] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const translations = {
    en: {
      adminPanel: 'Admin Panel',
      menuManagement: 'Menu Management',
      orderManagement: 'Order Management',
      addItem: 'Add Item',
      editItem: 'Edit Item',
      deleteItem: 'Delete Item',
      nameEn: 'Name (English)',
      nameAr: 'Name (Arabic)',
      descriptionEn: 'Description (English)',
      descriptionAr: 'Description (Arabic)',
      price: 'Price',
      category: 'Category',
      image: 'Image',
      available: 'Available',
      notAvailable: 'Not Available',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      noItems: 'No menu items found',
      itemAdded: 'Item added successfully!',
      itemUpdated: 'Item updated successfully!',
      itemDeleted: 'Item deleted successfully!',
      error: 'An error occurred',
      invalidCredentials: 'Invalid credentials',
      actions: 'Actions',
      appetizers: 'Appetizers',
      main: 'Main Courses',
      desserts: 'Desserts',
      beverages: 'Beverages',
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
      failed: 'Failed'
    },
    ar: {
      adminPanel: 'لوحة الإدارة',
      menuManagement: 'إدارة القائمة',
      orderManagement: 'إدارة الطلبات',
      addItem: 'إضافة عنصر',
      editItem: 'تعديل العنصر',
      deleteItem: 'حذف العنصر',
      nameEn: 'الاسم (إنجليزي)',
      nameAr: 'الاسم (عربي)',
      descriptionEn: 'الوصف (إنجليزي)',
      descriptionAr: 'الوصف (عربي)',
      price: 'السعر',
      category: 'الفئة',
      image: 'الصورة',
      available: 'متاح',
      notAvailable: 'غير متاح',
      save: 'حفظ',
      cancel: 'إلغاء',
      delete: 'حذف',
      noItems: 'لا توجد عناصر في القائمة',
      itemAdded: 'تم إضافة العنصر بنجاح!',
      itemUpdated: 'تم تحديث العنصر بنجاح!',
      itemDeleted: 'تم حذف العنصر بنجاح!',
      error: 'حدث خطأ',
      invalidCredentials: 'بيانات اعتماد غير صحيحة',
      actions: 'الإجراءات',
      appetizers: 'مقبلات',
      main: 'الأطباق الرئيسية',
      desserts: 'حلويات',
      beverages: 'مشروبات',
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
      failed: 'فشل'
    }
  };

  const t = translations[language];

  // Simple admin credentials (in production, this should be handled by backend)
  const ADMIN_CREDENTIALS = {
    username: 'admin',
    password: 'admin123'
  };

  useEffect(() => {
    // Always start with login form - no persistent authentication
    setLoading(false);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    if (loginData.username === ADMIN_CREDENTIALS.username && 
        loginData.password === ADMIN_CREDENTIALS.password) {
      setIsAuthenticated(true);
      fetchMenuData();
      fetchOrders();
    } else {
      alert(t.invalidCredentials);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setLoginData({ username: '', password: '' });
  };

  const fetchMenuData = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/menu/admin/all');
      const data = await response.json();
      if (data.success) {
        setMenuItems(data.data);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/orders');
      const data = await response.json();
      if (data.success) {
        setOrders(data.data.data || data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      formDataToSend.append(key, formData[key]);
    });
    
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      const url = editingItem 
        ? `http://localhost:8000/api/v1/menu/${editingItem.id}`
        : 'http://localhost:8000/api/v1/menu';
      
      // Use POST for both create and update, with _method field for updates
      if (editingItem) {
        formDataToSend.append('_method', 'PUT');
      }
      
      const response = await fetch(url, {
        method: 'POST',
        body: formDataToSend
      });

      const result = await response.json();
      
      if (result.success) {
        alert(editingItem ? t.itemUpdated : t.itemAdded);
        setFormData({
          name_en: '',
          name_ar: '',
          description_en: '',
          description_ar: '',
          price: '',
          category: 'main',
          is_available: true
        });
        setEditingItem(null);
        setImageFile(null);
        fetchMenuData();
      } else {
        alert(t.error);
      }
    } catch (error) {
      console.error('Error saving item:', error);
      alert(t.error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name_en: item.name_en,
      name_ar: item.name_ar,
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      price: item.price,
      category: item.category,
      is_available: item.is_available
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm(t.delete + '?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/menu/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(t.itemDeleted);
        fetchMenuData();
      } else {
        alert(t.error);
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      alert(t.error);
    }
  };

  const handleCancel = () => {
    setEditingItem(null);
    setFormData({
      name_en: '',
      name_ar: '',
      description_en: '',
      description_ar: '',
      price: '',
      category: 'main',
      is_available: true
    });
    setImageFile(null);
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      pending: 'badge bg-warning',
      confirmed: 'badge bg-info',
      preparing: 'badge bg-primary',
      ready: 'badge bg-success',
      delivered: 'badge bg-secondary',
      cancelled: 'badge bg-danger'
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

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="container py-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-4">
            <div className="card shadow">
              <div className="card-header text-center">
                <h4>{t.adminPanel}</h4>
              </div>
              <div className="card-body">
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={loginData.username}
                      onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={loginData.password}
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary w-100">
                    Login
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
    <div className="container py-5 mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>{t.adminPanel}</h1>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Logout
        </button>
      </div>
      
      {/* Navigation Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('menu')}
          >
            {t.menuManagement}
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            {t.orderManagement}
          </button>
        </li>
      </ul>

      {/* Menu Management Tab */}
      {activeTab === 'menu' && (
        <div className="row">
          <div className="col-md-4">
            <div className="card">
              <div className="card-header">
                {editingItem ? t.editItem : t.addItem}
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">{t.nameEn}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name_en}
                      onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.nameAr}</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.name_ar}
                      onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.descriptionEn}</label>
                    <textarea
                      className="form-control"
                      value={formData.description_en}
                      onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.descriptionAr}</label>
                    <textarea
                      className="form-control"
                      value={formData.description_ar}
                      onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.price}</label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.category}</label>
                    <select
                      className="form-control"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    >
                      <option value="appetizers">{t.appetizers}</option>
                      <option value="main">{t.main}</option>
                      <option value="desserts">{t.desserts}</option>
                      <option value="beverages">{t.beverages}</option>
                    </select>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">{t.image}</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                  
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={formData.is_available}
                        onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                      />
                      <label className="form-check-label">{t.available}</label>
                    </div>
                  </div>
                  
                  <div className="d-flex gap-2">
                    <button type="submit" className="btn btn-primary">
                      {t.save}
                    </button>
                    {editingItem && (
                      <button type="button" className="btn btn-secondary" onClick={handleCancel}>
                        {t.cancel}
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </div>
          
          <div className="col-md-8">
            <div className="card">
              <div className="card-header">
                {t.menuManagement}
              </div>
              <div className="card-body">
                {menuItems.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{t.nameEn}</th>
                          <th>{t.category}</th>
                          <th>{t.price}</th>
                          <th>{t.status}</th>
                          <th>{t.actions}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {menuItems.map(item => (
                          <tr key={item.id}>
                            <td>{item.name_en}</td>
                            <td>{item.category}</td>
                            <td>${item.price}</td>
                            <td>
                              <span className={`badge ${item.is_available ? 'bg-success' : 'bg-danger'}`}>
                                {item.is_available ? t.available : t.notAvailable}
                              </span>
                            </td>
                            <td>
                              <button 
                                className="btn btn-sm btn-outline-primary me-2"
                                onClick={() => handleEdit(item)}
                              >
                                {t.editItem}
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDelete(item.id)}
                              >
                                {t.delete}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center text-muted">{t.noItems}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Orders Management Tab */}
      {activeTab === 'orders' && (
        <div className="card">
          <div className="card-header">
            {t.orderManagement}
          </div>
          <div className="card-body">
            {orders.length > 0 ? (
              <div className="table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>{t.orderNumber}</th>
                      <th>{t.customer}</th>
                      <th>{t.total}</th>
                      <th>{t.status}</th>
                      <th>{t.date}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.order_number}</td>
                        <td>
                          <div>
                            <strong>{order.customer_name}</strong><br/>
                            <small>{order.customer_email}</small><br/>
                            <small>{order.customer_phone}</small>
                          </div>
                        </td>
                        <td>${order.total}</td>
                        <td>
                          <div className="mb-1">
                            <span className={getStatusBadgeClass(order.order_status)}>
                              {t[order.order_status] || order.order_status}
                            </span>
                          </div>
                          <div>
                            <span className={getPaymentStatusBadgeClass(order.payment_status)}>
                              {t[order.payment_status] || order.payment_status}
                            </span>
                          </div>
                        </td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-muted">{t.noOrders}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin; 