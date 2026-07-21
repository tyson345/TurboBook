import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CustomersPage from './pages/CustomersPage';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import CustomerPortalPage from './pages/CustomerPortalPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/portal" element={<ProtectedRoute role="customer"><CustomerPortalPage /></ProtectedRoute>} />
            <Route
              path="/"
              element={
                <ProtectedRoute role="admin">
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="appointments" element={<AppointmentsPage />} />
              <Route path="customers" element={<CustomersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 500,
              boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
            },
            success: {
              iconTheme: { primary: '#5B21B6', secondary: '#fff' },
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
