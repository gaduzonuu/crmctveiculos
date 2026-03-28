import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function ProtectedRoutes({ children }) {
  const { signed, loading } = useContext(AuthContext);

  if (loading) return <div className="flex items-center justify-center h-full w-full">Loading API...</div>;
  if (!signed) return <Navigate to="/login" replace />;

  return children;
}

function RoutesApp() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={
        <ProtectedRoutes>
          <Dashboard />
        </ProtectedRoutes>
      } />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <RoutesApp />
      </BrowserRouter>
    </AuthProvider>
  );
}
