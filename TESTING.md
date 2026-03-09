# Testing Guide

## Testing the Application

### 1. Test with Sample Contracts

We've included two sample contracts for testing:

#### Vulnerable Token (`sample_contracts/vulnerable_token.rs`)
This contract contains multiple vulnerabilities:
- Missing authorization checks
- No overflow protection
- Missing balance validation
- Unsafe unwrap usage
- Missing access control

Expected Result: Low security score (30-40), HIGH_RISK level

#### Secure Token (`sample_contracts/secure_token.rs`)
This contract follows best practices:
- Proper authorization with `require_auth()`
- Checked arithmetic operations
- Balance validation before transfers
- Proper error handling
- Admin access control

Expected Result: High security score (85-100), SECURE level

### 2. Upload and Test

1. Start the application (see DEPLOYMENT.md)
2. Navigate to http://localhost:5173
3. Click "Start Audit" or go to Upload page
4. Upload one of the sample contracts
5. Click "Analyze Contract"
6. Review the generated report

### 3. Test Wallet Integration

1. Install Freighter wallet extension
2. Switch to Testnet in Freighter settings
3. Fund your account at https://laboratory.stellar.org/#account-creator?network=test
4. Click "Connect Wallet" in StellarGuard
5. Approve connection in Freighter popup

### 4. Test Blockchain Storage

1. Complete an audit (with wallet connected)
2. On the report page, click "Store on Blockchain"
3. Approve transaction in Freighter
4. Wait for confirmation
5. Verify transaction hash is displayed

### 5. Test Dashboard

1. Connect wallet
2. Navigate to Dashboard
3. View audit history
4. Check statistics and charts
5. Click "View" on any audit to see details

## API Testing

### Using curl

```bash
# Create audit
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "contractCode": "pub fn test() {}",
    "contractName": "test_contract",
    "walletAddress": "GXXXXXXX"
  }'

# Get audit
curl http://localhost:3000/api/audit/<audit_id>

# Get wallet audits
curl http://localhost:3000/api/audit/wallet/<wallet_address>
```

## Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in backend/.env

### Freighter Not Detected
- Install Freighter extension
- Refresh the page
- Check browser console for errors

### Contract Deployment Failed
- Verify Stellar CLI is installed
- Check account is funded
- Ensure correct network configuration

### API CORS Error
- Verify backend is running on port 3000
- Check VITE_API_URL in .env
- Ensure CORS is enabled in backend
