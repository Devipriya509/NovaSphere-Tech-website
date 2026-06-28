import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Lazily Loaded Pages for Code Splitting
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Services = lazy(() => import('./pages/Services'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Careers = lazy(() => import('./pages/Careers'));
const Contact = lazy(() => import('./pages/Contact'));
const Book = lazy(() => import('./pages/Book'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));
const Profile = lazy(() => import('./pages/Profile'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const NotFound = lazy(() => import('./pages/NotFound'));
const ServerError = lazy(() => import('./pages/ServerError'));
const PaymentSuccess = lazy(() => import('./pages/PaymentSuccess'));
const PaymentFailure = lazy(() => import('./pages/PaymentFailure'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
    <span className="spinner" style={{ width: '40px', height: '40px' }}></span>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading NovaSphere Portal...</p>
  </div>
);

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                {/* Public & Core Site Area */}
                <Route path="/" element={<MainLayout />}>
                  <Route index element={<Home />} />
                  <Route path="about" element={<About />} />
                  <Route path="services" element={<Services />} />
                  <Route path="portfolio" element={<Portfolio />} />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogDetails />} />
                  <Route path="careers" element={<Careers />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="book" element={<Book />} />
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="payment-failure" element={<PaymentFailure />} />
                  
                  {/* Auth Views inside main Layout */}
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password" element={<ResetPassword />} />
                  <Route path="profile" element={<Profile />} />
                </Route>

                {/* User Dashboard Portal */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<UserDashboard />} />
                  <Route path="bookings" element={<UserDashboard />} />
                  <Route path="saved" element={<UserDashboard />} />
                  <Route path="help" element={<UserDashboard />} />
                  <Route path="settings" element={<UserDashboard />} />
                </Route>

                {/* Admin Panel Control Center */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="users" element={<AdminDashboard />} />
                  <Route path="services" element={<AdminDashboard />} />
                  <Route path="projects" element={<AdminDashboard />} />
                  <Route path="blogs" element={<AdminDashboard />} />
                  <Route path="bookings" element={<AdminDashboard />} />
                  <Route path="contacts" element={<AdminDashboard />} />
                  <Route path="careers" element={<AdminDashboard />} />
                  <Route path="testimonials" element={<AdminDashboard />} />
                </Route>

                {/* Fallback Errors */}
                <Route path="/500" element={<ServerError />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
