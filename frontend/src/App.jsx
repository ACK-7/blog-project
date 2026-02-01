import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import PostDetail from './pages/PostDetail';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import Categories from './pages/Categories';
import Trash from './pages/Trash';
import EmailVerification from './pages/EmailVerification';
import EmailVerificationGuard from './components/common/EmailVerificationGuard';
import Spinner from './components/common/Spinner';
import './index.css';

// Protected Route Component (requires authentication AND email verification)
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? (
    <EmailVerificationGuard>
      {children}
    </EmailVerificationGuard>
  ) : (
    <Navigate to="/login" />
  );
};

// Auth Route Component (requires authentication but not email verification)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Guest Route Component (redirect to dashboard if already logged in)
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function AppContent() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/posts/:slug" element={<PostDetail />} />

          {/* Guest Only Routes */}
          <Route 
            path="/login" 
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            } 
          />
          <Route 
            path="/register" 
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            } 
          />

          {/* Email Verification Route (requires auth but not verification) */}
          <Route 
            path="/email/verify" 
            element={
              <AuthRoute>
                <EmailVerification />
              </AuthRoute>
            } 
          />

          {/* Protected Routes (require auth AND email verification) */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/posts/create" 
            element={
              <ProtectedRoute>
                <CreatePost />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/posts/:slug/edit" 
            element={
              <ProtectedRoute>
                <EditPost />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/categories" 
            element={
              <ProtectedRoute>
                <Categories />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/trash" 
            element={
              <ProtectedRoute>
                <Trash />
              </ProtectedRoute>
            } 
          />

          {/* 404 - Not Found */}
          <Route 
            path="*" 
            element={
              <div className="text-center py-12">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                <p className="text-gray-600 text-lg mb-6">Page not found</p>
                <a href="/" className="text-blue-600 hover:underline">
                  Go back home
                </a>
              </div>
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;