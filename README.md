# 🏡 Aurally Realty

> Modern Real Estate Marketplace & Management Platform for Chennai properties, built with **Next.js 16**, **Express.js**, and **PostgreSQL (Supabase)**.

---

## 🌟 Features

- **🏠 Property Marketplace**:
  - **Buy & Rent Portals**: Filter by locality (*Anna Nagar, T. Nagar, Velachery, OMR, Adyar, etc.*), property type (*Apartment, Villa, Plot, Commercial*), BHK, and budget range.
  - **Dynamic Search & Sort**: Real-time filtering, price sorting (Low to High, High to Low), and keyword search.
  - **Property Detail Pages**: Multi-photo image galleries, amenities list, property specs, seller contact details, and an interactive **Home Loan EMI Calculator**.
  - **Lead Generation**: Embedded inquiry forms on listing pages that record buyer interest directly into the database.
  - **Post a Property**: User-friendly multi-step form to list properties for sale or rent.
- **🔐 Authentication & Access Control**:
  - Phone and email authentication with **bcrypt** password hashing.
  - Role-Based Access Control (**RBAC**) via `roles` and `user_roles` (*Admin, Property Agent, Customer*).
  - Secure session handling with **JWT** tokens supported via `httpOnly` cookies and `Authorization: Bearer` headers.
- **📊 Admin Management Console (`/admin`)**:
  - **Dashboard Overview**: Live platform metrics (total listings, active listings, registered accounts, buyer leads).
  - **Property Management**: Search, filter, preview, pause/publish, or delete property listings.
  - **Leads & Inquiries Queue**: Review buyer inquiries with direct phone links and property titles.
  - **User Directory**: View registered accounts, assigned roles, and listing counts.
  - **Pending Review**: Moderation queue to approve or reject community-submitted listings.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, CSS Modules
- **Backend API**: Node.js, Express.js (ES Modules), CORS, Cookie-Parser, Morgan
- **Database**: PostgreSQL 14+ (hosted on Supabase) via `pg` connection pool with SSL
- **Authentication**: JWT (`jsonwebtoken`), `bcryptjs`
- **Data Modeling**: 21-table normalized relational schema from the Auraally Phase 1 Database Blueprint

---

## 📁 Project Structure

```
aurally-realty/
├── app/                          # Next.js App Router pages
│   ├── page.js                   # Homepage with featured properties & area cards
│   ├── buy/page.js               # Properties for sale catalog & filters
│   ├── rent/page.js              # Rental listings catalog & filters
│   ├── sell/page.js              # Post a property listing multi-step form
│   ├── property/[id]/page.js     # Single listing view, gallery & inquiry form
│   ├── admin/page.js             # Admin management console
│   └── (auth)/                   # Login & signup pages
├── components/                   # Shared UI components (Navbar, Footer, PropertyCard)
├── lib/
│   ├── api.js                    # Centralized client for Express REST API
│   ├── properties.js             # Property data fetching & submission helpers
│   ├── auth.js                   # Auth session & credentials helpers
│   └── data.js                   # Shared constants & offline fallback fixtures
├── backend/                      # Standalone Express.js REST API
│   ├── package.json              # Backend dependencies
│   ├── src/
│   │   ├── server.js             # Express application entry point (Port 4000)
│   │   ├── config/db.js          # PostgreSQL connection pool with SSL
│   │   ├── middleware/auth.js    # JWT verification & role authorization
│   │   ├── routes/               # Modular Express routers
│   │   │   ├── auth.routes.js
│   │   │   ├── properties.routes.js
│   │   │   ├── enquiries.routes.js
│   │   │   └── admin.routes.js
│   │   ├── controllers/          # Business logic & SQL queries
│   │   └── scripts/              # Database utilities
│   │       ├── test-db.js        # Health check & table inspector
│   │       └── seed.js           # Seeds Chennai localities, users & listings
│   └── .env.example              # Backend environment template
├── .env.example                  # Root environment template
└── package.json                  # Next.js scripts & dependencies
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18.17 or higher
- **PostgreSQL**: A PostgreSQL database (or free [Supabase](https://supabase.com) project)

### 2. Installation

Clone the repository and install dependencies for both the frontend and backend:

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Variables

Create `.env` and `.env.local` files in the root folder:

```bash
# Copy templates
cp .env.example .env
cp .env.example backend/.env
```

Fill in your PostgreSQL / Supabase credentials:

```env
# Database Configuration (Supabase PostgreSQL)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres
DB_HOST=db.[PROJECT-ID].supabase.co
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=postgres
DB_SSL=true

# Server Configuration
PORT=4000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# Frontend Configuration
NEXT_PUBLIC_API_URL=http://localhost:4000/api
FRONTEND_URL=http://localhost:3000
```

> **Note**: If your database password contains special characters (like `@`), URL-encode it in `DATABASE_URL` (e.g. `@` becomes `%40`).

### 4. Database Setup & Seeding

1. Run the database DDL schema on your PostgreSQL instance (or paste it into the **Supabase SQL Editor**).
2. Seed Chennai localities, demo users, and starter properties:

```bash
cd backend
npm run seed
cd ..
```

---

## 🏃 Running the Application

Run both services in separate terminal windows:

### Terminal 1: Express API Server
```bash
npm run dev:api
# Or from backend/: cd backend && npm run dev
```
> Server runs at **`http://localhost:4000`** (Health check: `http://localhost:4000/api/health`)

### Terminal 2: Next.js Frontend
```bash
npm run dev
```
> Web client runs at **`http://localhost:3000`**

---

## 🔑 Default Credentials (Seed Data)

| Role | Phone | Password | Access |
| :--- | :--- | :--- | :--- |
| **Administrator** | `9876543210` | `Password@123` | Full access to `/admin` dashboard |
| **Property Agent** | `9840012345` | `Password@123` | Can post and manage properties |

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `GET` | `/api/health` | Service and database health check | No |
| `POST` | `/api/auth/signup` | Register a new user account | No |
| `POST` | `/api/auth/login` | Log in and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch active user session & roles | Yes |
| `POST` | `/api/auth/logout` | Clear session cookie | No |
| `GET` | `/api/properties` | List properties with query filters (`status`, `area`, `type`, `beds`, `budget`, `sortBy`, `q`) | No |
| `GET` | `/api/properties/:id` | Fetch single property detail with images & amenities | No |
| `POST` | `/api/properties` | Submit a new property listing | Optional (guest or user) |
| `POST` | `/api/enquiries` | Submit buyer lead / inquiry from property detail page | No |
| `GET` | `/api/enquiries` | List all buyer inquiries | Admin |
| `GET` | `/api/admin/stats` | Aggregate dashboard metrics | Admin |
| `GET` | `/api/admin/users` | List registered user directory | Admin |
| `PATCH` | `/api/admin/properties/:id/status` | Update listing status (`published`, `draft`, `sold`, etc.) | Admin |
| `DELETE`| `/api/admin/properties/:id` | Delete listing and related media | Admin |

---

## 📄 License

Private repository. All rights reserved.
