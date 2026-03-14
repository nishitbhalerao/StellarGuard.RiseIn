import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, CheckCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { signup } = useAuth();
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
      showToast('Please create a password', 'error');
      return false;
    }
    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return false;
    }
    if (!confirmPassword) {
      showToast('Please confirm your password', 'error');
      return false;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match', 'error');
      return false;
    }
    return true;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, confirmPassword);
      showToast('Account created successfully!', 'success');
      navigate('/upload');
    } catch (error) {
      showToast(error.message || 'Signup failed. Please try again.', 'error');
      console.error('Signup error:', error);
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
          <p className="text-ice-white/60">Create your account</p>
        </div>

        {/* Signup Card */}
        <div className="glass-card p-8 rounded-2xl">
          <form onSubmit={handleSignup} className="space-y-6">
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
                Create Password
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
              <p className="text-xs text-ice-white/50 mt-1">Minimum 6 characters</p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-ice-white">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 w-5 h-5 text-electric-blue/60" />
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-midnight-navy/50 border border-electric-blue/20 rounded-lg pl-10 pr-4 py-3 text-ice-white placeholder-ice-white/40 focus:outline-none focus:border-electric-blue/60 focus:ring-1 focus:ring-electric-blue/30 transition-all"
                  disabled={isLoading}
                />
              </div>
              {password && confirmPassword && (
                <div className="flex items-center gap-2 mt-2">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-xs text-green-500">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 text-red-500" />
                      <span className="text-xs text-red-500">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary py-3 rounded-lg font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-electric-blue/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gradient-card text-ice-white/60">Already have an account?</span>
              </div>
            </div>

            {/* Login Link */}
            <Link
              to="/login"
              className="w-full block text-center py-3 rounded-lg border border-electric-blue/30 text-electric-blue font-semibold hover:border-electric-blue/60 hover:bg-electric-blue/10 transition-all"
            >
              Sign In
            </Link>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-midnight-navy/50 rounded-lg border border-stellar-blue/20">
            <p className="text-xs text-ice-white/60 text-center">
              Your account will be created instantly and securely
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
