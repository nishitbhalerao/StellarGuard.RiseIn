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
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="card p-12">
          <Shield className="w-16 h-16 text-primary-blue mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4 text-dark-gray">Connect Your Wallet</h2>
          <p className="text-neutral-gray text-lg">Please connect your wallet to view your audit history and access the dashboard</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="card p-12">
          <div className="text-xl text-dark-gray">Loading dashboard...</div>
        </div>
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
      SECURE: { text: 'SECURE', class: 'bg-gradient-to-r from-green-500 to-green-600 text-white' },
      MEDIUM_RISK: { text: 'MEDIUM', class: 'bg-orange-500 text-white' },
      HIGH_RISK: { text: 'HIGH RISK', class: 'bg-red-500 text-white' }
    };
    return badges[riskLevel] || badges.SECURE;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-gradient mb-4">Security Dashboard</h1>
        <p className="text-xl text-gray-600">Monitor your smart contract security metrics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="card p-6 hover-lift">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{totalAudits}</div>
              <div className="text-gray-600 font-medium">Total Audits</div>
            </div>
          </div>
        </div>

        <div className="card p-6 hover-lift">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{avgScore}</div>
              <div className="text-gray-600 font-medium">Average Score</div>
            </div>
          </div>
        </div>

        <div className="card p-6 hover-lift">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-red-500 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="text-3xl font-bold text-gray-800">{totalCritical}</div>
              <div className="text-gray-600 font-medium">Critical Issues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Vulnerability Chart */}
      {audits.length > 0 && (
        <div className="card p-8 mb-12 hover-lift">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Vulnerability Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vulnData}>
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
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
      <div className="card p-8 hover-lift">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Audits</h2>
        
        {audits.length === 0 ? (
          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-primary-blue/50 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No audits yet</h3>
            <p className="text-gray-600 mb-6">Start by uploading your first smart contract for analysis</p>
            <button
              onClick={() => navigate('/upload')}
              className="btn-primary"
            >
              Upload Contract
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-professional">
              <thead>
                <tr>
                  <th>Contract Name</th>
                  <th>Date</th>
                  <th>Security Score</th>
                  <th>Risk Level</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {audits.map((audit) => {
                  const badge = getRiskBadge(audit.riskLevel);
                  return (
                    <tr key={audit.auditId}>
                      <td className="font-medium text-gray-800">{audit.contractName}</td>
                      <td className="text-gray-600">
                        {new Date(audit.createdAt).toLocaleDateString()}
                      </td>
                      <td>
                        <span className="text-2xl font-bold text-blue-600">{audit.score}</span>
                        <span className="text-gray-600 text-sm">/100</span>
                      </td>
                      <td>
                        <span className={`${badge.class} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {badge.text}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => navigate(`/report/${audit.auditId}`)}
                          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View Report</span>
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
