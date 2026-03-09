export const vulnerabilityRules = [
  {
    id: 'AUTH_001',
    name: 'Missing Authorization Check',
    severity: 'CRITICAL',
    pattern: /(fn\s+(mint|transfer|burn|withdraw)[^{]*\{(?:(?!require_auth).)*?\})/gs,
    check: (code) => {
      const sensitiveOps = ['mint', 'transfer', 'burn', 'withdraw', 'set_admin'];
      const results = [];
      
      sensitiveOps.forEach(op => {
        const fnRegex = new RegExp(`fn\\s+${op}[^{]*\\{([^}]+)\\}`, 'gs');
        const matches = [...code.matchAll(fnRegex)];
        
        matches.forEach(match => {
          if (!match[1].includes('require_auth')) {
            const line = code.substring(0, match.index).split('\n').length;
            results.push({
              line,
              description: `Function '${op}' performs sensitive operation without authorization check`,
              recommendation: `Add require_auth() call before ${op} operation`
            });
          }
        });
      });
      
      return results;
    }
  },
  {
    id: 'MATH_001',
    name: 'Integer Overflow/Underflow Risk',
    severity: 'HIGH',
    check: (code) => {
      const results = [];
      const unsafeOps = /(\w+)\s*([+\-*])\s*(\w+)/g;
      const lines = code.split('\n');
      
      lines.forEach((line, idx) => {
        if (line.match(unsafeOps) && 
            !line.includes('checked_add') && 
            !line.includes('checked_sub') && 
            !line.includes('checked_mul') &&
            !line.includes('saturating_')) {
          if (line.includes('balance') || line.includes('amount') || line.includes('supply')) {
            results.push({
              line: idx + 1,
              description: 'Arithmetic operation without overflow protection',
              recommendation: 'Use checked_add(), checked_sub(), or saturating_* methods'
            });
          }
        }
      });
      
      return results;
    }
  },
  {
    id: 'BAL_001',
    name: 'Missing Balance Validation',
    severity: 'CRITICAL',
    check: (code) => {
      const results = [];
      const lines = code.split('\n');
      
      lines.forEach((line, idx) => {
        if ((line.includes('transfer') || line.includes('withdraw')) && 
            line.includes('amount')) {
          const contextStart = Math.max(0, idx - 3);
          const contextEnd = Math.min(lines.length, idx + 3);
          const context = lines.slice(contextStart, contextEnd).join('\n');
          
          if (!context.includes('balance') || !context.includes('>=')) {
            results.push({
              line: idx + 1,
              description: 'Transfer/withdrawal without balance validation',
              recommendation: 'Check that balance >= amount before transfer'
            });
          }
        }
      });
      
      return results;
    }
  },
  {
    id: 'INPUT_001',
    name: 'Improper Input Validation',
    severity: 'MEDIUM',
    check: (code) => {
      const results = [];
      const fnRegex = /pub\s+fn\s+(\w+)\s*\([^)]*\)\s*\{([^}]+)\}/gs;
      const matches = [...code.matchAll(fnRegex)];
      
      matches.forEach(match => {
        const fnBody = match[2];
        const hasParams = match[0].includes('amount') || match[0].includes('address');
        
        if (hasParams && !fnBody.includes('require') && !fnBody.includes('assert') && !fnBody.includes('if')) {
          const line = code.substring(0, match.index).split('\n').length;
          results.push({
            line,
            description: `Function '${match[1]}' accepts parameters without validation`,
            recommendation: 'Add input validation checks for parameters'
          });
        }
      });
      
      return results;
    }
  },
  {
    id: 'ERR_001',
    name: 'Unsafe Unwrap Usage',
    severity: 'MEDIUM',
    check: (code) => {
      const results = [];
      const lines = code.split('\n');
      
      lines.forEach((line, idx) => {
        if (line.includes('.unwrap()') && !line.includes('//')) {
          results.push({
            line: idx + 1,
            description: 'Using .unwrap() can cause panic if value is None',
            recommendation: 'Use proper error handling with match or ? operator'
          });
        }
      });
      
      return results;
    }
  },
  {
    id: 'ACCESS_001',
    name: 'Missing Access Control',
    severity: 'HIGH',
    check: (code) => {
      const results = [];
      const adminFns = ['set_admin', 'pause', 'upgrade', 'set_config'];
      
      adminFns.forEach(fn => {
        const fnRegex = new RegExp(`fn\\s+${fn}[^{]*\\{([^}]+)\\}`, 'gs');
        const matches = [...code.matchAll(fnRegex)];
        
        matches.forEach(match => {
          if (!match[1].includes('admin') && !match[1].includes('owner')) {
            const line = code.substring(0, match.index).split('\n').length;
            results.push({
              line,
              description: `Admin function '${fn}' lacks access control`,
              recommendation: 'Add admin/owner verification before executing'
            });
          }
        });
      });
      
      return results;
    }
  },
  {
    id: 'REEN_001',
    name: 'Potential Reentrancy Risk',
    severity: 'HIGH',
    check: (code) => {
      const results = [];
      const lines = code.split('\n');
      
      lines.forEach((line, idx) => {
        if (line.includes('invoke_contract') || line.includes('call_contract')) {
          const afterCall = lines.slice(idx + 1, idx + 5).join('\n');
          if (afterCall.includes('balance') || afterCall.includes('state')) {
            results.push({
              line: idx + 1,
              description: 'State modification after external call (reentrancy risk)',
              recommendation: 'Update state before making external calls'
            });
          }
        }
      });
      
      return results;
    }
  }
];

export function analyzeContract(contractCode) {
  const vulnerabilities = [];
  
  vulnerabilityRules.forEach(rule => {
    const findings = rule.check(contractCode);
    findings.forEach(finding => {
      vulnerabilities.push({
        id: rule.id,
        name: rule.name,
        severity: rule.severity,
        line: finding.line,
        description: finding.description,
        recommendation: finding.recommendation
      });
    });
  });
  
  return vulnerabilities;
}
