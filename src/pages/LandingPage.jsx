import { useNavigate } from 'react-router-dom';
import { Shield, Zap, Lock, FileSearch, TrendingUp, CheckCircle } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <FileSearch className="w-8 h-8" />,
      title: 'Automated Analysis',
      description: 'Advanced static analysis engine detects vulnerabilities instantly'
    },
    {
      icon: <Lock className="w-8 h-8" />,
      title: 'Security First',
      description: 'Comprehensive checks for authorization, overflow, and reentrancy'
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast',
      description: 'Get detailed audit reports in seconds, not days'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Blockchain Verified',
      description: 'Store audit hashes on Stellar for immutable proof'
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Risk Scoring',
      description: 'Clear security scores with actionable recommendations'
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: 'Soroban Native',
      description: 'Built specifically for Stellar Soroban smart contracts'
    }
  ];

  return (
    <div className="relative z-10">
      {/* Hero Section */}
      <div className="bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 glow-text animate-fade-in">
            StellarGuard
          </h1>
          <p className="text-2xl text-ice-white/80 mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Automated Smart Contract Security Auditor for Stellar Soroban
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-primary text-lg px-8 py-4 animate-fade-in"
            style={{ animationDelay: '0.4s' }}
          >
            Start Audit
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass-card p-6 rounded-xl animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="text-electric-blue mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-ice-white/70">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="glass-card p-12 rounded-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold text-electric-blue mb-2">500+</div>
              <div className="text-ice-white/70">Audits Completed</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-stellar-blue mb-2">99.2%</div>
              <div className="text-ice-white/70">Uptime</div>
            </div>
            <div>
              <div className="text-5xl font-bold text-electric-blue mb-2">12</div>
              <div className="text-ice-white/70">Vulnerability Types</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-electric-blue/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-ice-white/60">
            <p>Powered by Stellar Blockchain</p>
            <p className="mt-2">© 2026 StellarGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
