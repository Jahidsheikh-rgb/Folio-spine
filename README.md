<div align="center">
  <h1 align="center">Folio &amp; Spine — Enterprise Book Shop Ecosystem</h1>
  <p align="center">
    A production-grade, full-stack e-commerce platform engineered with Node.js, Express, Next.js 14, and MongoDB.
  </p>
  <p align="center">
    <a href="#-architecture--tech-stack">Architecture</a> •
    <a href="#-key-engineering-highlights">Engineering Highlights</a> •
    <a href="#-quick-start-guide">Quick Start</a> •
    <a href="#-api-reference">API Reference</a> •
    <a href="#-environment-variables">Environment Setup</a>
  </p>
</div>

---

## 🌟 Overview

**Folio & Spine** is a high-performance, editorial-grade digital bookstore designed for software engineers, technical pioneers, and avid readers. Built following clean architectural principles, it features a robust ACID-compliant backend REST API paired with a lightning-fast Next.js storefront and Admin Studio.

---

## 🏗️ Architecture & Tech Stack

```text
book-shop-ecosystem/
├── book-shop-backend/       # Node.js, Express, Mongoose, Joi, JWT
│   └── src/                 # MVC + Service Layer Architecture
└── book-shop-frontend/      # Next.js 14 (App Router), Tailwind CSS, Zustand, Axios
    └── src/                 # Storefront & Admin Studio
```

### **Backend (`book-shop-backend`)**
* **Runtime**: Node.js & Express
* **Database**: MongoDB & Mongoose (Strict schema design, text indexes, aggregate rating hooks)
* **Validation**: Joi (Fail-fast request payload, query, and params validation)
* **Security**: Helmet, CORS, Express Rate Limit, Mongo Sanitize, HPP (HTTP Parameter Pollution protection)
* **Authentication**: Stateless JSON Web Tokens (JWT) with Role-Based Access Control (`customer`, `admin`)

### **Frontend (`book-shop-frontend`)**
* **Framework**: Next.js 14 (App Router)
* **Styling**: Tailwind CSS (Editorial typography: *Playfair Display* & *Inter*)
* **State Management**: Zustand (Persistent shopping cart & authentication sessions)
* **HTTP Client**: Axios with automatic JWT interceptors and error normalization

---

## 💎 Key Engineering Highlights

1. **ACID-Compliant Order & Inventory Transactions**:
   * Uses MongoDB multi-document sessions (`mongoose.startSession()`) to atomically validate stock, decrement inventory, compute subtotals, and persist orders—completely preventing overselling under high concurrency.
2. **Automated Review & Rating Aggregation**:
   * Compound unique indexes ensure one review per user per book. Mongoose post-save hooks automatically run MongoDB `$group` aggregation pipelines to keep `Book.averageRating` and `Book.ratingsCount` synchronized.
3. **Fail-Fast Configuration & Security Hardening**:
   * Environment variables are strictly validated at startup using Joi schemas. Request bodies are capped at `16kb`, and NoSQL injection vectors are sanitized at the gateway level.
4. **Resilient Frontend Architecture**:
   * Stock-capped cart items stored locally with automatic token verification, clean toast notifications, and an intuitive Admin Studio for inventory management and order fulfillment.

---

## 🚀 Quick Start Guide

Follow these steps to run both services locally.

### Prerequisites
* **Node.js** (v18+ recommended)
* **MongoDB** (Local instance or MongoDB Atlas cluster supporting replica sets for ACID transactions)

### 1. Run the Backend API (Port 5000)
```bash
cd book-shop-backend
npm install

# Configure your .env file (see Environment Variables section below)
cp .env.example .env

# Seed the database with sample books and demo accounts
npm run seed

# Start the development server
npm run dev
```

### 2. Run the Frontend Storefront (Port 3000)
Open a second terminal window:
```bash
cd book-shop-frontend
npm install

# Configure your .env.local file
cp .env.example .env.local

# Start the Next.js development server
npm run dev
```

Open **`http://localhost:3000`** in your browser.

---

## 🔐 Seeded Demo Accounts

To test both customer flows and admin privileges instantly, use these credentials created by `npm run seed`:

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@bookshop.com` | `AdminPassword123!` | Full Admin Studio (`/admin`) |
| **Customer** | `jane@example.com` | `CustomerPassword123!` | Storefront, Cart, Orders, Reviews |

---

## ⚙️ Environment Variables

### Backend (`book-shop-backend/.env`)
```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/book-shop
JWT_SECRET=your_super_secure_long_random_jwt_secret_key_here_64_bytes
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (`book-shop-frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

## 🔌 API Reference Summary

### **Auth (`/api/v1/auth`)**
* `POST /register` — Register a new customer account
* `POST /login` — Authenticate and issue JWT token
* `GET /me` — Get current logged-in user profile *(Protected)*

### **Books (`/api/v1/books`)**
* `GET /` — List books (Supports `search`, `genre`, `minPrice`, `maxPrice`, `inStock`, `sort`, `page`, `limit`)
* `GET /:id` — Get single book details
* `POST /` — Create a new book *(Admin)*
* `PATCH /:id` — Update book details or stock *(Admin)*
* `DELETE /:id` — Soft-delete / remove book *(Admin)*
* `GET /:bookId/reviews` — Get all reviews for a book
* `POST /:bookId/reviews` — Add or update book review *(Protected)*

### **Orders (`/api/v1/orders`)**
* `POST /` — Place a new order with atomic inventory decrement *(Protected)*
* `GET /my-orders` — Get logged-in user's order history *(Protected)*
* `GET /` — List all shop orders across users *(Admin)*
* `PATCH /:id/status` — Update order fulfillment status (`pending`, `processing`, `shipped`, `delivered`, `cancelled`) *(Admin)*

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).