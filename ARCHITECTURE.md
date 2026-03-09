# StellarGuard - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React + Vite)                            │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Landing | Upload | Report | Dashboard        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Components: Navbar | ScoreGauge | Toast | BG       │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Context: WalletContext | ToastContext               │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services: API | Wallet | Stellar                    │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│                   (Node.js + Express)                        │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes: /api/audit/*                                │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Services: Analyzer | Scoring                        │  │
│  └──────────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Models: Audit (Mongoose)                            │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MongoDB Protocol
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                        MongoDB                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Collections: audits                                 │  │
│  │  - auditId, walletAddress, contractCode              │  │
│  │  - vulnerabilities[], score, riskLevel               │  │
│  │  - reportHash, blockchainTxHash                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Freighter Wallet                          │
│                  (Browser Extension)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  - Connect/Disconnect                                │  │
│  │  - Get Public Key                                    │  │
│  │  - Sign Transactions                                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Stellar SDK
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Stellar Testnet                            │
│                  (Soroban RPC)                               │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Smart Contract: AuditRegistry                       │  │
│  │  - store_audit_hash()                                │  │
│  │  - get_audit()                                       │  │
│  │  - get_audits_by_wallet()                            │  │
│  │  - audit_count()                                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### 1. Contract Upload & Analysis

```
User → Upload Page → Backend API
                      ↓
                  Analyzer Service
                      ↓
                  Vulnerability Detection
                      ↓
                  Score Calculation
                      ↓
                  MongoDB Storage
                      ↓
                  Report Page
```

### 2. Blockchain Storage

```
User → Report Page → Connect Wallet
                      ↓
                  Freighter Wallet
                      ↓
                  Sign Transaction
                      ↓
                  Stellar Testnet
                      ↓
                  Soroban Contract
                      ↓
                  Update MongoDB
                      ↓
                  Display TX Hash
```

### 3. Dashboard View

```
User → Dashboard → Check Wallet
                      ↓
                  Backend API
                      ↓
                  MongoDB Query
                      ↓
                  Aggregate Stats
                      ↓
                  Display Charts
```

## Component Hierarchy

```
App
├── WalletProvider
│   └── ToastProvider
│       ├── AnimatedBackground
│       ├── Navbar
│       └── Routes
│           ├── LandingPage
│           ├── UploadPage
│           ├── AuditReport
│           │   └── ScoreGauge
│           └── Dashboard
└── Toast (Portal)
```

## State Management

### Global State (Context)
- **WalletContext**: publicKey, isConnected, connect(), disconnect()
- **ToastContext**: showToast(message, type)

### Local State
- **UploadPage**: contractCode, contractName, isLoading
- **AuditReport**: audit, expandedVuln, isStoring
- **Dashboard**: audits, isLoading

## API Routes

```
/api
├── /audit
│   ├── POST /              → Create audit
│   ├── GET /:auditId       → Get audit by ID
│   ├── GET /wallet/:addr   → Get wallet audits
│   └── PATCH /:id/blockchain → Update TX hash
└── /health                 → Health check
```

## Database Schema

```javascript
Audit {
  auditId: String (UUID)
  walletAddress: String
  contractName: String
  contractCode: String
  vulnerabilities: [{
    id: String
    name: String
    severity: Enum
    line: Number
    description: String
    recommendation: String
  }]
  score: Number (0-100)
  riskLevel: Enum (SECURE|MEDIUM_RISK|HIGH_RISK)
  reportHash: String (SHA-256)
  blockchainTxHash: String
  storedOnChain: Boolean
  createdAt: Date
}
```

## Smart Contract Storage

```rust
Storage {
  AUDITS: Map<(String, String), AuditRecord>
  AUDIT_COUNT: u32
  Wallet Index: Map<(Address, u32), String>
}

AuditRecord {
  audit_id: String
  wallet: Address
  contract_name: String
  report_hash: String
  timestamp: u64
}
```

## Security Flow

```
1. User uploads contract
2. Backend analyzes code (static analysis)
3. Vulnerabilities detected via regex patterns
4. Score calculated based on severity
5. Report hash generated (SHA-256)
6. Stored in MongoDB
7. User connects wallet (Freighter)
8. Transaction built with Stellar SDK
9. User signs via Freighter
10. Submitted to Soroban RPC
11. Hash stored on blockchain
12. TX hash saved to MongoDB
13. Immutable verification available
```

## Technology Stack Layers

```
┌─────────────────────────────────────┐
│  Presentation Layer                 │
│  React, Tailwind, Canvas            │
├─────────────────────────────────────┤
│  Application Layer                  │
│  React Router, Context API          │
├─────────────────────────────────────┤
│  Service Layer                      │
│  Axios, Stellar SDK, Freighter      │
├─────────────────────────────────────┤
│  API Layer                          │
│  Express.js, REST                   │
├─────────────────────────────────────┤
│  Business Logic Layer               │
│  Analyzer, Scoring                  │
├─────────────────────────────────────┤
│  Data Layer                         │
│  Mongoose, MongoDB                  │
├─────────────────────────────────────┤
│  Blockchain Layer                   │
│  Soroban, Stellar Testnet           │
└─────────────────────────────────────┘
```

## Deployment Architecture

```
┌──────────────────┐
│   Vercel/Netlify │  ← Frontend (Static)
└──────────────────┘
         │
         │ HTTPS
         ▼
┌──────────────────┐
│  Railway/Heroku  │  ← Backend API
└──────────────────┘
         │
         │ MongoDB Protocol
         ▼
┌──────────────────┐
│  MongoDB Atlas   │  ← Database
└──────────────────┘

┌──────────────────┐
│ Stellar Testnet  │  ← Blockchain
└──────────────────┘
```

## Performance Considerations

- **Frontend**: Vite for fast builds, code splitting
- **Backend**: Express with async/await, connection pooling
- **Database**: Indexed queries on walletAddress and auditId
- **Blockchain**: Async transaction submission with polling
- **UI**: Canvas animations on separate layer, CSS transforms

## Security Measures

- **Input Validation**: Contract code sanitization
- **Authentication**: Wallet signature verification
- **CORS**: Configured for specific origins
- **Error Handling**: Try-catch blocks throughout
- **Data Integrity**: SHA-256 hashing for reports
- **Blockchain**: Immutable audit trail
