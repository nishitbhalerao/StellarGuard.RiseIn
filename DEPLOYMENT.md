# StellarGuard Deployment Guide

## Quick Start (Development)

### 1. Start MongoDB
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

### 2. Start Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Start Frontend
```bash
npm install
npm run dev
```

### 4. Access Application
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Soroban Contract Deployment

### Install Stellar CLI
```bash
cargo install --locked soroban-cli
```

### Configure Network
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

### Generate Keys
```bash
soroban keys generate deployer --network testnet
soroban keys address deployer
```

### Fund Account
Visit: https://laboratory.stellar.org/#account-creator?network=test

### Build & Deploy
```bash
cd contracts/audit_registry
soroban contract build
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/audit_registry.wasm \
  --source deployer \
  --network testnet
```

### Update Contract ID
Copy the contract ID and update `.env`:
```
VITE_CONTRACT_ID=<your_contract_id>
```

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ folder
```

### Backend (Heroku/Railway)
- Set environment variables
- Deploy backend folder
- Update VITE_API_URL in frontend

### Database (MongoDB Atlas)
- Create cluster
- Update MONGODB_URI
