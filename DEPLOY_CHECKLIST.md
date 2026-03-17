# Deploy Smart Contract - Final Checklist

Follow this checklist to deploy your contract in ~10 minutes.

## ✅ Before You Start

- [ ] Have VS Code open with StellarGuard project
- [ ] Have PowerShell ready
- [ ] Stable internet connection

## 📋 Deployment Checklist

### Phase 1: Setup (2 minutes)

- [ ] Open PowerShell
- [ ] Run: `rustc --version` (verify Rust installed)
- [ ] Run: `soroban --version` (verify Soroban CLI installed)
  - If fails: Run `cargo install soroban-cli`
- [ ] Run: `cd contracts/data_storage`

### Phase 2: Build (2-3 minutes)

- [ ] Run: `cargo build --release --target wasm32-unknown-unknown`
- [ ] Wait for "Finished" message
- [ ] ✅ Contract built

### Phase 3: Create Account (1 minute)

- [ ] Run: `soroban keys generate --name mykey`
- [ ] Enter a strong passphrase (remember it!)
- [ ] Confirm passphrase
- [ ] ✅ See "Public key: G..." message
- [ ] Copy the `G...` address

### Phase 4: Fund Account (2 minutes)

- [ ] Go to: https://stellar.org/developers/testnet-lab
- [ ] Paste your `G...` address
- [ ] Click "Get 10,000 XLM"
- [ ] Wait for "Success!" message
- [ ] ✅ Account funded

### Phase 5: Deploy Contract (2-3 minutes)

- [ ] Run deployment command:
```powershell
soroban contract deploy `
  --wasm .\target\wasm32-unknown-unknown\release\data_storage.wasm `
  --source-account mykey `
  --network testnet
```
- [ ] Enter your passphrase when asked
- [ ] Wait for deployment to complete
- [ ] See "Contract ID: CDATA..." message
- [ ] ✅ Copy the `CDATA...` address

### Phase 6: Update Configuration (1 minute)

- [ ] Open `.env` file in VS Code
- [ ] Find: `VITE_CONTRACT_ID=your_deployed_contract_id_here`
- [ ] Replace with your `CDATA...` ID
- [ ] Save file (Ctrl+S)
- [ ] ✅ .env file updated

### Phase 7: Restart Servers (2 minutes)

**Frontend:**
- [ ] Open new PowerShell window
- [ ] Run: `npm run dev`
- [ ] Wait for "ready in X ms" message
- [ ] ✅ Frontend running at http://localhost:5173

**Backend:**
- [ ] Open another new PowerShell window
- [ ] Run: `cd backend`
- [ ] Run: `npm start`
- [ ] Wait for "MongoDB connected" message
- [ ] ✅ Backend running at port 3000

### Phase 8: Test (Optional but recommended)

- [ ] Open http://localhost:5173 in browser
- [ ] Login with:
  - Email: `bhaleraonishit@gmail.com`
  - Password: `nishit@stellarguard2026`
- [ ] Click "Upload"
- [ ] Upload a `.sol` contract file
- [ ] Click "Analyze"
- [ ] In audit report, click "Store on Blockchain"
- [ ] ✅ Should see success message

---

## 🚀 Estimated Timeline

| Phase | Task | Time |
|-------|------|------|
| 1 | Setup & verify tools | 2 min |
| 2 | Build contract | 3 min |
| 3 | Create wallet key | 1 min |
| 4 | Fund testnet account | 2 min |
| 5 | Deploy to Soroban | 3 min |
| 6 | Update .env config | 1 min |
| 7 | Restart servers | 2 min |
| 8 | Test (optional) | 2 min |
| **Total** | | **~16 min** |

---

## ⚠️ Critical Steps (Don't Skip!)

1. **Build contract** - Must run `cargo build` before deploying
2. **Fund account** - Must visit testnet faucet (free money)
3. **Update .env** - Must paste contract ID, restart frontend
4. **Restart servers** - Must restart BOTH backend and frontend

---

## 🆘 If Something Fails

### Rust not installed
```powershell
# Install from: https://rustup.rs/
# Restart PowerShell after install
```

### Soroban not installed
```powershell
rustup update
cargo install soroban-cli
# Wait 2-3 minutes for compilation
```

### Build fails
```powershell
# Try this:
rustup update
cd contracts/data_storage
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### Deployment fails - "account not found"
```powershell
# Fund your account again
# Visit: https://stellar.org/developers/testnet-lab
# Paste your G... address again
# Wait 10 seconds
# Try deployment command again
```

### Deployment fails - "passphrase incorrect"
```powershell
# You entered wrong password
# Re-run the deployment command
# Type the correct passphrase
```

### Still shows "smart contract not deployed yet"
- Check .env has correct contract ID
- Make sure contract ID starts with `CDATA`
- Check you saved the .env file
- Restart frontend: Press Ctrl+C, then `npm run dev`

---

## ✨ After Deployment

Your app can now:
- ✅ Store audits on Stellar blockchain
- ✅ Generate immutable records
- ✅ Verify contracts on-chain
- ✅ Share blockchain-backed proofs

---

## 📚 Guides

- **Quick Commands**: DEPLOYMENT_QUICK.md
- **Visual Guide**: DEPLOYMENT_VISUAL.md
- **Detailed Guide**: DEPLOYMENT_STEPS.md

---

## Troubleshooting Resources

- Stellar Docs: https://developers.stellar.org/
- Soroban Docs: https://soroban.stellar.org/
- Freighter Wallet: https://www.freighter.app/
- Testnet Faucet: https://stellar.org/developers/testnet-lab

---

## Ready to Deploy?

1. Open PowerShell
2. Run the commands from DEPLOYMENT_QUICK.md
3. Follow each step carefully
4. Test the "Store on Blockchain" button

**Time to deploy: ~10-15 minutes**

Good luck! 🚀
