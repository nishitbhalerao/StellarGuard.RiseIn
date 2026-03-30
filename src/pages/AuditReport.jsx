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
      CRITICAL: 'bg-error-red text-white',
      HIGH: 'bg-warning-orange text-white',
      MEDIUM: 'bg-yellow-500 text-white',
      LOW: 'bg-secondary-blue text-white'
    };
    return colors[severity] || '';
  };

  const getRiskBadge = (riskLevel) => {
    const badges = {
      SECURE: { text: 'SECURE', class: 'bg-gradient-to-r from-green-500 to-green-600 text-white' },
      MEDIUM_RISK: { text: 'MEDIUM RISK', class: 'bg-orange-500 text-white' },
      HIGH_RISK: { text: 'HIGH RISK', class: 'bg-red-500 text-white' }
    };
    return badges[riskLevel] || badges.SECURE;
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="card p-12">
          <div className="text-xl text-dark-gray">Loading audit report...</div>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <div className="card p-12">
          <div className="text-xl text-dark-gray">Audit not found</div>
        </div>
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gradient">{audit.contractName}</h1>
        <p className="text-gray-600 text-lg">
          Security Audit Report • {new Date(audit.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Score Section */}
      <div className="card p-8 mb-8 hover-lift">
        <ScoreGauge score={audit.score} riskLevel={audit.riskLevel} />
        
        <div className="text-center mt-8">
          <span className={`${riskBadge.class} px-8 py-3 rounded-full text-sm font-semibold inline-block shadow-medium`}>
            {riskBadge.text}
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-10">
          <div className="text-center p-4 bg-light-gray rounded-lg">
            <div className="text-3xl font-bold text-error-red mb-1">{counts.CRITICAL}</div>
            <div className="text-sm text-gray-600 font-medium">Critical</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-orange-500 mb-1">{counts.HIGH}</div>
            <div className="text-sm text-gray-600 font-medium">High</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-500 mb-1">{counts.MEDIUM}</div>
            <div className="text-sm text-gray-600 font-medium">Medium</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-500 mb-1">{counts.LOW}</div>
            <div className="text-sm text-gray-600 font-medium">Low</div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={handleStoreOnChain}
          disabled={audit.storedOnChain || isStoring}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 hover-lift"
        >
          <LinkIcon className="w-4 h-4" />
          <span>{audit.storedOnChain ? 'Stored on Chain' : 'Store on Blockchain'}</span>
        </button>
        
        <button className="btn-secondary flex items-center space-x-2 hover-lift">
          <Download className="w-4 h-4" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* Blockchain Status */}
      {audit.storedOnChain && (
        <div className="card p-6 mb-8 flex items-center space-x-4 bg-green-50 border-green-200">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <div className="font-semibold text-gray-800">Verified on Stellar Blockchain</div>
            <div className="text-sm text-gray-600 truncate">Transaction: {audit.blockchainTxHash}</div>
          </div>
        </div>
      )}

      {/* Vulnerabilities */}
      <div className="card p-8 hover-lift">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Security Analysis Results</h2>
        
        {audit.vulnerabilities.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Vulnerabilities Detected!</h3>
            <p className="text-gray-600">Your smart contract passed all security checks</p>
          </div>
        ) : (
          <div className="space-y-4">
            {audit.vulnerabilities.map((vuln, index) => (
              <div
                key={index}
                className="border-2 border-gray-200 rounded-xl p-6 hover:border-blue-600 hover:shadow-lg transition-all cursor-pointer hover-lift"
                onClick={() => setExpandedVuln(expandedVuln === index ? null : index)}
              >
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <AlertTriangle className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <span className={`${getSeverityColor(vuln.severity)} px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide`}>
                        {vuln.severity}
                      </span>
                      <span className="text-gray-600 text-sm font-medium">Line {vuln.line}</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{vuln.name}</h3>
                    <p className="text-gray-600 leading-relaxed">{vuln.description}</p>
                    
                    {expandedVuln === index && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm font-semibold text-gray-800 mb-2">💡 Recommendation:</div>
                          <p className="text-gray-600 text-sm leading-relaxed">{vuln.recommendation}</p>
                        </div>
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
