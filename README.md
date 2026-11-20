# H.I LUBRICANT – Complete eCommerce Platform

> **"POWER YOUR JOURNEY."**  
> *Every Journey Deserves Better Oil.*

---

## 🏢 Business Overview

- **Business Name:** H.I Lubricant
- **Phone:** `+92 3113728228`
- **Email:** `malikimranali42@yahoo.com`
- **Store Location:** Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan
- **Business Category:** Automotive Lubricants, Engine Oils, Motor Oils, Transmission Fluids, and Automotive Chemicals
- **Supported Brands:** Caltex, PSO, Shell, Honda, Blaze, ZIC, Total
- **Currency:** PKR (Pakistani Rupees - Rs.)
- **Country:** Pakistan

---

## 🚀 Key Features

### 🛒 Customer-Facing Web Application
1. **Premium Hero & Brand Identity:** Luxury black and gold aesthetic (`#090909`, `#141414`, `#191919`, `#D7AD55`, `#F2D28A`, `#F5F2EA`).
2. **Product Catalog & Dynamic Search:** Live search with instant filtering by Brand (Shell, Caltex, PSO, Honda, Blaze, ZIC, Total), Category, Viscosity Grade (`0W-20`, `5W-30`, `10W-40`, `20W-50`, `15W-40`, `ATF`), In-Stock toggle, and sorting (Price low-high/high-low, Name A-Z, Featured).
3. **Comprehensive Product Details Page:** High-resolution product images, technical specifications (API Rating, Base Oil Technology, Recommended Applications, Volume), stock counters, and related lubricants.
4. **Persistent Shopping Cart:** Fully persistent cart across refreshes with stock limits, quantity steppers, item totals, and a free delivery progress bar.
5. **Secure Checkout & Server-Side Verification:** Form fields with Pakistani phone format validation, server-side stock and price verification, and unique order number generation (`HI-YYYY-XXXXXX`).
6. **WhatsApp Integration:** Post-order confirmation with instant WhatsApp link to `+92 3113728228` containing pre-filled order details (order number, customer name, items, quantities, total PKR, and delivery address).
7. **About & Contact Pages:** Complete store story, physical location near Gari Khata, interactive Google Maps directions embed, and working contact form connected to the database.

---

### 🛡️ Secure Admin Management Console
- **Admin URL:** `/admin/login` -> `/admin/dashboard`
- **Default Admin Credentials:**
  - **Email:** `admin@hilubricant.com`
  - **Password:** `Admin@12345`
- **JWT & bcrypt Authentication:** Secure session management with protected routes and auto-logout on token expiration.
- **Real-Time Dashboard Analytics (from MongoDB):**
  - Total Products, Low Stock SKUs, and Out of Stock counts
  - Total Orders, Pending Orders, Confirmed Orders, Completed Orders, and Cancelled Orders
  - Total Revenue (PKR) aggregated from confirmed & completed orders
  - Responsive daily sales revenue chart
  - Recent orders with instant status switcher
  - Low stock warning alerts
- **Product Management (CRUD):** Add, edit, and delete products, set viscosity, volume, brand, category, upload images, set featured status, and toggle visibility.
- **Order Management & Safe Inventory Return:** Search and filter orders. When an order is updated to `Cancelled`, the backend automatically restores inventory to MongoDB and prevents duplicate restoration via audit tracking.
- **Inventory & Warehouse Management:** Stock level monitoring, manual stock adjustments (restock or damage/correction), and complete inventory transaction audit trail logging.
- **Customer Directory:** Aggregated customer metrics (total orders, lifetime PKR spend, and order history).
- **Store Settings:** Live management of store details, phone, WhatsApp number, email, address, delivery fees, and top announcement banner.
- **Contact Inquiries:** View customer inquiries submitted through the contact form.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite 6, React Router DOM v6, Axios, Lucide React Icons |
| **Styling** | Tailwind CSS 3 with Custom Luxury Dark & Gold Color System |
| **Backend** | Node.js, Express.js, REST API architecture |
| **Security** | JWT (jsonwebtoken), bcryptjs, Helmet, Morgan, Express Rate Limit, CORS |
| **Database** | MongoDB, Mongoose ODM (with automatic embedded fallback for plug-and-play local development) |
| **File Storage** | Multer for local uploads (ready for Cloudinary / S3 integration) |

---

## 📂 Project Structure

