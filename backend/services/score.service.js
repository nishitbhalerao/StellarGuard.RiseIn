const SEVERITY_WEIGHTS = {
  CRITICAL: 25,
  HIGH: 15,
  MEDIUM: 8,
  LOW: 3
};

export function calculateScore(vulnerabilities) {
  let deductions = 0;
  
  const counts = {
    CRITICAL: 0,
    HIGH: 0,
    MEDIUM: 0,
    LOW: 0
  };
  
  vulnerabilities.forEach(vuln => {
    counts[vuln.severity]++;
    deductions += SEVERITY_WEIGHTS[vuln.severity];
  });
  
  const score = Math.max(0, 100 - deductions);
  
  let riskLevel;
  if (score >= 80) {
    riskLevel = 'SECURE';
  } else if (score >= 50) {
    riskLevel = 'MEDIUM_RISK';
  } else {
    riskLevel = 'HIGH_RISK';
  }
  
  return {
    score,
    riskLevel,
    counts
  };
}

export async function generateReportHash(auditData) {
  const crypto = await import('crypto');
  const data = JSON.stringify({
    contractName: auditData.contractName,
    score: auditData.score,
    vulnerabilities: auditData.vulnerabilities,
    timestamp: auditData.createdAt
  });
  
  return crypto.createHash('sha256').update(data).digest('hex');
}
