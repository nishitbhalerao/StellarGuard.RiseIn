# StellarGuard - Useful Commands

## Installation

```bash
# Quick install (Linux/Mac)
./install.sh

# Quick install (Windows)
./install.ps1

# Manual install
npm install
cd backend && npm install
```

## Development

### Start All Services

```bash
# Terminal 1: MongoDB
mongod

# Terminal 2: Backend
cd backend
npm run dev

# Terminal 3: Frontend
npm run dev
```

### Frontend Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Install dependencies
npm install

# Update dependencies
npm update
```

### Backend Commands

```bash
# Development with auto-reload
npm run dev

# Production start
npm start

# Install dependencies
npm install

# Check for updates
npm outdated
```

## Database

### MongoDB Commands

```bash
# Start MongoDB
mongod

# Start MongoDB (Windows)
net start MongoDB

# Stop MongoDB (Windows)
net stop MongoDB

# Connect to MongoDB shell
mongosh

# Show databases
show dbs

# Use StellarGuard database
use stellarguard

# Show collections
show collections

# Query audits
db.audits.find().pretty()

# Count audits
db.audits.countDocuments()

# Find by wallet
db.audits.find({ walletAddress: "GXXX..." })

# Delete all audits (careful!)
db.audits.deleteMany({})
```

## Soroban Contract

### Setup

```bash
# Install Stellar CLI
cargo install --locked soroban-cli

# Check version
soroban --version

# Add testnet network
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"

# Generate identity
soroban keys generate deployer --network testnet

# Get public key
soroban keys address deployer

# Show all identities
soroban keys ls
```

### Build & Deploy

```bash
# Navigate to contract
cd contracts/audit_registry

# Build contract
soroban contract build

# Optimize build
soroban contract optimize --wasm target/wasm32-unknown-unknown/release/audit_registry.wasm

# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/audit_registry.wasm \
  --source deployer \
  --network testnet

# Invoke contract function
soroban contract invoke \
  --id <CONTRACT_ID> \
  --source deployer \
  --network testnet \
  -- \
  audit_count
```

### Testing

```bash
# Run contract tests
cargo test

# Run with output
cargo test -- --nocapture

# Run specific test
cargo test test_store_and_retrieve
```

## Git Commands

```bash
# Initialize repository
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: StellarGuard platform"

# Add remote
git remote add origin <your-repo-url>

# Push to GitHub
git push -u origin main

# Create .gitignore
echo "node_modules/\n.env\ndist/" > .gitignore
```

## Debugging

### Check Ports

```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Check if port 5173 is in use
netstat -ano | findstr :5173

# Kill process on port (Windows)
taskkill /PID <PID> /F

# Kill process on port (Linux/Mac)
kill -9 <PID>
```

### View Logs

```bash
# Backend logs
cd backend
npm run dev

# Frontend logs
npm run dev

# MongoDB logs (Linux/Mac)
tail -f /var/log/mongodb/mongod.log

# MongoDB logs (Windows)
# Check: C:\Program Files\MongoDB\Server\X.X\log\mongod.log
```

### Clear Cache

```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules
rm -rf node_modules backend/node_modules

# Reinstall
npm install
cd backend && npm install
```

## Testing

### API Testing with curl

```bash
# Health check
curl http://localhost:3000/api/health

# Create audit
curl -X POST http://localhost:3000/api/audit \
  -H "Content-Type: application/json" \
  -d '{
    "contractCode": "pub fn test() {}",
    "contractName": "test",
    "walletAddress": "GXXX"
  }'

# Get audit
curl http://localhost:3000/api/audit/<AUDIT_ID>

# Get wallet audits
curl http://localhost:3000/api/audit/wallet/<WALLET_ADDRESS>
```

### Browser Testing

```javascript
// Test Freighter in console
window.freighter

// Get public key
await window.freighter.getPublicKey()

// Check if installed
!!window.freighter
```

## Production Build

### Frontend

```bash
# Build
npm run build

# Test build locally
npm run preview

# Deploy to Vercel
vercel deploy

# Deploy to Netlify
netlify deploy --prod
```

### Backend

```bash
# Set production env
export NODE_ENV=production

# Start production server
npm start

# Deploy to Railway
railway up

# Deploy to Heroku
git push heroku main
```

## Maintenance

### Update Dependencies

```bash
# Check outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install <package>@latest

# Update backend
cd backend
npm update
```

### Database Backup

```bash
# Backup MongoDB
mongodump --db stellarguard --out ./backup

# Restore MongoDB
mongorestore --db stellarguard ./backup/stellarguard

# Export collection to JSON
mongoexport --db stellarguard --collection audits --out audits.json

# Import collection from JSON
mongoimport --db stellarguard --collection audits --file audits.json
```

## Environment Variables

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:3000
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_CONTRACT_ID=<your_contract_id>
```

### Backend (backend/.env)

```bash
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stellarguard
NODE_ENV=development
```

## Useful Aliases

Add to your `.bashrc` or `.zshrc`:

```bash
# StellarGuard aliases
alias sg-start="mongod & cd backend && npm run dev & cd .. && npm run dev"
alias sg-backend="cd backend && npm run dev"
alias sg-frontend="npm run dev"
alias sg-mongo="mongosh stellarguard"
alias sg-build="npm run build && cd backend && npm start"
```

## Quick Fixes

### "Cannot find module"
```bash
npm install
cd backend && npm install
```

### "Port already in use"
```bash
# Change port in backend/.env
PORT=3001
```

### "MongoDB connection failed"
```bash
# Start MongoDB
mongod
# or
net start MongoDB
```

### "Freighter not detected"
```bash
# Install Freighter extension
# Refresh browser
# Check: !!window.freighter
```

### "Build failed"
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

## Performance Monitoring

```bash
# Check bundle size
npm run build
ls -lh dist/assets

# Analyze bundle
npm install -D rollup-plugin-visualizer
# Add to vite.config.js

# Monitor backend
npm install -g pm2
pm2 start backend/server.js
pm2 monit
```

## Security Checks

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check backend
cd backend
npm audit
```

Happy coding! 🚀
