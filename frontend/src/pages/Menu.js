import React, { useState, useEffect, useContext } from 'react';
import LanguageContext from '../contexts/LanguageContext';
import { Link } from 'react-router-dom';

const Menu = () => {
  const { language } = useContext(LanguageContext);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [orderedItems, setOrderedItems] = useState([]);

  const translations = {
    en: {
      ourMenu: 'Our Menu',
      menuDescription: 'Discover our carefully crafted dishes made with the finest ingredients',
      all: 'All',
      appetizers: 'Appetizers',
      main: 'Main Courses',
      desserts: 'Desserts',
      beverages: 'Beverages',
      price: 'Price',
      description: 'Description',
      noItems: 'No items found in this category',
      orderNow: 'Order Now',
      yourOrder: 'Your Order',
      total: 'Total',
      remove: 'Remove',
      clearOrder: 'Clear Order',
      noOrders: 'No items in your order',
      quantity: 'Qty',
      payNow: 'Confirm Order'
    },
    ar: {
      ourMenu: 'قائمتنا',
      menuDescription: 'اكتشف أطباقنا المصممة بعناية والمصنوعة من أفضل المكونات',
      all: 'الكل',
      appetizers: 'مقبلات',
      main: 'الأطباق الرئيسية',
      desserts: 'حلويات',
      beverages: 'مشروبات',
      price: 'السعر',
      description: 'الوصف',
      noItems: 'لا توجد عناصر في هذه الفئة',
      orderNow: 'اطلب الآن',
      yourOrder: 'طلبك',
      total: 'المجموع',
      remove: 'إزالة',
      clearOrder: 'مسح الطلب',
      noOrders: 'لا توجد عناصر في طلبك',
      quantity: 'الكمية',
      payNow: 'تأكيد الطلب'
    }
  };

  const t = translations[language];

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      // Use the combined endpoint for better performance
      const response = await fetch('http://localhost:8000/api/v1/menu/all');
      const data = await response.json();
      
      if (data.success) {
        setMenuItems(data.data.items);
        setCategories(data.data.categories);
      }
    } catch (error) {
      console.error('Error fetching menu data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const getCategoryName = (category) => {
    const categoryNames = {
      appetizers: t.appetizers,
      main: t.main,
      desserts: t.desserts,
      beverages: t.beverages
    };
    return categoryNames[category] || category;
  };

  const getCategoryColor = (category) => {
    const colors = {
      appetizers: '#ffa500',
      main: '#cc6600',
      desserts: '#ffa500',
      beverages: '#cc6600'
    };
    return colors[category] || '#ffa500';
  };

  const addToOrder = (item) => {
    setOrderedItems(prev => {
      const existingItem = prev.find(orderItem => orderItem.id === item.id);
      if (existingItem) {
        return prev.map(orderItem => 
          orderItem.id === item.id 
            ? { ...orderItem, quantity: orderItem.quantity + 1 }
            : orderItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromOrder = (itemId) => {
    setOrderedItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromOrder(itemId);
      return;
    }
    setOrderedItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
  };

  const clearOrder = () => {
    setOrderedItems([]);
  };

  const getTotalPrice = () => {
    return orderedItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
  };

  if (loading) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center">
          <div className="spinner-border text-warning" role="status" style={{width: '3rem', height: '3rem'}}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading delicious menu items...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .menu-header {
            background: linear-gradient(135deg, #ffa500 0%, #cc6600 100%);
            color: white;
            padding: 4rem 0;
            margin-top: 80px;
            margin-bottom: 3rem;
          }

          .category-filter {
            background: white;
            border-radius: 15px;
            padding: 1.5rem;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            margin-bottom: 3rem;
          }

          .category-btn {
            border: 2px solid #ffa500;
            color: #ffa500;
            background: white;
            border-radius: 25px;
            padding: 0.75rem 1.5rem;
            font-weight: 600;
            transition: all 0.3s ease;
            margin: 0.25rem;
          }

          .category-btn:hover,
          .category-btn.active {
            background: #ffa500;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
          }

          .menu-card {
            background: white;
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
            border: none;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .menu-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.15);
          }

          .menu-card-image {
            height: 200px;
            background: linear-gradient(45deg, #ffa500, #cc6600);
            position: relative;
            overflow: hidden;
            flex-shrink: 0;
          }

          .menu-card-image img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .menu-card:hover .menu-card-image img {
            transform: scale(1.1);
          }

          .menu-card-body {
            padding: 1.5rem;
            display: flex;
            flex-direction: column;
            flex: 1;
            min-height: 200px;
          }

          .menu-card-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 1rem;
          }

          .menu-card-title {
            font-size: 1.25rem;
            font-weight: 700;
            color: #333;
            margin: 0;
            line-height: 1.3;
          }

          .menu-card-price {
            background: linear-gradient(135deg, #ffa500, #cc6600);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            font-weight: 700;
            font-size: 1.1rem;
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
          }

          .menu-card-description {
            color: #666;
            font-size: 0.95rem;
            line-height: 1.6;
            margin-bottom: 1rem;
          }

          .menu-card-category {
            background: #f8f9fa;
            color: #ffa500;
            padding: 0.4rem 0.8rem;
            border-radius: 15px;
            font-size: 0.85rem;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border: 2px solid #ffa500;
            display: inline-block;
            margin-bottom: 1rem;
            align-self: flex-start;
          }

          .order-btn {
            background: linear-gradient(135deg, #ffa500, #cc6600);
            color: white;
            border: 2px solid #cc6600;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: auto;
            display: block;
            position: relative;
            z-index: 10;
            font-size: 1rem;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .order-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(255, 165, 0, 0.3);
            color: white;
          }

          .order-section {
            background: white;
            border-radius: 20px;
            padding: 1.5rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            position: sticky;
            top: 100px;
            height: fit-content;
            position: relative;
            padding-bottom: 4rem;
          }

          @media (max-width: 768px) {
            .order-section {
              position: relative;
              top: auto;
              margin-top: 2rem;
              margin-bottom: 2rem;
            }

            .clear-order-btn {
              position: relative;
              bottom: auto;
              left: auto;
              transform: none;
              margin: 1rem auto 0 auto;
              display: block;
            }

            .clear-order-btn:hover {
              transform: translateY(-2px);
            }
          }

          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1rem 0;
            border-bottom: 1px solid #eee;
          }

          .order-item:last-child {
            border-bottom: none;
          }

          .order-item-info {
            flex: 1;
          }

          .order-item-name {
            font-weight: 600;
            color: #333;
            margin-bottom: 0.25rem;
          }

          .order-item-price {
            color: #cc6600;
            font-weight: 600;
          }

          .quantity-controls {
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .quantity-btn {
            background: #ffa500;
            color: white;
            border: none;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            transition: all 0.3s ease;
          }

          .quantity-btn:hover {
            background: #cc6600;
            transform: scale(1.1);
          }

          .quantity-display {
            min-width: 30px;
            text-align: center;
            font-weight: 600;
          }

          .total-section {
            margin-top: 1.5rem;
            padding-top: 1.5rem;
            border-top: 2px solid #ffa500;
          }

          .clear-order-btn {
            background: linear-gradient(135deg, #cc6600, #ffa500);
            color: white;
            border: none;
            width: 130px;
            height: 48px;
            font-size: 1.5rem;
            position: absolute;
            bottom: 0.5rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 4px 15px rgba(204, 102, 0, 0.3);
            border-radius: 25px;
            transition: all 0.3s ease;
          }

          .clear-order-btn:hover {
            transform: translateX(-50%) translateY(-2px);
            box-shadow: 0 8px 25px rgba(204, 102, 0, 0.4);
            color: white;
          }

          .pay-now-btn {
            background: linear-gradient(135deg, #cc6600, #ffa500);
            color: white;
            border: none;
            padding: 0.75rem 1.5rem;
            border-radius: 25px;
            font-weight: 600;
            transition: all 0.3s ease;
            width: 100%;
            margin-top: 1rem;
            text-decoration: none;
            display: inline-block;
            text-align: center;
          }

          .pay-now-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(204, 102, 0, 0.4);
            color: white;
            text-decoration: none;
          }

          .no-items {
            text-align: center;
            padding: 3rem;
            color: #666;
            font-size: 1.1rem;
          }

          .no-items i {
            font-size: 3rem;
            color: #ffa500;
            margin-bottom: 1rem;
          }

          .no-orders {
            text-align: center;
            padding: 2rem;
            color: #666;
          }

          .no-orders i {
            font-size: 2rem;
            color: #ffa500;
            margin-bottom: 1rem;
          }
        `}
      </style>

      <div>
        {/* Elegant Header */}
        <div className="menu-header">
          <div className="container">
            <div className="text-center">
              <h1 className="display-3 fw-bold mb-3">{t.ourMenu}</h1>
              <p className="lead mb-0 opacity-90">{t.menuDescription}</p>
            </div>
          </div>
      </div>

        <div className="container">
      {/* Category Filter */}
          <div className="category-filter">
            <div className="d-flex justify-content-center flex-wrap">
            <button
                className={`category-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              {t.all}
            </button>
            {categories.map(category => (
              <button
                key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {getCategoryName(category)}
              </button>
            ))}
        </div>
      </div>

          <div className="row">
            {/* Menu Items Grid */}
            <div className="col-lg-8">
      <div className="row g-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
                    <div key={item.id} className="col-lg-6 col-md-6">
                      <div className="menu-card">
                        <div className="menu-card-image">
                          {item.image ? (
                  <img
                    src={`http://localhost:8000/storage/${item.image}`}
                              alt={language === 'en' ? item.name_en : item.name_ar}
                            />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center h-100">
                              <i className="fas fa-utensils fa-3x text-white opacity-50"></i>
                            </div>
                          )}
                        </div>
                        <div className="menu-card-body">
                          <div className="menu-card-header">
                            <h5 className="menu-card-title">
                              {language === 'en' ? item.name_en : item.name_ar}
                            </h5>
                            <div className="menu-card-price">
                      ${parseFloat(item.price).toFixed(2)}
                            </div>
                  </div>
                          
                          {(item.description_en || item.description_ar) && (
                            <p className="menu-card-description">
                              {language === 'en' ? item.description_en : item.description_ar}
                            </p>
                          )}
                          
                          <div className="menu-card-category" style={{ borderColor: getCategoryColor(item.category), color: getCategoryColor(item.category) }}>
                      {getCategoryName(item.category)}
                  </div>

                          <button 
                            className="order-btn"
                            onClick={() => addToOrder(item)}
                          >
                            {t.orderNow}
                          </button>
                </div>
              </div>
            </div>
          ))
        ) : (
                  <div className="col-12">
                    <div className="no-items">
                      <i className="fas fa-utensils"></i>
                      <p>{t.noItems}</p>
                    </div>
          </div>
        )}
      </div>
            </div>

            {/* Order Section */}
            <div className="col-lg-4">
              <div className="order-section">
                <h4 className="mb-3">{t.yourOrder}</h4>
                
                {orderedItems.length > 0 ? (
                  <>
                    {orderedItems.map(item => (
                      <div key={item.id} className="order-item">
                        <div className="order-item-info">
                          <div className="order-item-name">
                            {language === 'en' ? item.name_en : item.name_ar}
                          </div>
                          <div className="order-item-price">
                            ${parseFloat(item.price).toFixed(2)}
                          </div>
                        </div>
                        <div className="quantity-controls">
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </button>
                          <span className="quantity-display">{item.quantity}</span>
                          <button 
                            className="quantity-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="total-section">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h5 className="mb-0">{t.total}:</h5>
                        <h5 className="mb-0" style={{ color: '#cc6600' }}>${getTotalPrice().toFixed(2)}</h5>
                      </div>
                      <Link 
                        to="/payment" 
                        state={{ orderItems: orderedItems, total: getTotalPrice() }}
                        className="pay-now-btn"
                      >
                            {t.payNow}
                      </Link>
                    </div>
                    <button className="clear-order-btn" onClick={clearOrder} title={t.clearOrder}>
                      <i className="fas fa-trash"></i>
                    </button>
                  </>
                ) : (
                  <div className="no-orders">
                    <i className="fas fa-shopping-cart"></i>
                    <p>{t.noOrders}</p>
                  </div>
                )}
                  </div>
                </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Menu; 
