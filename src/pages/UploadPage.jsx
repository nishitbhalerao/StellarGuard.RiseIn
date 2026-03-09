import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github, Loader2 } from 'lucide-react';
import { createAudit } from '../services/apiService';
import { useWallet } from '../context/WalletContext';
import { useToast } from '../context/ToastContext';

export default function UploadPage() {
  const [contractCode, setContractCode] = useState('');
  const [contractName, setContractName] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const navigate = useNavigate();
  const { publicKey } = useWallet();
  const { showToast } = useToast();

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setContractCode(event.target.result);
        setContractName(file.name.replace('.rs', ''));
      };
      reader.readAsText(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setContractCode(event.target.result);
        setContractName(file.name.replace('.rs', ''));
      };
      reader.readAsText(file);
    }
  };

  const handleAnalyze = async () => {
    if (!contractCode || !contractName) {
      showToast('Please provide contract code and name', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createAudit(contractCode, contractName, publicKey || 'anonymous');
      
      if (result.success) {
        showToast('Audit completed successfully', 'success');
        navigate(`/report/${result.data.auditId}`);
      } else {
        showToast('Audit failed', 'error');
      }
    } catch (error) {
      console.error('Audit error:', error);
      showToast('Failed to analyze contract', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 glow-text">Upload Smart Contract</h1>
        <p className="text-ice-white/70">Upload your Soroban contract for security analysis</p>
      </div>

      <div className="glass-card p-8 rounded-2xl space-y-6">
        {/* Contract Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Contract Name</label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="my_contract"
            className="w-full px-4 py-3 bg-midnight-navy/50 border border-electric-blue/30 rounded-lg focus:outline-none focus:border-stellar-blue transition"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium mb-2">Upload Contract File</label>
          <div
            className={`border-2 border-dashed rounded-lg p-12 text-center transition ${
              dragActive ? 'border-stellar-blue bg-electric-blue/10' : 'border-electric-blue/30'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-electric-blue" />
            <p className="text-ice-white/70 mb-2">Drag and drop your .rs file here</p>
            <p className="text-ice-white/50 text-sm mb-4">or</p>
            <label className="btn-primary cursor-pointer inline-block">
              Browse Files
              <input
                type="file"
                accept=".rs"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* GitHub URL */}
        <div>
          <label className="block text-sm font-medium mb-2">Or GitHub Repository URL</label>
          <div className="flex space-x-2">
            <Github className="w-10 h-10 text-electric-blue" />
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 px-4 py-3 bg-midnight-navy/50 border border-electric-blue/30 rounded-lg focus:outline-none focus:border-stellar-blue transition"
            />
          </div>
        </div>

        {/* Code Preview */}
        {contractCode && (
          <div>
            <label className="block text-sm font-medium mb-2">Contract Code Preview</label>
            <textarea
              value={contractCode}
              onChange={(e) => setContractCode(e.target.value)}
              rows={10}
              className="w-full px-4 py-3 bg-midnight-navy/50 border border-electric-blue/30 rounded-lg focus:outline-none focus:border-stellar-blue transition font-mono text-sm"
            />
          </div>
        )}

        {/* Analyze Button */}
        <button
          onClick={handleAnalyze}
          disabled={!contractCode || !contractName || isLoading}
          className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Scanning contract...</span>
            </>
          ) : (
            <span>Analyze Contract</span>
          )}
        </button>
      </div>
    </div>
  );
}
