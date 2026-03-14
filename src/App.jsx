import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import UploadPage from './pages/UploadPage';
import AuditReport from './pages/AuditReport';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

// Protected route component
function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-ice-white">Loading...</p></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Admin route component
function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-ice-white">Loading...</p></div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <WalletProvider>
          <ToastProvider>
            <div className="min-h-screen relative overflow-hidden">
              <AnimatedBackground />
              <Navbar />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route 
                  path="/upload" 
                  element={
                    <ProtectedRoute>
                      <UploadPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/report/:auditId" 
                  element={
                    <ProtectedRoute>
                      <AuditReport />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
              </Routes>
            </div>
          </ToastProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
