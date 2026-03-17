import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AlertTriangle, CheckCircle, Download, Link as LinkIcon } from 'lucide-react';
import ScoreGauge from '../components/ScoreGauge';
import { getAudit, updateBlockchainHash } from '../services/apiService';
import { storeAuditOnChain } from '../services/stellarService';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

export default function AuditReport() {
  const { auditId } = useParams();
  const [audit, setAudit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStoring, setIsStoring] = useState(false);
  const [expandedVuln, setExpandedVuln] = useState(null);
  
  const { publicKey, isConnected } = useWallet();
  const { showToast } = useToast();

  useEffect(() => {
    loadAudit();
  }, [auditId]);

  const loadAudit = async () => {
    try {
      const result = await getAudit(auditId);
      if (result.success) {
        setAudit(result.data);
      }
    } catch (error) {
      console.error('Load audit error:', error);
      showToast('Failed to load audit', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStoreOnChain = async () => {
    if (!isConnected) {
      showToast('Please connect your wallet first', 'error');
      return;
    }

    setIsStoring(true);
    try {
      const result = await storeAuditOnChain(
        publicKey,
        audit.contractName,
        audit.reportHash
      );
      
      // Handle case where contract is not deployed yet
      if (result && !result.success) {
        showToast(result.message || 'Smart contract not configured yet', 'info');
        return;
      }

      // Handle successful blockchain storage
      if (result && result.hash) {
        await updateBlockchainHash(auditId, result.hash);
        showToast('✓ Audit stored on blockchain successfully!', 'success');
        loadAudit();
      }
    } catch (error) {
      console.error('Store on chain error:', error);
      const errorMessage = error.message || 'Failed to store audit on blockchain';
      
      // Provide user-friendly error messages
      if (errorMessage.includes('Wallet not connected')) {
        showToast('Please connect your wallet to store on blockchain', 'error');
      } else if (errorMessage.includes('account not found')) {
        showToast('Wallet not funded. Please fund with testnet XLM: https://stellar.org/developers/testnet-lab', 'error');
      } else if (errorMessage.includes('not properly configured')) {
        showToast('Smart contract not deployed yet. Audits are saved locally.', 'info');
      } else {
        showToast(errorMessage, 'error');
      }
    } finally {
      setIsStoring(false);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: 'bg-gradient-danger',
      HIGH: 'bg-gradient-warning',
      MEDIUM: 'bg-yellow-500/20 text-yellow-400',
      LOW: 'bg-blue-500/20 text-blue-400'
    };
    return colors[severity] || '';
  };

  const getRiskBadge = (riskLevel) => {
    const badges = {
      SECURE: { text: 'SECURE', class: 'bg-gradient-success' },
      MEDIUM_RISK: { text: 'MEDIUM RISK', class: 'bg-gradient-warning' },
      HIGH_RISK: { text: 'HIGH RISK', class: 'bg-gradient-danger' }
    };
    return badges[riskLevel] || badges.SECURE;
  };

  if (isLoading) {
    return (
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-xl">Loading audit report...</div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="text-xl">Audit not found</div>
      </div>
    );
  }

  const counts = {
    CRITICAL: audit.vulnerabilities.filter(v => v.severity === 'CRITICAL').length,
    HIGH: audit.vulnerabilities.filter(v => v.severity === 'HIGH').length,
    MEDIUM: audit.vulnerabilities.filter(v => v.severity === 'MEDIUM').length,
    LOW: audit.vulnerabilities.filter(v => v.severity === 'LOW').length
  };

  const riskBadge = getRiskBadge(audit.riskLevel);

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-2 glow-text">{audit.contractName}</h1>
        <p className="text-ice-white/60">
          Audited on {new Date(audit.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Score Section */}
      <div className="glass-card p-8 rounded-2xl mb-8">
        <ScoreGauge score={audit.score} riskLevel={audit.riskLevel} />
        
        <div className="text-center mt-6">
          <span className={`${riskBadge.class} px-6 py-2 rounded-full text-sm font-semibold inline-block`}>
            {riskBadge.text}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-red-400">{counts.CRITICAL}</div>
            <div className="text-sm text-ice-white/60">Critical</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-400">{counts.HIGH}</div>
            <div className="text-sm text-ice-white/60">High</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{counts.MEDIUM}</div>
            <div className="text-sm text-ice-white/60">Medium</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400">{counts.LOW}</div>
            <div className="text-sm text-ice-white/60">Low</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleStoreOnChain}
          disabled={audit.storedOnChain || isStoring}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50"
        >
          <LinkIcon className="w-4 h-4" />
          <span>{audit.storedOnChain ? 'Stored on Chain' : 'Store on Blockchain'}</span>
        </button>
        
        <button className="px-6 py-3 bg-gradient-card border border-electric-blue/30 rounded-lg hover:border-stellar-blue/60 transition flex items-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Blockchain Status */}
      {audit.storedOnChain && (
        <div className="glass-card p-4 rounded-lg mb-8 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5 text-green-400" />
          <div className="flex-1">
            <div className="text-sm font-medium">Verified on Stellar Blockchain</div>
            <div className="text-xs text-ice-white/60 truncate">TX: {audit.blockchainTxHash}</div>
          </div>
        </div>
      )}

      {/* Vulnerabilities */}
      <div className="glass-card p-8 rounded-2xl">
        <h2 className="text-2xl font-bold mb-6">Vulnerabilities Found</h2>
        
        {audit.vulnerabilities.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <p className="text-xl">No vulnerabilities detected!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {audit.vulnerabilities.map((vuln, index) => (
              <div
                key={index}
                className="border border-electric-blue/20 rounded-lg p-4 hover:border-stellar-blue/40 transition cursor-pointer"
                onClick={() => setExpandedVuln(expandedVuln === index ? null : index)}
              >
                <div className="flex items-start space-x-4">
                  <AlertTriangle className="w-5 h-5 text-orange-400 mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className={`${getSeverityColor(vuln.severity)} px-3 py-1 rounded text-xs font-semibold`}>
                        {vuln.severity}
                      </span>
                      <span className="text-ice-white/60 text-sm">Line {vuln.line}</span>
                    </div>
                    <h3 className="font-semibold mb-1">{vuln.name}</h3>
                    <p className="text-ice-white/70 text-sm">{vuln.description}</p>
                    
                    {expandedVuln === index && (
                      <div className="mt-4 pt-4 border-t border-electric-blue/20">
                        <div className="text-sm font-medium mb-2">Recommendation:</div>
                        <p className="text-ice-white/70 text-sm">{vuln.recommendation}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
