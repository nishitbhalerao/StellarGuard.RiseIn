import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import Audit from '../models/Audit.model.js';
import { analyzeContract } from '../services/analyzer.service.js';
import { calculateScore, generateReportHash } from '../services/score.service.js';

const router = express.Router();

// Create new audit
router.post('/', async (req, res) => {
  try {
    const { contractCode, contractName, walletAddress } = req.body;
    
    if (!contractCode || !contractName) {
      return res.status(400).json({
        success: false,
        error: 'Contract code and name are required'
      });
    }
    
    // Analyze contract
    const vulnerabilities = analyzeContract(contractCode);
    
    // Calculate score
    const { score, riskLevel, counts } = calculateScore(vulnerabilities);
    
    // Create audit record
    const auditId = uuidv4();
    const audit = new Audit({
      auditId,
      walletAddress: walletAddress || 'anonymous',
      contractName,
      contractCode,
      vulnerabilities,
      score,
      riskLevel
    });
    
    // Generate report hash
    audit.reportHash = await generateReportHash(audit);
    
    await audit.save();
    
    res.json({
      success: true,
      data: {
        auditId,
        score,
        riskLevel,
        vulnerabilities,
        counts,
        reportHash: audit.reportHash,
        createdAt: audit.createdAt
      }
    });
  } catch (error) {
    console.error('Audit creation error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create audit'
    });
  }
});

// Get audit by ID
router.get('/:auditId', async (req, res) => {
  try {
    const audit = await Audit.findOne({ auditId: req.params.auditId });
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }
    
    res.json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error('Fetch audit error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audit'
    });
  }
});

// Get audits by wallet address
router.get('/wallet/:walletAddress', async (req, res) => {
  try {
    const audits = await Audit.find({ 
      walletAddress: req.params.walletAddress 
    }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: audits
    });
  } catch (error) {
    console.error('Fetch wallet audits error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch audits'
    });
  }
});

// Update blockchain transaction hash
router.patch('/:auditId/blockchain', async (req, res) => {
  try {
    const { txHash } = req.body;
    
    const audit = await Audit.findOneAndUpdate(
      { auditId: req.params.auditId },
      { 
        blockchainTxHash: txHash,
        storedOnChain: true
      },
      { new: true }
    );
    
    if (!audit) {
      return res.status(404).json({
        success: false,
        error: 'Audit not found'
      });
    }
    
    res.json({
      success: true,
      data: audit
    });
  } catch (error) {
    console.error('Update blockchain hash error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update blockchain hash'
    });
  }
});

export default router;
