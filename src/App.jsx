import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { ToastProvider } from './context/ToastContext';
import Navbar from './components/Navbar';
import AnimatedBackground from './components/AnimatedBackground';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import AuditReport from './pages/AuditReport';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <WalletProvider>
        <ToastProvider>
          <div className="min-h-screen relative overflow-hidden">
            <AnimatedBackground />
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/report/:auditId" element={<AuditReport />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </div>
        </ToastProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
