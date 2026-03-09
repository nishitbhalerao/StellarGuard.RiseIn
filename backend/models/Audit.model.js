import mongoose from 'mongoose';

const vulnerabilitySchema = new mongoose.Schema({
  id: String,
  name: String,
  severity: {
    type: String,
    enum: ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  },
  line: Number,
  description: String,
  recommendation: String
});

const auditSchema = new mongoose.Schema({
  auditId: {
    type: String,
    required: true,
    unique: true
  },
  walletAddress: {
    type: String,
    required: true,
    index: true
  },
  contractName: {
    type: String,
    required: true
  },
  contractCode: {
    type: String,
    required: true
  },
  vulnerabilities: [vulnerabilitySchema],
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskLevel: {
    type: String,
    enum: ['SECURE', 'MEDIUM_RISK', 'HIGH_RISK'],
    required: true
  },
  reportHash: String,
  blockchainTxHash: String,
  storedOnChain: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Audit', auditSchema);
