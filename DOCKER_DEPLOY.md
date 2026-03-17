# Deploy Soroban Contract via Docker + Freighter
# This script builds and deploys the contract to Stellar Testnet

## Prerequisites
- Docker Desktop installed and running
- Freighter wallet extension installed (freighter.app)
- Account funded on Stellar testnet

## One-Command Deployment

### Step 1: Build contract in Docker
```powershell
cd contracts\data_storage
docker build -t soroban-builder .
docker run --rm -v ${PWD}:/app soroban-builder
```

### Step 2: Deploy using Soroban CLI (in Docker)
```powershell
docker run --rm -v ${PWD}:/app soroban-cli:latest soroban contract deploy `
  --wasm /app/target/wasm32-unknown-unknown/release/data_storage.wasm `
  --source-account mykey `
  --network testnet
```

### Step 3: OR Deploy via Web UI (Easier - 2 steps)
1. Build contract: `docker build -t soroban-builder . && docker run --rm -v ${PWD}:/app soroban-builder`
2. Go to: https://soroban.stellar.org
3. Paste the `.wasm` file content
4. Click Deploy
5. Get Contract ID: `CDATA...`

---

## After Deployment

Once you have the Contract ID:

1. Update `.env`:
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

2. Restart servers:
```powershell
npm run dev          # Terminal 1
cd backend && npm start  # Terminal 2
```

3. Test blockchain:
- Login to http://localhost:5173
- Upload contract file
- Click "Store on Blockchain" ✅

---

## What Docker Does

- ✅ Installs Rust automatically
- ✅ Installs Soroban CLI
- ✅ Builds WASM binary
- ✅ No build tools needed on your machine
- ✅ Clean, isolated environment

---

## Alternative: Simple approach

If Docker isn't playing nicely, just go straight to **DEPLOY_WEB_IDE.md** and upload the built contract there in 5 minutes.

---

Done! 🚀
