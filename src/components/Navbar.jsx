import { Link } from 'react-router-dom';
import { Shield, Wallet, LogOut, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 hover-lift">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-blue">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">StellarGuard</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {user && (
              <>
                <Link 
                  to="/upload" 
                  className="text-dark-gray hover:text-primary-blue transition-colors font-medium"
                >
                  Upload
                </Link>
                <Link 
                  to="/dashboard" 
                  className="text-dark-gray hover:text-primary-blue transition-colors font-medium"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link 
                    to="/admin" 
                    className="flex items-center space-x-1 text-primary-blue hover:text-primary-blue-dark transition-colors font-semibold"
                  >
                    <Settings className="w-4 h-4" />
                    <span>Admin</span>
                  </Link>
                )}
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wallet Connection */}
            {isConnected ? (
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 bg-light-gray px-3 py-2 rounded-lg border">
                  <div className="w-2 h-2 bg-success-green rounded-full"></div>
                  <span className="text-sm font-medium text-dark-gray">
                    {truncateAddress(publicKey)}
                  </span>
                </div>
                <button
                  onClick={disconnect}
                  className="px-4 py-2 bg-error-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
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

            {/* User Info */}
            {user && (
              <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
                <div className="text-right">
                  <p className="text-sm font-medium text-dark-gray">{user.name}</p>
                  <p className="text-xs text-neutral-gray">{user.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-light-gray rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5 text-neutral-gray hover:text-error-red" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-dark-gray hover:bg-light-gray transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 animate-slide-up">
            <div className="flex flex-col space-y-4">
              {user && (
                <>
                  <Link 
                    to="/upload" 
                    className="text-dark-gray hover:text-primary-blue transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Upload
                  </Link>
                  <Link 
                    to="/dashboard" 
                    className="text-dark-gray hover:text-primary-blue transition-colors font-medium py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  {isAdmin && (
                    <Link 
                      to="/admin" 
                      className="flex items-center space-x-1 text-primary-blue hover:text-primary-blue-dark transition-colors font-semibold py-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Admin</span>
                    </Link>
                  )}
                </>
              )}
              
              {/* Mobile Wallet & User Actions */}
              <div className="pt-4 border-t border-gray-200 space-y-4">
                {/* Wallet Connection */}
                {isConnected ? (
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2 bg-light-gray px-3 py-2 rounded-lg border">
                      <div className="w-2 h-2 bg-success-green rounded-full"></div>
                      <span className="text-sm font-medium text-dark-gray">
                        {truncateAddress(publicKey)}
                      </span>
                    </div>
                    <button
                      onClick={disconnect}
                      className="w-full px-4 py-2 bg-error-red text-white rounded-lg hover:bg-red-600 transition-colors text-sm font-medium"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  user && (
                    <button
                      onClick={handleConnect}
                      className="w-full btn-primary flex items-center justify-center space-x-2"
                    >
                      <Wallet className="w-4 h-4" />
                      <span>Connect Wallet</span>
                    </button>
                  )
                )}

                {/* User Info */}
                {user && (
                  <div className="flex items-center justify-between p-3 bg-light-gray rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-dark-gray">{user.name}</p>
                      <p className="text-xs text-neutral-gray">{user.email}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="p-2 hover:bg-white rounded-lg transition-colors"
                      title="Logout"
                    >
                      <LogOut className="w-5 h-5 text-neutral-gray hover:text-error-red" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
