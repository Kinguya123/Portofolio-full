import * as React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Projects from "./pages/Projects";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";

// Hapus import trackPageView karena tidak digunakan
// import { trackPageView } from './services/api';

// Protected Route untuk portfolio (hanya user yang login)
function PortfolioProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

// Protected Route untuk admin
function AdminProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token || userData.email === 'user@gmail.com') {
    return <Navigate to="/admin/login" replace />;
  }
  
  return children;
}

export default function App() {
  const token = localStorage.getItem('token');
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = token && userData.email === 'user@gmail.com';

  return (
    <div className="app">
      <Routes>
        {/* Portfolio routes - hanya bisa diakses jika login sebagai user@gmail.com */}
        <Route path="/" element={
          <PortfolioProtectedRoute>
            <>
              <Navbar />
              <main className="content">
                <Home />
              </main>
              <Footer />
            </>
          </PortfolioProtectedRoute>
        } />
        
        <Route path="/about" element={
          <PortfolioProtectedRoute>
            <>
              <Navbar />
              <main className="content">
                <About />
              </main>
              <Footer />
            </>
          </PortfolioProtectedRoute>
        } />
        
        <Route path="/projects" element={
          <PortfolioProtectedRoute>
            <>
              <Navbar />
              <main className="content">
                <Projects />
              </main>
              <Footer />
            </>
          </PortfolioProtectedRoute>
        } />
        
        <Route path="/contact" element={
          <PortfolioProtectedRoute>
            <>
              <Navbar />
              <main className="content">
                <Contact />
              </main>
              <Footer />
            </>
          </PortfolioProtectedRoute>
        } />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } />
        
        {/* Redirect root jika sudah login ke portfolio */}
        <Route path="*" element={<Navigate to={isLoggedIn ? "/" : "/admin/login"} replace />} />
      </Routes>
    </div>
  );
}