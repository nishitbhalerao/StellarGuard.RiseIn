# Blockchain Storage Setup Guide

## ⚠️ Current Status
Your smart contract hasn't been deployed yet. The "Store on Blockchain" feature will gracefully skip blockchain storage and keep audits saved locally.

## What's Fixed

✅ **Better Error Handling**: No more crashes when storing on blockchain
✅ **Graceful Fallback**: If contract not deployed, saves locally instead
✅ **User-Friendly Messages**: Clear instructions on what to do next
✅ **Wallet Validation**: Checks for proper wallet setup

## How to Enable Blockchain Storage

### Option 1: Deploy Contract Now (Recommended)

#### Step 1: Build the Smart Contract
```bash
cd contracts/data_storage
cargo build --release --target wasm32-unknown-unknown
```

#### Step 2: Deploy to Soroban Testnet
```bash
# Install Soroban CLI (if not already installed)
cargo install soroban-cli

# Fund your account on testnet (visit: https://stellar.org/developers/testnet-lab)

# Deploy the contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account your_key_name \
  --network testnet

# Copy the contract ID from output (looks like: CDATA7Z2Z7AE...)
```

#### Step 3: Update .env File
Edit your `.env` file:
```env
VITE_API_URL=http://localhost:3000
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QX...  # Your deployed contract ID
```

#### Step 4: Restart Development Server
```bash
# Restart frontend
npm run dev

# New browser tab, restart backend
cd backend
npm start
```

#### Step 5: Connect Wallet & Test
1. Open app: `http://localhost:5173`
2. Install Freighter wallet: https://www.freighter.app/
3. Create testnet account
4. Click "Connect Wallet"
5. Upload contract for audit
6. Click "Store on Blockchain" button
7. Sign transaction in Freighter

### Option 2: Continue Without Blockchain (For Now)

If you're not ready to deploy the contract yet:

✅ **Audits are saved in MongoDB locally**
✅ **All features work normally**
✅ **You can deploy contract later**
✅ **No blockchain storage needed for testing**

## Troubleshooting

### "Smart contract not deployed yet" Message
- **Cause**: .env still has placeholder `VITE_CONTRACT_ID`
- **Fix**: Set actual contract ID after deployment
- **Status**: ✅ Working - audits saved locally

### "Wallet not connected" Error
- **Cause**: User didn't click Connect Wallet button
- **Fix**: Click "Connect Wallet" button first
- **Requirement**: Need Freighter wallet installed

### "Account not found on Stellar testnet"
- **Cause**: Wallet account not funded with XLM
- **Fix**: Visit https://stellar.org/developers/testnet-lab and fund account
- **Amount**: 10 XLM is typically enough for testing

### "Failed to sign transaction"
- **Cause**: User rejected signature in Freighter popup
- **Fix**: Open Freighter wallet and approve the transaction
- **Status**: Safe - no money will be sent

## Architecture

```
┌─────────────────┐
│  Audit Report   │ ← User uploads contract
└────────┬────────┘
         │
    ┌────▼────┐
    │ Audit   │ ← Creates audit report (local)
    │ Service │
    └────┬────┘
         │
  Blockchain Storage (Optional)
  ├─ If Contract Deployed → Store on Soroban
  └─ If Not Deployed → Save Locally ✓
         │
    ┌────▼────────┐
    │  MongoDB    │ ← Always saved here
    │  Database   │
    └─────────────┘
```

## Environment Variables

### VITE_SOROBAN_RPC_URL
- **Current**: `https://soroban-testnet.stellar.org`
- **Purpose**: Connect to Stellar Soroban testnet
- **Change**: Only if using different network

### VITE_NETWORK_PASSPHRASE
- **Current**: `Test SDF Network ; September 2015`
- **Purpose**: Identifies Stella testnet
- **Change**: Only if using different network

### VITE_CONTRACT_ID
- **Current**: `your_deployed_contract_id_here` (placeholder)
- **Purpose**: Points to deployed smart contract
- **Change**: **Must update after contract deployment**

### VITE_API_URL
- **Current**: `http://localhost:3000`
- **Purpose**: Backend API endpoint
- **Change**: Update for production

## Production Deployment

When ready for mainnet:

1. **Deploy contract to mainnet**:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account your_key_name \
  --network mainnet
```

2. **Update .env for mainnet**:
```env
VITE_SOROBAN_RPC_URL=https://soroban-mainnet.stellar.org
VITE_NETWORK_PASSPHRASE=Public Global Stellar Network ; September 2015
VITE_CONTRACT_ID=your_mainnet_contract_id
```

3. **Security checklist**:
- [ ] Contract audited by security professionals
- [ ] Extensively tested on testnet
- [ ] Private keys secured and backed up
- [ ] Documentation reviewed
- [ ] Monitoring and alerting set up

## API Endpoints

### Blockchain Status IN .env
- **Location**: Root `.env` file
- **Format**: Environment variables with `VITE_` prefix
- **Reload Required**: Yes, must restart dev server after changes

### Smart Contract Methods
Once deployed, available at:
- `store_audit_hash(wallet, contractName, reportHash)`
- `get_audit(auditId)`
- `get_audits_by_wallet(wallet)`
- `update_data(wallet, dataId, newValue)`
- `delete_data(wallet, dataId)`

See [contracts/data_storage/README.md](contracts/data_storage/README.md) for full API

## Testing Checklist

- [ ] App works without contract ID (locally)
- [ ] Wallet connects with Freighter
- [ ] Can upload contracts for audit
- [ ] Audit reports generate correctly
- [ ] Can deploy contract to testnet
- [ ] Contract ID added to .env
- [ ] Dev server restarted
- [ ] "Store on Blockchain" button works
- [ ] Transaction signs successfully
- [ ] Audit appears on-chain

## FAQ

**Q: Do I need blockchain storage to use StellarGuard?**
A: No! Audits work perfectly fine stored locally in MongoDB. Blockchain is optional.

**Q: What if I deploy contract later?**
A: Just update .env with contract ID and restart. Existing local audits stay as-is.

**Q: Can I test without Freighter wallet?**
A: Yes! But "Store on Blockchain" button will be disabled. Local storage still works.

**Q: What happens if contract deployment fails?**
A: App continues working. Just can't store on blockchain. Local storage still works.

**Q: How much does it cost?**
A: Stellar transactions are nearly free (~1 stroops = $0.0000001 XLM). Testnet is free.

**Q: Can I migrate audits to blockchain later?**
A: Yes! Deploy contract, update .env, and use "Store on Blockchain" button for each audit.

## Resources

- **Stellar Docs**: https://developers.stellar.org
- **Soroban Docs**: https://soroban.stellar.org
- **Freighter Wallet**: https://www.freighter.app/
- **Testnet Faucet**: https://stellar.org/developers/testnet-lab
- **Contract Code**: [contracts/data_storage/](contracts/data_storage/)

## Current Deployment Status

```
Smart Contract: ❌ Not deployed (placeholder in .env)
Local Storage:  ✅ Working (MongoDB)
Blockchain:     ⏳ Ready to configure
Audits:         ✅ Saved locally
User Accounts:  ✅ Working
Admin Panel:    ✅ Working
```

---

**Next Steps**:
1. ✅ Use app normally (all features work)
2. ⏳ (Optional) Deploy contract when ready
3. ⏳ (Optional) Update .env with contract ID
4. ⏳ (Optional) Enable blockchain storage

The app is fully functional without blockchain storage!
