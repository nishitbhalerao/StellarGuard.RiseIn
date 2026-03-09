import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Shield, AlertTriangle, TrendingUp, Eye } from 'lucide-react';
import { useWallet } from '../context/WalletContext';
import { getWalletAudits } from '../services/apiService';
import { useToast } from '../context/ToastContext';

export default function Dashboard() {
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { publicKey, isConnected } = useWallet();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (isConnected && publicKey) {
      loadAudits();
    } else {
      setIsLoading(false);
    }
  }, [isConnected, publicKey]);

  const loadAudits = async () => {
    try {
      const result = await getWalletAudits(publicKey);
      if (result.success) {
        setAudits(result.data);
      }
    } catch (error) {
      console.error('Load audits error:', error);
      showToast('Failed to load audits', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <Shield className="w-16 h-16 text-electric-blue mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
        <p className="text-ice-white/70">Please connect your wallet to view your audit history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  const totalAudits = audits.length;
  const avgScore = audits.length > 0
    ? Math.round(audits.reduce((sum, a) => sum + a.score, 0) / audits.length)
    : 0;
  const totalCritical = audits.reduce((sum, a) => 
    sum + a.vulnerabilities.filter(v => v.severity === 'CRITICAL').length, 0
  );

  const vulnData = [
    {
      name: 'Critical',
      count: audits.reduce((sum, a) => sum + a.vulnerabilities.filter(v => v.severity === 'CRITICAL').length, 0),
      color: '#EF4444'
    },
    {
      name: 'High',
      count: audits.reduce((sum, a) => sum + a.vulnerabilities.filter(v => v.severity === 'HIGH').length, 0),
      color: '#F59E0B'
    },
    {
      name: 'Medium',
      count: audits.reduce((sum, a) => sum + a.vulnerabilities.filter(v => v.severity === 'MEDIUM').length, 0),
      color: '#FBBF24'
    },
    {
      name: 'Low',
      count: audits.reduce((sum, a) => sum + a.vulnerabilities.filter(v => v.severity === 'LOW').length, 0),
      color: '#60A5FA'
    }
  ];

  const getRiskBadge = (riskLevel) => {
    const badges = {
      SECURE: { text: 'SECURE', class: 'bg-gradient-success' },
      MEDIUM_RISK: { text: 'MEDIUM', class: 'bg-gradient-warning' },
      HIGH_RISK: { text: 'HIGH RISK', class: 'bg-gradient-danger' }
    };
    return badges[riskLevel] || badges.SECURE;
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <h1 className="text-4xl font-bold mb-12 glow-text">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <Shield className="w-12 h-12 text-electric-blue" />
            <div>
              <div className="text-3xl font-bold">{totalAudits}</div>
              <div className="text-ice-white/60 text-sm">Total Audits</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <TrendingUp className="w-12 h-12 text-stellar-blue" />
            <div>
              <div className="text-3xl font-bold">{avgScore}</div>
              <div className="text-ice-white/60 text-sm">Avg Score</div>
            </div>
          </div>
        </div>

        <div className="glass-card p-6 rounded-xl">
          <div className="flex items-center space-x-4">
            <AlertTriangle className="w-12 h-12 text-orange-400" />
            <div>
              <div className="text-3xl font-bold">{totalCritical}</div>
              <div className="text-ice-white/60 text-sm">Critical Vulns</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerability Chart */}
      {audits.length > 0 && (
        <div className="glass-card p-8 rounded-2xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Vulnerability Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnData}>
              <XAxis dataKey="name" stroke="#F0F9FF" />
              <YAxis stroke="#F0F9FF" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0D1B2A',
                  border: '1px solid rgba(14, 165, 233, 0.3)',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {vulnData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Audit History */}
      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Audit History</h2>
        
        {audits.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-electric-blue/50 mx-auto mb-4" />
            <p className="text-ice-white/60">No audits yet. Start by uploading a contract!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-electric-blue/20">
                  <th className="text-left py-3 px-4">Contract</th>
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Score</th>
                  <th className="text-left py-3 px-4">Risk Level</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => {
                  const badge = getRiskBadge(audit.riskLevel);
                  return (
                    <tr
                      key={audit.auditId}
                      className="border-b border-electric-blue/10 hover:bg-electric-blue/5 transition"
                    >
                      <td className="py-4 px-4 font-medium">{audit.contractName}</td>
                      <td className="py-4 px-4 text-ice-white/60">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-electric-blue font-bold">{audit.score}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`${badge.class} px-3 py-1 rounded text-xs font-semibold`}>
                          {badge.text}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <button
                          onClick={() => navigate(`/report/${audit.auditId}`)}
                          className="flex items-center space-x-2 text-stellar-blue hover:text-electric-blue transition"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
