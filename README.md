# ⚡ TurboBook MVP Builder

A modern, full-featured SaaS booking management dashboard built with React + TypeScript + Vite + Tailwind CSS + shadcn/ui design principles.

## 🚀 Features

- **Authentication** — Demo login with protected routes
- **Dashboard** — Stats cards + weekly line chart + recent appointments table
- **Appointments** — Full CRUD with search, filter, date filter, pagination
- **Customers** — Full CRUD with search, pagination, avatars
- **Reports** — Bar chart + Donut/Pie chart analytics
- **Settings** — Dark mode, profile, notifications, security
- **Dark Mode** — System toggle with persistence
- **Responsive** — Desktop, tablet, and mobile layouts
- **Animations** — Framer Motion page transitions, modals, cards
- **Toast Notifications** — Success/error feedback
- **Empty States** — Friendly empty state UI
- **Pagination** — All tables paginated

## 🔑 Demo Credentials

```
Email:    admin@turbobook.com
Password: 123456
```

## 🛠️ Setup

### 1. Install Node.js

Download and install Node.js (v20 LTS recommended):
👉 https://nodejs.org/en/download

### 2. Install Dependencies

Open a terminal in this folder and run:

```bash
npm install
```

### 3. Start Development Server

```bash
npm run dev
```

Then open: http://localhost:5173

### 4. Build for Production

```bash
npm run build
```

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── EmptyState.tsx
│   ├── LoadingSpinner.tsx
│   ├── Modal.tsx
│   ├── Pagination.tsx
│   ├── ProtectedRoute.tsx
│   └── StatusBadge.tsx
├── context/            # React contexts
│   ├── AuthContext.tsx
│   └── ThemeContext.tsx
├── data/               # JSON dummy data
│   ├── appointments.json
│   └── customers.json
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts
│   └── usePagination.ts
├── layouts/            # Layout components
│   ├── DashboardLayout.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── pages/              # Route pages
│   ├── AppointmentsPage.tsx
│   ├── CustomersPage.tsx
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── ReportsPage.tsx
│   └── SettingsPage.tsx
├── types/              # TypeScript interfaces
│   └── index.ts
└── App.tsx
```

## 🎨 Tech Stack

| Technology | Purpose |
|---|---|
| React 18 + TypeScript | Core framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| React Router v6 | Client-side routing |
| Recharts | Charts & analytics |
| Framer Motion | Animations |
| Lucide React | Icons |
| react-hot-toast | Toast notifications |

## 🗺️ Routes

| Path | Page | Protected |
|---|---|---|
| `/login` | Login Page | ❌ |
| `/dashboard` | Dashboard | ✅ |
| `/appointments` | Appointments Management | ✅ |
| `/customers` | Customer List | ✅ |
| `/reports` | Analytics Reports | ✅ |
| `/settings` | Settings | ✅ |
