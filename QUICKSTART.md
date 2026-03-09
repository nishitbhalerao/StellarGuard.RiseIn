# StellarGuard - Quick Start Guide

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] MongoDB installed and running
- [ ] Git installed
- [ ] Freighter Wallet browser extension
- [ ] (Optional) Rust + Cargo for contract deployment

## 5-Minute Setup

### Step 1: Install Dependencies

**Windows:**
```powershell
./install.ps1
```

**Linux/Mac:**
```bash
chmod +x install.sh
./install.sh
```

### Step 2: Start MongoDB

**Windows:**
```powershell
net start MongoDB
```

**Linux/Mac:**
```bash
mongod
```

### Step 3: Start Backend (Terminal 1)

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected
🚀 StellarGuard backend running on port 3000
```

### Step 4: Start Frontend (Terminal 2)

```bash
npm run dev
```

You should see:
```
VITE ready in XXX ms
➜ Local: http://localhost:5173/
```

### Step 5: Open Application

Visit: http://localhost:5173

## Test the Application

### Option 1: Quick Test (No Wallet)

1. Click "Start Audit"
2. Enter contract name: "test_token"
3. Upload `sample_contracts/vulnerable_token.rs`
4. Click "Analyze Contract"
5. View the audit report

### Option 2: Full Test (With Wallet)

1. Install Freighter Wallet extension
2. Create/import wallet
3. Switch to Testnet in Freighter
4. Fund account: https://laboratory.stellar.org/#account-creator?network=test
5. In StellarGuard, click "Connect Wallet"
6. Upload and analyze a contract
7. Click "Store on Blockchain"
8. Approve transaction in Freighter
9. View Dashboard to see audit history

## Expected Results

### Vulnerable Token
- Score: 30-40
- Risk Level: HIGH_RISK
- Vulnerabilities: 5-7 issues found

### Secure Token
- Score: 85-100
- Risk Level: SECURE
- Vulnerabilities: 0-2 minor issues

## Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
mongod --version

# Start MongoDB
# Windows: net start MongoDB
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

### "Port 3000 already in use"
```bash
# Change port in backend/.env
PORT=3001

# Update frontend .env
VITE_API_URL=http://localhost:3001
```

### "Freighter not detected"
1. Install from: https://www.freighter.app/
2. Refresh the page
3. Check browser console for errors

### "Module not found" errors
```bash
# Reinstall dependencies
rm -rf node_modules backend/node_modules
npm install
cd backend && npm install
```

## Next Steps

1. **Deploy Contract**: See DEPLOYMENT.md for Soroban deployment
2. **Customize**: Modify vulnerability rules in `backend/services/analyzer.service.js`
3. **Extend**: Add new features or integrate with CI/CD
4. **Production**: Deploy to Vercel (frontend) + Railway (backend)

## Support

- Documentation: See README.md
- Testing: See TESTING.md
- Deployment: See DEPLOYMENT.md
- Features: See FEATURES.md

## Common Commands

```bash
# Frontend
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Backend
npm run dev          # Start with auto-reload
npm start            # Start production server

# Contract
cd contracts/audit_registry
soroban contract build    # Build contract
soroban contract deploy   # Deploy to testnet
```

## Success Indicators

✅ Backend running on http://localhost:3000
✅ Frontend running on http://localhost:5173
✅ MongoDB connected
✅ Can upload and analyze contracts
✅ Audit reports display correctly
✅ Wallet connects successfully
✅ Dashboard shows audit history

Enjoy using StellarGuard! 🚀
