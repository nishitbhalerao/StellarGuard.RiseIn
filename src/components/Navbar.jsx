import { Link } from 'react-router-dom';
import { Shield, Wallet, LogOut, Settings } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const { publicKey, isConnected, connect, disconnect } = useWallet();
  const { user, logout, isAdmin } = useAuth();
  const { showToast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      showToast('Wallet connected successfully', 'success');
    } catch (error) {
      const message = error.message?.includes('not installed')
        ? 'Freighter wallet not found. Please install it from freighter.app'
        : error.message?.includes('declined')
          ? 'Connection request was declined'
          : 'Failed to connect wallet. Please try again.';
      showToast(message, 'error');
    }
  };

  const handleLogout = () => {
    logout();
    showToast('Logged out successfully', 'success');
  };

  const truncateAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  return (
    <nav className="relative z-10 border-b border-electric-blue/20 backdrop-blur-xl bg-midnight-navy/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-electric-blue" />
            <span className="text-2xl font-bold glow-text">StellarGuard</span>
          </Link>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <Link to="/upload" className="text-ice-white hover:text-stellar-blue transition">
                  Upload
                </Link>
                <Link to="/dashboard" className="text-ice-white hover:text-stellar-blue transition">
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="flex items-center space-x-1 text-electric-blue hover:text-stellar-blue transition font-semibold">
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
            
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="px-4 py-2 bg-gradient-card border border-electric-blue/30 rounded-lg">
                  <span className="text-stellar-blue text-sm">{truncateAddress(publicKey)}</span>
                </div>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-gradient-danger rounded-lg text-sm font-medium hover:opacity-80 transition"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              user && (
                <button
                  onClick={handleConnect}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Wallet className="w-4 h-4" />
                  <span>Connect Wallet</span>
                </button>
              )
            )}

            {user && (
              <div className="flex items-center space-x-3 pl-6 border-l border-electric-blue/20">
                <div className="text-right">
                  <p className="text-sm font-medium text-ice-white">{user.name}</p>
                  <p className="text-xs text-ice-white/60">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-midnight-navy/50 rounded-lg transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-ice-white hover:text-electric-blue" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
