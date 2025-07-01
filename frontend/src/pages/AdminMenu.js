import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const AdminMenu = () => {
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const imageInputRef = useRef(null);

  const translations = {
    en: {
      menuManagement: 'Menu Management',
      backToDashboard: 'Back to Dashboard',
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
      actions: 'Actions',
      appetizers: 'Appetizers',
      main: 'Main Courses',
      desserts: 'Desserts',
      beverages: 'Beverages'
    },
    ar: {
      menuManagement: 'إدارة القائمة',
      backToDashboard: 'العودة إلى لوحة الإدارة',
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
      actions: 'الإجراءات',
      appetizers: 'مقبلات',
      main: 'الأطباق الرئيسية',
      desserts: 'حلويات',
      beverages: 'مشروبات'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchMenuData();
  }, []);

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
          image: null,
          is_available: true
        });
        setEditingItem(null);
        setImageFile(null);
        if (imageInputRef.current) imageInputRef.current.value = null;
        fetchMenuData();
      } else {
        alert(t.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert(t.error);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      name_en: item.name_en || '',
      name_ar: item.name_ar || '',
      description_en: item.description_en || '',
      description_ar: item.description_ar || '',
      price: item.price || '',
      category: item.category || 'main',
      image: null,
      is_available: item.is_available
    });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
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
        console.error('Error:', error);
        alert(t.error);
      }
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
      image: null,
      is_available: true
    });
    setImageFile(null);
    if (imageInputRef.current) imageInputRef.current.value = null;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

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
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center">
            <h1>{t.menuManagement}</h1>
            <button onClick={() => navigate('/admin')} className="btn btn-outline-secondary">
              <i className="fas fa-arrow-left me-2"></i>
              {t.backToDashboard}
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">
                {editingItem ? t.editItem : t.addItem}
              </h5>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name_en" className="form-label">{t.nameEn}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name_en"
                    value={formData.name_en}
                    onChange={(e) => setFormData({...formData, name_en: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="name_ar" className="form-label">{t.nameAr}</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name_ar"
                    value={formData.name_ar}
                    onChange={(e) => setFormData({...formData, name_ar: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="description_en" className="form-label">{t.descriptionEn}</label>
                  <textarea
                    className="form-control"
                    id="description_en"
                    rows="3"
                    value={formData.description_en}
                    onChange={(e) => setFormData({...formData, description_en: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="description_ar" className="form-label">{t.descriptionAr}</label>
                  <textarea
                    className="form-control"
                    id="description_ar"
                    rows="3"
                    value={formData.description_ar}
                    onChange={(e) => setFormData({...formData, description_ar: e.target.value})}
                    required
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="price" className="form-label">{t.price}</label>
                  <input
                    type="number"
                    step="0.01"
                    className="form-control"
                    id="price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="category" className="form-label">{t.category}</label>
                  <select
                    className="form-select"
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    required
                  >
                    <option value="appetizers">{t.appetizers}</option>
                    <option value="main">{t.main}</option>
                    <option value="desserts">{t.desserts}</option>
                    <option value="beverages">{t.beverages}</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="image" className="form-label">{t.image}</label>
                  {editingItem && editingItem.image && (
                    <div className="mb-2">
                      <img src={editingItem.image} alt="Current" className="edit-image-preview" loading="lazy" />
                      <small className="text-muted">Current image</small>
                    </div>
                  )}
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingItem || !editingItem.image}
                    ref={imageInputRef}
                  />
                </div>
                <div className="mb-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="is_available"
                      checked={formData.is_available}
                      onChange={(e) => setFormData({...formData, is_available: e.target.checked})}
                    />
                    <label className="form-check-label" htmlFor="is_available">
                      {formData.is_available ? t.available : t.notAvailable}
                    </label>
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
            <div className="card-body">
              <h5 className="card-title">{t.menuManagement}</h5>
              {menuItems.length === 0 ? (
                <p className="text-muted">{t.noItems}</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>{t.nameEn}</th>
                        <th>{t.nameAr}</th>
                        <th>{t.price}</th>
                        <th>{t.category}</th>
                        <th>{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {menuItems.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name_en}</td>
                          <td>{item.name_ar}</td>
                          <td>${item.price}</td>
                          <td>{t[item.category]}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-2 rounded-pill"
                                onClick={() => handleEdit(item)}
                              >
                                <i className="fas fa-edit"></i>
                              </button>
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger me-2 rounded-pill"
                                onClick={() => handleDelete(item.id)}
                              >
                                <i className="fas fa-trash"></i>
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

export default AdminMenu; 