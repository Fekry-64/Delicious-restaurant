import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LanguageContext from '../contexts/LanguageContext';

const Payment = () => {
  const { language } = useContext(LanguageContext);
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    address: '',
    phone: '',
    email: ''
  });

  const { orderItems, total } = location.state || { orderItems: [], total: 0 };

  const translations = {
    en: {
      payment: 'Payment',
      paymentDescription: 'Complete your order by selecting a payment method',
      orderSummary: 'Order Summary',
      total: 'Total',
      paymentMethod: 'Payment Method',
      creditCard: 'Credit/Debit Card',
      cashOnDelivery: 'Cash on Delivery',
      cardNumber: 'Card Number',
      cardHolder: 'Card Holder Name',
      expiryDate: 'Expiry Date',
      cvv: 'CVV',
      deliveryAddress: 'Delivery Address',
      phone: 'Phone Number',
      email: 'Email Address',
      payNow: 'Pay Now',
      placeOrder: 'Place Order',
      backToMenu: 'Back to Menu',
      noItems: 'No items in your order',
      orderSuccess: 'Order placed successfully!',
      orderError: 'Error placing order. Please try again.'
    },
    ar: {
      payment: 'الدفع',
      paymentDescription: 'أكمل طلبك باختيار طريقة الدفع',
      orderSummary: 'ملخص الطلب',
      total: 'المجموع',
      paymentMethod: 'طريقة الدفع',
      creditCard: 'بطاقة ائتمان/خصم',
      cashOnDelivery: 'الدفع عند الاستلام',
      cardNumber: 'رقم البطاقة',
      cardHolder: 'اسم حامل البطاقة',
      expiryDate: 'تاريخ الانتهاء',
      cvv: 'رمز الأمان',
      deliveryAddress: 'عنوان التوصيل',
      phone: 'رقم الهاتف',
      email: 'البريد الإلكتروني',
      payNow: 'ادفع الآن',
      placeOrder: 'أضف الطلب',
      backToMenu: 'العودة للقائمة',
      noItems: 'لا توجد عناصر في طلبك',
      orderSuccess: 'تم تقديم الطلب بنجاح!',
      orderError: 'خطأ في تقديم الطلب. يرجى المحاولة مرة أخرى.'
    }
  };

  const t = translations[language];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    
    try {
      // Prepare order data
      const orderData = {
        customer_name: formData.cardHolder || 'Customer',
        customer_email: formData.email,
        customer_phone: formData.phone,
        delivery_address: formData.address,
        payment_method: selectedPaymentMethod,
        special_instructions: '',
        items: orderItems.map(item => ({
          id: item.id,
          quantity: item.quantity
        }))
      };

      // Send order to backend
      const response = await fetch('http://localhost:8000/api/v1/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.success) {
        alert(`${t.orderSuccess}\nOrder Number: ${result.data.order_number}`);
        navigate('/menu');
      } else {
        alert(t.orderError);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t.orderError);
    }
  };

  if (!orderItems || orderItems.length === 0) {
    return (
      <div className="container py-5 mt-5">
        <div className="text-center">
          <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
          <h3>{t.noItems}</h3>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => navigate('/menu')}
          >
            {t.backToMenu}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          .payment-header {
            background: linear-gradient(135deg, #cc6600 0%, #ffa500 100%);
            color: white;
            padding: 3rem 0;
            margin-top: 80px;
            margin-bottom: 3rem;
          }

          .payment-card {
            background: white;
            border-radius: 20px;
            padding: 2rem;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
          }

          .payment-method-option {
            border: 2px solid #e9ecef;
            border-radius: 15px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .payment-method-option:hover {
            border-color: #cc6600;
            transform: translateY(-2px);
          }

          .payment-method-option.selected {
            border-color: #cc6600;
            background: #fff8f0;
          }

          .payment-method-option input[type="radio"] {
            margin-right: 1rem;
          }

          .form-control {
            border-radius: 10px;
            border: 2px solid #e9ecef;
            padding: 0.75rem 1rem;
            transition: all 0.3s ease;
          }

          .form-control:focus {
            border-color: #cc6600;
            box-shadow: 0 0 0 0.2rem rgba(204, 102, 0, 0.25);
          }

          .pay-button {
            background: linear-gradient(135deg, #cc6600, #ffa500);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 25px;
            font-weight: 600;
            font-size: 1.1rem;
            transition: all 0.3s ease;
            width: 100%;
          }

          .pay-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(204, 102, 0, 0.3);
            color: white;
          }

          .order-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 0;
            border-bottom: 1px solid #eee;
          }

          .order-item:last-child {
            border-bottom: none;
          }

          .order-item-name {
            font-weight: 600;
          }

          .order-item-price {
            color: #cc6600;
            font-weight: 600;
          }

          .total-section {
            border-top: 2px solid #cc6600;
            padding-top: 1rem;
            margin-top: 1rem;
          }
        `}
      </style>

      <div>
        {/* Header */}
        <div className="payment-header">
          <div className="container">
            <div className="text-center">
              <h1 className="display-4 fw-bold mb-3">{t.payment}</h1>
              <p className="lead mb-0 opacity-90">{t.paymentDescription}</p>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            {/* Payment Form */}
            <div className="col-lg-8">
              <div className="payment-card">
                <h3 className="mb-4">{t.paymentMethod}</h3>
                
                <form onSubmit={handlePayment}>
                  {/* Payment Method Selection */}
                  <div className="mb-4">
                    <div 
                      className={`payment-method-option ${selectedPaymentMethod === 'card' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('card')}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={selectedPaymentMethod === 'card'}
                        onChange={() => setSelectedPaymentMethod('card')}
                      />
                      <i className="fas fa-credit-card me-2"></i>
                      {t.creditCard}
                    </div>
                    
                    <div 
                      className={`payment-method-option ${selectedPaymentMethod === 'cod' ? 'selected' : ''}`}
                      onClick={() => setSelectedPaymentMethod('cod')}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={selectedPaymentMethod === 'cod'}
                        onChange={() => setSelectedPaymentMethod('cod')}
                      />
                      <i className="fas fa-money-bill-wave me-2"></i>
                      {t.cashOnDelivery}
                    </div>
                  </div>

                  {/* Credit Card Form */}
                  {selectedPaymentMethod === 'card' && (
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.cardNumber}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          placeholder="1234 5678 9012 3456"
                          required
                        />
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label">{t.cardHolder}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardHolder"
                          value={formData.cardHolder}
                          onChange={handleInputChange}
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">{t.expiryDate}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          required
                        />
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label">{t.cvv}</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Delivery Information */}
                  <div className="row">
                    <div className="col-12 mb-3">
                      <label className="form-label">{t.deliveryAddress}</label>
                      <textarea
                        className="form-control"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        rows="3"
                        placeholder="Enter your delivery address"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t.phone}</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="+1 (555) 123-4567"
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">{t.email}</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <button type="submit" className="pay-button">
                    <i className="fas fa-lock me-2"></i>
                    {selectedPaymentMethod === 'cod' ? t.placeOrder : t.payNow}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="col-lg-4">
              <div className="payment-card">
                <h4 className="mb-3">{t.orderSummary}</h4>
                
                {orderItems.map(item => (
                  <div key={item.id} className="order-item">
                    <div>
                      <div className="order-item-name">
                        {language === 'en' ? item.name_en : item.name_ar}
                      </div>
                      <small className="text-muted">Qty: {item.quantity}</small>
                    </div>
                    <div className="order-item-price">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <div className="total-section">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">{t.total}:</h5>
                    <h5 className="mb-0 text-success">${total.toFixed(2)}</h5>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Payment;
 