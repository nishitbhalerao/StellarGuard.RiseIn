import { useState, useEffect } from 'react';
import { Trash2, Eye, BarChart3, AlertTriangle, TrendingUp, Loader2, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { useAdminApi } from '../services/adminApiService';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('audits'); // 'audits' or 'users'
  const [audits, setAudits] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [stats, setStats] = useState({
    totalAudits: 0,
    criticalCount: 0,
    highCount: 0,
    averageScore: 0,
    totalUsers: 0
  });
  const [selectedAudit, setSelectedAudit] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeletingId, setIsDeletingId] = useState(null);

  const { isAdmin, user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const adminApi = useAdminApi();

  // Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      showToast('Admin access required', 'error');
      navigate('/');
    }
  }, [isAdmin, navigate, showToast]);

  // Fetch data based on active tab
  useEffect(() => {
    if (activeTab === 'audits') {
      fetchAudits();
    } else {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchAudits = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.fetchAllAudits();
      
      if (data.success) {
        setAudits(data.data || []);
        calculateStats(data.data || []);
      } else {
        showToast('Failed to fetch audits', 'error');
      }
    } catch (error) {
      console.error('Error fetching audits:', error);
      showToast(error.message || 'Error loading audits', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await adminApi.fetchAllUsers();
      
      if (data.success) {
        setUsers(data.data || []);
        setStats(prev => ({
          ...prev,
          totalUsers: data.data?.length || 0
        }));
      } else {
        showToast('Failed to fetch users', 'error');
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      showToast(error.message || 'Error loading users', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (auditsList) => {
    const criticalCount = auditsList.filter(a => a.riskLevel === 'HIGH_RISK' && a.vulnerabilities?.some(v => v.severity === 'CRITICAL')).length;
    const highCount = auditsList.filter(a => a.riskLevel === 'HIGH_RISK').length;
    const averageScore = auditsList.length > 0 ? (auditsList.reduce((sum, a) => sum + a.score, 0) / auditsList.length).toFixed(1) : 0;

    setStats(prev => ({
      ...prev,
      totalAudits: auditsList.length,
      criticalCount,
      highCount,
      averageScore
    }));
  };

  const filteredAudits = audits.filter(audit => {
    if (filter === 'critical') {
      return audit.riskLevel === 'HIGH_RISK' && audit.vulnerabilities?.some(v => v.severity === 'CRITICAL');
    }
    if (filter === 'high') {
      return audit.riskLevel === 'HIGH_RISK';
    }
    if (filter === 'medium') {
      return audit.riskLevel === 'MEDIUM_RISK';
    }
    return true;
  });

  const handleDeleteAudit = async (auditId) => {
    if (!window.confirm('Are you sure you want to delete this audit? This action cannot be undone.')) {
      return;
    }

    setIsDeletingId(auditId);
    try {
      const data = await adminApi.deleteAudit(auditId);

      if (data.success) {
        setAudits(audits.filter(a => a.auditId !== auditId));
        setSelectedAudit(null);
        showToast('Audit deleted successfully', 'success');
      } else {
        showToast('Failed to delete audit', 'error');
      }
    } catch (error) {
      console.error('Error deleting audit:', error);
      showToast(error.message || 'Error deleting audit', 'error');
    } finally {
      setIsDeletingId(null);
    }
  };

  const handleDeleteUser = async (userEmail) => {
    if (!window.confirm(`Are you sure you want to delete ${userEmail} and all their audit data? This action cannot be undone.`)) {
      return;
    }

    setIsDeletingId(userEmail);
    try {
      const data = await adminApi.deleteUser(userEmail);

      if (data.success) {
        setUsers(users.filter(u => u.email !== userEmail));
        setSelectedUser(null);
        showToast(`User ${userEmail} and all their data deleted successfully`, 'success');
        fetchAudits(); // Refresh audits count
      } else {
        showToast('Failed to delete user', 'error');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      showToast(error.message || 'Error deleting user', 'error');
    } finally {
      setIsDeletingId(null);
    }
  };

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH_RISK':
        return 'text-red-500 bg-red-500/10';
      case 'MEDIUM_RISK':
        return 'text-yellow-500 bg-yellow-500/10';
      case 'SECURE':
        return 'text-green-500 bg-green-500/10';
      default:
        return 'text-ice-white/60';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-red-600';
      case 'HIGH':
        return 'text-red-500';
      case 'MEDIUM':
        return 'text-yellow-500';
      case 'LOW':
        return 'text-blue-500';
      default:
        return 'text-ice-white/60';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-electric-blue mx-auto mb-4" />
          <p className="text-ice-white">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative z-10 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold glow-text mb-2">Admin Dashboard</h1>
          <p className="text-ice-white/60">Manage and monitor all smart contract audits and users</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm mb-1">Total Audits</p>
                <p className="text-3xl font-bold text-electric-blue">{stats.totalAudits}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-electric-blue/60" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm mb-1">Critical Issues</p>
                <p className="text-3xl font-bold text-red-500">{stats.criticalCount}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500/60" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm mb-1">High Risk</p>
                <p className="text-3xl font-bold text-yellow-500">{stats.highCount}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-500/60" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm mb-1">Avg Score</p>
                <p className="text-3xl font-bold text-stellar-blue">{stats.averageScore}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-stellar-blue/60" />
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-ice-white/60 text-sm mb-1">Total Users</p>
                <p className="text-3xl font-bold text-electric-blue">{stats.totalUsers}</p>
              </div>
              <Users className="w-8 h-8 text-electric-blue/60" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('audits')}
            className={`px-6 py-3 rounded-lg font-semibold transition ${
              activeTab === 'audits'
                ? 'btn-primary'
                : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
            }`}
          >
            Audit Management
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2 ${
              activeTab === 'users'
                ? 'btn-primary'
                : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
            }`}
          >
            <Users className="w-4 h-4" />
            User Management
          </button>
        </div>

        {/* Audits Tab */}
        {activeTab === 'audits' && (
          <>
            {/* Filter Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'all'
                    ? 'btn-primary'
                    : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
                }`}
              >
                All Audits
              </button>
              <button
                onClick={() => setFilter('critical')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'critical'
                    ? 'bg-red-500/20 border border-red-500 text-red-500'
                    : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
                }`}
              >
                Critical
              </button>
              <button
                onClick={() => setFilter('high')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'high'
                    ? 'bg-yellow-500/20 border border-yellow-500 text-yellow-500'
                    : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
                }`}
              >
                High Risk
              </button>
              <button
                onClick={() => setFilter('medium')}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === 'medium'
                    ? 'bg-blue-500/20 border border-blue-500 text-blue-500'
                    : 'bg-midnight-navy/50 border border-electric-blue/20 text-ice-white hover:border-electric-blue/60'
                }`}
              >
                Medium Risk
              </button>
            </div>

            {/* Audits Table */}
            <div className="glass-card rounded-xl overflow-hidden">
              {filteredAudits.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-ice-white/60">No audits found in this category</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-electric-blue/20">
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Contract Name</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Wallet Address</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Score</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Risk Level</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Vulnerabilities</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Created</th>
                        <th className="px-6 py-4 text-center text-sm font-semibold text-ice-white">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAudits.map((audit) => (
                        <tr key={audit.auditId} className="border-b border-electric-blue/10 hover:bg-electric-blue/5 transition">
                          <td className="px-6 py-4 text-ice-white text-sm">{audit.contractName}</td>
                          <td className="px-6 py-4 text-ice-white/70 text-sm font-mono">
                            {audit.walletAddress.substring(0, 8)}...{audit.walletAddress.substring(-6)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-stellar-blue font-semibold">{audit.score}</span>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRiskColor(audit.riskLevel)}`}>
                              {audit.riskLevel.replace(/_/g, ' ')}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {audit.vulnerabilities?.slice(0, 3).map((vuln, idx) => (
                                <span key={idx} className={`text-xs font-medium ${getSeverityColor(vuln.severity)}`}>
                                  {vuln.severity}
                                </span>
                              ))}
                              {audit.vulnerabilities?.length > 3 && (
                                <span className="text-xs text-ice-white/60">+{audit.vulnerabilities.length - 3}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-ice-white/70 text-sm">
                            {new Date(audit.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => setSelectedAudit(audit)}
                                className="p-2 bg-stellar-blue/20 hover:bg-stellar-blue/40 rounded-lg transition"
                                title="View Details"
                              >
                                <Eye className="w-4 h-4 text-stellar-blue" />
                              </button>
                              <button
                                onClick={() => handleDeleteAudit(audit.auditId)}
                                disabled={isDeletingId === audit.auditId}
                                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition disabled:opacity-50"
                                title="Delete Audit"
                              >
                                {isDeletingId === audit.auditId ? (
                                  <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="glass-card rounded-xl overflow-hidden">
            {users.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-ice-white/60">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-electric-blue/20">
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">User Email</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Name</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Audit Count</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-ice-white">Joined</th>
                      <th className="px-6 py-4 text-center text-sm font-semibold text-ice-white">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.email} className="border-b border-electric-blue/10 hover:bg-electric-blue/5 transition">
                        <td className="px-6 py-4 text-ice-white text-sm font-mono">{user.email}</td>
                        <td className="px-6 py-4 text-ice-white text-sm">{user.name}</td>
                        <td className="px-6 py-4">
                          <span className="text-stellar-blue font-semibold">{user.auditCount}</span>
                        </td>
                        <td className="px-6 py-4 text-ice-white/70 text-sm">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => setSelectedUser(user)}
                              className="p-2 bg-stellar-blue/20 hover:bg-stellar-blue/40 rounded-lg transition"
                              title="View User Details"
                            >
                              <Eye className="w-4 h-4 text-stellar-blue" />
                            </button>
                            <button
                              onClick={() => handleDeleteUser(user.email)}
                              disabled={isDeletingId === user.email}
                              className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-lg transition disabled:opacity-50"
                              title="Delete User & All Their Data"
                            >
                              {isDeletingId === user.email ? (
                                <Loader2 className="w-4 h-4 text-red-500 animate-spin" />
                              ) : (
                                <Trash2 className="w-4 h-4 text-red-500" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Audit Details Modal */}
        {selectedAudit && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ice-white mb-2">{selectedAudit.contractName}</h2>
                  <p className="text-ice-white/60 text-sm font-mono">{selectedAudit.auditId}</p>
                </div>
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="text-ice-white/60 hover:text-ice-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-ice-white/60 text-sm mb-1">Score</p>
                    <p className="text-2xl font-bold text-stellar-blue">{selectedAudit.score}</p>
                  </div>
                  <div>
                    <p className="text-ice-white/60 text-sm mb-1">Risk Level</p>
                    <p className={`font-semibold ${getRiskColor(selectedAudit.riskLevel)}`}>
                      {selectedAudit.riskLevel.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-ice-white/60 text-sm mb-2">Wallet Address</p>
                  <p className="text-ice-white font-mono text-sm break-all">{selectedAudit.walletAddress}</p>
                </div>

                <div>
                  <p className="text-ice-white/60 text-sm mb-2">Vulnerabilities ({selectedAudit.vulnerabilities?.length || 0})</p>
                  <div className="space-y-2">
                    {selectedAudit.vulnerabilities?.map((vuln, idx) => (
                      <div key={idx} className="bg-midnight-navy/50 border border-electric-blue/20 rounded-lg p-3">
                        <div className="flex items-start gap-2">
                          <span className={`font-bold text-xs mt-1 ${getSeverityColor(vuln.severity)}`}>
                            {vuln.severity}
                          </span>
                          <div className="flex-1">
                            <p className="font-semibold text-ice-white text-sm">{vuln.name}</p>
                            <p className="text-ice-white/70 text-xs mt-1">{vuln.description}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-ice-white/60 text-sm mb-2">Created</p>
                  <p className="text-ice-white">{new Date(selectedAudit.createdAt).toLocaleString()}</p>
                </div>

                <button
                  onClick={() => handleDeleteAudit(selectedAudit.auditId)}
                  disabled={isDeletingId === selectedAudit.auditId}
                  className="w-full bg-gradient-danger text-white py-2 rounded-lg font-semibold hover:opacity-80 transition disabled:opacity-50"
                >
                  {isDeletingId === selectedAudit.auditId ? (
                    <>
                      <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 inline-block mr-2" />
                      Delete This Audit
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Details Modal */}
        {selectedUser && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="glass-card rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-ice-white mb-2">{selectedUser.email}</h2>
                  <p className="text-ice-white/60 text-sm">{selectedUser.name}</p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="text-ice-white/60 hover:text-ice-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-ice-white/60 text-sm mb-1">Total Audits</p>
                    <p className="text-2xl font-bold text-stellar-blue">{selectedUser.auditCount}</p>
                  </div>
                  <div>
                    <p className="text-ice-white/60 text-sm mb-1">Joined</p>
                    <p className="text-ice-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                  <p className="text-red-500 text-sm font-semibold mb-2">⚠️ Delete User Account</p>
                  <p className="text-ice-white/70 text-sm mb-4">
                    Deleting this user will permanently remove their account and all {selectedUser.auditCount} associated audit records. This action cannot be undone.
                  </p>
                  <button
                    onClick={() => handleDeleteUser(selectedUser.email)}
                    disabled={isDeletingId === selectedUser.email}
                    className="w-full bg-gradient-danger text-white py-2 rounded-lg font-semibold hover:opacity-80 transition disabled:opacity-50"
                  >
                    {isDeletingId === selectedUser.email ? (
                      <>
                        <Loader2 className="w-4 h-4 inline-block mr-2 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 inline-block mr-2" />
                        Delete User & All Data
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