```
hi-lubricant/
│
├── client/                     # Frontend Application
│   ├── public/                 # Static assets & favicons
│   ├── src/
│   │   ├── admin/              # Admin dashboard pages & layout
│   │   │   ├── AdminLayout.jsx
│   │   │   ├── AdminProtectedRoute.jsx
│   │   │   ├── AdminLogin.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminProducts.jsx
│   │   │   ├── AdminOrders.jsx
│   │   │   ├── AdminInventory.jsx
│   │   │   ├── AdminCustomers.jsx
│   │   │   ├── AdminSettings.jsx
│   │   │   └── AdminMessages.jsx
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Navbar, Footer, Toast
│   │   │   └── shop/           # ProductCard
│   │   ├── context/            # Global state (Auth, Cart, Settings)
│   │   │   ├── AuthContext.jsx
│   │   │   ├── CartContext.jsx
│   │   │   └── SettingsContext.jsx
│   │   ├── layouts/            # CustomerLayout
│   │   ├── pages/              # Customer-facing views
│   │   │   ├── Home.jsx
│   │   │   ├── Shop.jsx
│   │   │   ├── ProductDetails.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderSuccess.jsx
│   │   │   ├── About.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── NotFound.jsx
│   │   ├── services/           # Axios API services
│   │   │   ├── api.js
│   │   │   ├── productService.js
│   │   │   ├── orderService.js
│   │   │   └── adminService.js
│   │   ├── App.jsx             # Main router
│   │   ├── main.jsx            # React root
│   │   └── index.css           # Global luxury styles & Tailwind
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── server/                     # Backend Application
│   ├── src/
│   │   ├── config/             # DB connection (MongoDB + fallback)
│   │   ├── controllers/        # Express route controllers
│   │   │   ├── authController.js
│   │   │   ├── productController.js
│   │   │   ├── orderController.js
│   │   │   ├── categoryController.js
│   │   │   ├── brandController.js
│   │   │   ├── inventoryController.js
│   │   │   ├── customerController.js
│   │   │   ├── dashboardController.js
│   │   │   ├── settingsController.js
│   │   │   └── contactController.js
│   │   ├── middleware/         # Auth, Upload, Error handling
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Product.js
│   │   │   ├── Order.js
│   │   │   ├── Category.js
│   │   │   ├── Brand.js
│   │   │   ├── InventoryTransaction.js
│   │   │   ├── Customer.js
│   │   │   ├── StoreSettings.js
│   │   │   └── ContactMessage.js
│   │   ├── routes/             # REST API routes
│   │   ├── utils/              # Database seeder
│   │   └── index.js            # Express app entry
│   ├── uploads/                # Product image uploads
│   ├── .env                    # Environment configuration
│   ├── .env.example
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## ⚡ Quick Start & Setup

### 1. Prerequisites
- Node.js (v18 or higher recommended)
- npm or yarn
- MongoDB (Local MongoDB Server or MongoDB Atlas cloud connection URI)
  > *Note: If a local MongoDB instance is not detected, the application automatically launches a built-in MongoServer instance, allowing immediate testing without manual setup.*

### 2. Backend Setup
```bash
cd server
npm install
npm run seed     # Seeds authentic products, brands, categories, and admin
npm run dev      # Starts Express server on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

### 4. Running the Entire Application
Open two terminal windows:
- **Terminal 1:** `cd server && npm run dev`
- **Terminal 2:** `cd client && npm run dev`

Visit:
- **Customer Storefront:** `http://localhost:5173/`
- **Admin Dashboard:** `http://localhost:5173/admin/login`

---

## 🔑 Environment Variables

### Backend (`server/.env`):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/hilubricant
JWT_SECRET=hilubricant_super_secure_jwt_secret_key_2026_prod
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
ADMIN_DEFAULT_EMAIL=admin@hilubricant.com
ADMIN_DEFAULT_PASSWORD=Admin@12345
UPLOAD_DIR=uploads
```

---

## 🚢 Production Deployment Guide

### Deploying the Backend (Render / Railway / DigitalOcean):
1. Push your repository to GitHub.
2. In your cloud provider (e.g. Render/Railway), create a new **Web Service** pointing to the `server/` directory.
3. Set the Environment Variables (`MONGODB_URI`, `JWT_SECRET`, `NODE_ENV=production`, `CLIENT_URL`).
4. Set Build Command: `npm install`
5. Set Start Command: `npm start`

### Deploying the Frontend (Vercel / Netlify):
1. Create a new project pointing to the `client/` directory.
2. Set Build Command: `npm run build`
3. Set Output Directory: `dist`
4. Set Environment Variable: `VITE_API_URL` pointing to your deployed backend URL.

---

## 🧪 Testing Summary

- **Product Catalog:** 18+ high-performance products seeded across Shell, Caltex, PSO, Honda, Blaze, ZIC, and Total.
- **Stock Audit & Deduction:** Verified order placement automatically decrements available inventory and creates an inventory transaction audit log.
- **Order Cancellation Restoration:** Cancelling an order restores inventory back to the database safely, preventing duplicate adjustments.
- **Admin Statistics:** All metrics (Total Revenue, Total Products, Orders, Low Stock SKUs) are computed in real-time from MongoDB records.
- **WhatsApp Integration:** Verified pre-filled WhatsApp messaging to `+92 3113728228` with complete order summary and customer details.

---

**H.I LUBRICANT**  
*Near Gari Khata, Tulsi Daas Road, Amma Ayesha Hospital, Hyderabad, Sindh, Pakistan.*  
*Phone & WhatsApp: +92 311 3728228*
