# Restaurant Website - Online Menu & Reservation System

A fully responsive restaurant website built with React frontend and Laravel backend, featuring online menu display and table reservation system.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first approach with Bootstrap 5
- **Multi-language Support**: Arabic and English with toggle
- **Dynamic Menu**: Editable menu items with images and prices
- **Online Reservations**: Table booking system
- **Contact Information**: Phone, email, address with Google Maps
- **SEO Optimized**: Meta tags, sitemap, clean URLs
- **Google Analytics**: Integrated tracking

### Admin Panel
- **Secure Login**: Laravel authentication
- **Menu Management**: Add, edit, remove dishes with image upload
- **Reservation Management**: View and manage incoming bookings
- **Site Settings**: Update contact information

## 🛠️ Tech Stack

- **Frontend**: React JS
- **Styling**: Bootstrap 5
- **Backend**: Laravel 10
- **Database**: MySQL
- **Version Control**: Git

## 📁 Project Structure

```
restaurant-website/
├── frontend/                 # React application
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── utils/
│   │   └── assets/
│   └── package.json
├── backend/                  # Laravel application
│   ├── app/
│   ├── database/
│   ├── routes/
│   ├── resources/
│   └── composer.json
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- PHP 8.1 or higher
- Composer
- MySQL

### Frontend Setup
```bash
cd frontend
npm install
npm start
```

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

## 📋 Development Timeline

- **UI Design + Frontend Setup**: 2 days
- **Backend Development**: 2 days  
- **Admin Panel Integration**: 1-2 days
- **Testing + SEO + Deployment**: 1-2 days
- **Total**: ~6-7 days

## 🔐 Security Features

- CSRF protection
- Form validation (frontend & backend)
- Laravel authentication
- HTTPS enforcement
- Input sanitization

## 🌐 Deployment

The application is designed for shared hosting deployment with both frontend and backend on the same server.

## 📞 Support

For technical support or questions, contact: Mahmoud Fekry

---

**Freelancer**: Mahmoud Fekry 