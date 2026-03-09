# StellarGuard

![StellarGuard Banner](https://via.placeholder.com/1200x300/0A0A0F/0EA5E9?text=StellarGuard+-+Smart+Contract+Security+Auditor)

**Automated Smart Contract Security Auditing Platform for Stellar Soroban**

StellarGuard is a full-stack web application that enables developers to upload Soroban smart contracts, automatically scan them for vulnerabilities, generate detailed audit reports with risk scores, and store audit hashes on the Stellar blockchain for immutable verification.

## Features

- **Automated Vulnerability Detection** - Static analysis engine detects 12+ vulnerability types
- **Real-time Analysis** - Get comprehensive audit reports in seconds
- **Risk Scoring System** - Clear security scores (0-100) with risk level classification
- **Blockchain Verification** - Store audit hashes on Stellar testnet via Soroban contracts
- **Freighter Wallet Integration** - Seamless wallet connection for blockchain operations
- **Audit Dashboard** - Track all your audits with detailed history and analytics
- **Beautiful UI** - Premium dark theme with animated backgrounds and glassmorphism

## Tech Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- React Router
- Stellar SDK
- Recharts (data visualization)
- Lucide React (icons)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- Static analysis engine

### Blockchain
- Stellar Testnet
- Soroban Smart Contracts (Rust)
- Freighter Wallet

## Project Structure

```
StellarGuard/
├── src/
│   ├── components/
│   │   ├── AnimatedBackground.jsx
│   │   ├── Navbar.jsx
│   │   ├── ScoreGauge.jsx
│   │   └── Toast.jsx
│   ├── pages/
│   │   ├── LandingPage.jsx
│   │   ├── UploadPage.jsx
│   │   ├── AuditReport.jsx
│   │   └── Dashboard.jsx
│   ├── context/
│   │   ├── WalletContext.jsx
│   │   └── ToastContext.jsx
│   ├── services/
│   │   ├── walletService.js
│   │   ├── stellarService.js
│   │   └── apiService.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── models/
│   │   └── Audit.model.js
│   ├── routes/
│   │   └── audit.routes.js
│   ├── services/
│   │   ├── analyzer.service.js
│   │   └── score.service.js
│   └── server.js
├── contracts/
│   └── audit_registry/
│       ├── src/
│       │   └── lib.rs
│       └── Cargo.toml
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js 18+
- MongoDB
- Rust & Cargo (for Soroban contract)
- Stellar CLI (soroban-cli)
- Freighter Wallet browser extension

### Frontend Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd StellarGuard
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration:
```env
VITE_API_URL=http://localhost:3000
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_CONTRACT_ID=your_deployed_contract_id_here
```

5. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Update `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/stellarguard
NODE_ENV=development
```

5. Start MongoDB (if not running):
```bash
# macOS/Linux
mongod

# Windows
net start MongoDB
```

6. Start backend server:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Soroban Contract Deployment

1. Install Stellar CLI:
```bash
cargo install --locked soroban-cli
```

2. Configure Stellar CLI for testnet:
```bash
soroban network add testnet \
  --rpc-url https://soroban-testnet.stellar.org \
  --network-passphrase "Test SDF Network ; September 2015"
```

3. Create identity:
```bash
soroban keys generate deployer --network testnet
```

4. Fund your account:
```bash
soroban keys address deployer
# Visit https://laboratory.stellar.org/#account-creator?network=test
# and fund the address
```

5. Build the contract:
```bash
cd contracts/audit_registry
soroban contract build
```

6. Deploy the contract:
```bash
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/audit_registry.wasm \
  --source deployer \
  --network testnet
```

7. Copy the contract ID and update your frontend `.env`:
```env
VITE_CONTRACT_ID=<your_contract_id>
```

## Connecting Freighter Wallet

1. Install [Freighter Wallet](https://www.freighter.app/) browser extension

2. Create or import a wallet

3. Switch to Testnet:
   - Open Freighter
   - Click Settings
   - Select "Testnet" network

4. Fund your testnet account:
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Enter your public key
   - Click "Fund Account"

5. Connect wallet in StellarGuard:
   - Click "Connect Wallet" button
   - Approve connection in Freighter popup

## API Documentation

### Base URL
```
http://localhost:3000/api
```

### Endpoints

#### Create Audit
```http
POST /audit
Content-Type: application/json

{
  "contractCode": "string",
  "contractName": "string",
  "walletAddress": "string (optional)"
}

Response:
{
  "success": true,
  "data": {
    "auditId": "uuid",
    "score": 85,
    "riskLevel": "SECURE",
    "vulnerabilities": [...],
    "counts": { "CRITICAL": 0, "HIGH": 1, ... },
    "reportHash": "sha256_hash",
    "createdAt": "2026-03-09T..."
  }
}
```

#### Get Audit by ID
```http
GET /audit/:auditId

Response:
{
  "success": true,
  "data": {
    "auditId": "uuid",
    "contractName": "string",
    "score": 85,
    "riskLevel": "SECURE",
    "vulnerabilities": [...],
    ...
  }
}
```

#### Get Audits by Wallet
```http
GET /audit/wallet/:walletAddress

Response:
{
  "success": true,
  "data": [
    { audit1 },
    { audit2 },
    ...
  ]
}
```

#### Update Blockchain Hash
```http
PATCH /audit/:auditId/blockchain
Content-Type: application/json

{
  "txHash": "stellar_transaction_hash"
}

Response:
{
  "success": true,
  "data": { updated_audit }
}
```

## Vulnerability Detection Rules

| Rule ID | Name | Severity | Description |
|---------|------|----------|-------------|
| AUTH_001 | Missing Authorization | CRITICAL | Sensitive operations without `require_auth()` |
| MATH_001 | Integer Overflow/Underflow | HIGH | Arithmetic without checked operations |
| BAL_001 | Missing Balance Validation | CRITICAL | Transfer without balance check |
| INPUT_001 | Improper Input Validation | MEDIUM | Functions without parameter validation |
| ERR_001 | Unsafe Unwrap Usage | MEDIUM | Using `.unwrap()` without error handling |
| ACCESS_001 | Missing Access Control | HIGH | Admin functions without access checks |
| REEN_001 | Reentrancy Risk | HIGH | State changes after external calls |

## Scoring System

- **Base Score**: 100 points
- **Deductions**:
  - CRITICAL: -25 points each
  - HIGH: -15 points each
  - MEDIUM: -8 points each
  - LOW: -3 points each

**Risk Levels**:
- **SECURE**: Score ≥ 80
- **MEDIUM_RISK**: Score 50-79
- **HIGH_RISK**: Score < 50

## Color Palette

The application uses a premium dark theme:

- **Deep Space Black**: `#0A0A0F`
- **Midnight Navy**: `#0D1B2A`
- **Electric Blue**: `#0EA5E9`
- **Stellar Blue**: `#38BDF8`
- **Ice White**: `#F0F9FF`

## Reference Project

This project references [Stellar.RiseIn-VitalX](https://github.com/nishitbhalerao/Stellar.RiseIn-VitalX) for:
- Freighter wallet integration patterns
- Stellar SDK usage
- Soroban contract interaction
- Transaction signing flow

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ for the Stellar ecosystem
