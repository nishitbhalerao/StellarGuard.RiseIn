import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showToast } = useToast();

  const validateForm = () => {
    if (!email.trim()) {
      showToast('Please enter your email', 'error');
      return false;
    }
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      showToast('Please enter a valid email address', 'error');
      return false;
    }
    if (!password) {
      showToast('Please enter your password', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return false;
    }
    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      showToast('Login successful!', 'success');
      navigate('/upload');
    } catch (error) {
      showToast(error.message || 'Login failed. Please try again.', 'error');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">StellarGuard</h1>
          <p className="text-ice-white/60">Sign in to your account</p>
        </div>

        {/* Login Card */}
        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-ice-white">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 w-5 h-5 text-electric-blue/60" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full bg-midnight-navy/50 border border-electric-blue/20 rounded-lg pl-10 pr-4 py-3 text-ice-white placeholder-ice-white/40 focus:outline-none focus:border-electric-blue/60 focus:ring-1 focus:ring-electric-blue/30 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2 text-ice-white">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-electric-blue/60" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-midnight-navy/50 border border-electric-blue/20 rounded-lg pl-10 pr-4 py-3 text-ice-white placeholder-ice-white/40 focus:outline-none focus:border-electric-blue/60 focus:ring-1 focus:ring-electric-blue/30 transition-all"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-electric-blue/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-card text-ice-white/60">New to StellarGuard?</span>
              </div>
            </div>

            {/* Signup Link */}
            <Link
              to="/signup"
              className="w-full block text-center py-3 rounded-lg border border-electric-blue/30 text-electric-blue font-semibold hover:border-electric-blue/60 hover:bg-electric-blue/10 transition-all"
            >
              Create Account
            </Link>
          </form>

          {/* Demo Info */}
          <div className="mt-6 p-4 bg-midnight-navy/50 rounded-lg border border-stellar-blue/20">
            <p className="text-xs text-ice-white/60 text-center">
              Demo: Use any email and password (min 6 characters)
            </p>
          </div>
        </div>

        {/* Footer Link */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-ice-white/60 hover:text-electric-blue text-sm transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
