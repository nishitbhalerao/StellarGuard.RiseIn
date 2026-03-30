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
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 text-gradient animate-fade-in">
            StellarGuard
          </h1>
          <p className="text-2xl text-dark-gray mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Automated Smart Contract Security Auditor for Stellar Soroban
          </p>
          <button
            onClick={() => navigate('/login')}
            className="btn-primary text-lg px-8 py-4 animate-fade-in hover-lift"
            style={{ animationDelay: '0.4s' }}
          >
            Get Started
          </button>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Why Choose StellarGuard?</h2>
          <p className="text-xl text-gray-600">Comprehensive security analysis for your Soroban smart contracts</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-8 text-center hover-lift animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="text-primary-blue mb-6 flex justify-center">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-light-gray py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-12">Trusted by Developers Worldwide</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="hover-lift">
                <div className="text-5xl font-bold text-primary-blue mb-2">500+</div>
                <div className="text-gray-600 font-medium">Audits Completed</div>
              </div>
              <div className="hover-lift">
                <div className="text-5xl font-bold text-green-500 mb-2">99.2%</div>
                <div className="text-gray-600 font-medium">Accuracy Rate</div>
              </div>
              <div className="hover-lift">
                <div className="text-5xl font-bold text-blue-500 mb-2">12</div>
                <div className="text-gray-600 font-medium">Vulnerability Types</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Ready to Secure Your Smart Contracts?</h2>
          <p className="text-xl text-gray-600 mb-8">Join thousands of developers who trust StellarGuard for their security audits</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary text-lg px-8 py-4 hover-lift"
            >
              Start Free Audit
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary text-lg px-8 py-4 hover-lift"
            >
              View Dashboard
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-primary rounded-lg shadow-blue">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">StellarGuard</span>
            </div>
            <p className="text-gray-600 mb-2">Powered by Stellar Blockchain</p>
            <p className="text-sm text-gray-600">© 2026 StellarGuard. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
