import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Layouts
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

// Pages
import { Login } from './pages/Login';
import { Signup } from './pages/Signup';
import { Dashboard } from './pages/Dashboard';
import { Trips } from './pages/Trips';
import { ItineraryBuilder } from './pages/ItineraryBuilder';
import { Budget } from './pages/Budget';
import { Explore } from './pages/Explore';
import { Checklist } from './pages/Checklist';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public / Auth Routes */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:id" element={<ItineraryBuilder />} />
            <Route path="/budget" element={<Budget />} />
            <Route path="/budget/:id" element={<Budget />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/checklist" element={<Checklist />} />
          </Route>

          {/* Fallback routing */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
