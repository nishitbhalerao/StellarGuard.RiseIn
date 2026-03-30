import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Github, Loader2, Shield, Zap, Lock, CheckCircle } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-gradient">Upload Smart Contract</h1>
        <p className="text-xl text-gray-600">Upload your Soroban contract for comprehensive security analysis</p>
      </div>

      <div className="card p-8 space-y-8">
        {/* Contract Name */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-800">Contract Name</label>
          <input
            type="text"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            placeholder="my_contract"
            className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-gray-800"
          />
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-semibold mb-3 text-gray-800">Upload Contract File</label>
          <div
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all hover-lift ${
              dragActive 
                ? 'border-blue-600 bg-blue-50 shadow-lg' 
                : 'border-gray-300 hover:border-blue-600 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-16 h-16 mx-auto mb-6 text-blue-600" />
            <p className="text-gray-800 font-medium mb-2">Drag and drop your .rs file here</p>
            <p className="text-gray-600 text-sm mb-6">Supports Rust smart contract files (.rs)</p>
            <label className="btn-primary cursor-pointer inline-block hover-lift">
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
          <label className="block text-sm font-semibold mb-3 text-gray-800">Or Import from GitHub</label>
          <div className="flex items-center space-x-4 p-4 bg-light-gray rounded-lg border">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Github className="w-6 h-6 text-white" />
            </div>
            <input
              type="text"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/user/repo"
              className="flex-1 px-4 py-3 bg-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors text-gray-800"
            />
          </div>
        </div>

        {/* Code Preview */}
        {contractCode && (
          <div>
            <label className="block text-sm font-semibold mb-3 text-gray-800">Contract Code Preview</label>
            <div className="relative">
              <textarea
                value={contractCode}
                onChange={(e) => setContractCode(e.target.value)}
                rows={12}
                className="w-full px-4 py-4 bg-gray-900 text-white border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-600 transition-colors font-mono text-sm resize-none"
                style={{ backgroundColor: '#1f2937' }}
              />
              <div className="absolute top-3 right-3 text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                Rust
              </div>
            </div>
          </div>
        )}

        {/* Analyze Button */}
        <div className="pt-4">
          <button
            onClick={handleAnalyze}
            disabled={!contractCode || !contractName || isLoading}
            className="w-full btn-primary py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 hover-lift"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>Analyzing Contract...</span>
              </>
            ) : (
              <>
                <Shield className="w-6 h-6" />
                <span>Start Security Analysis</span>
              </>
            )}
          </button>
          
          {!isLoading && (
            <p className="text-center text-sm text-gray-600 mt-3">
              Analysis typically takes 10-30 seconds depending on contract complexity
            </p>
          )}
        </div>
      </div>

      {/* Features Info */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-gradient-primary rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Lightning Fast</h3>
          <p className="text-sm text-gray-600">Get detailed results in seconds</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Comprehensive</h3>
          <p className="text-sm text-gray-600">12+ vulnerability types detected</p>
        </div>
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-4 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 mb-2">Blockchain Verified</h3>
          <p className="text-sm text-gray-600">Store results on Stellar</p>
        </div>
      </div>
    </div>
  );
}
