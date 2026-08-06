import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ToastProvider from './components/ToastProvider';
import ScrollToTop from './components/ScrollToTop';

// Redirect authenticated users away from login/signup
const AuthRedirect = ({ children }) => {
  const { token } = useAuth();
  if (token) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppContent() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
        <Route path="/signup" element={<AuthRedirect><Signup /></AuthRedirect>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <ScrollToTop />
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
