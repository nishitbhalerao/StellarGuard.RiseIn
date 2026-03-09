# StellarGuard - Project Summary

## Overview
StellarGuard is a full-stack smart contract security auditing platform specifically built for the Stellar Soroban ecosystem. It provides automated vulnerability detection, risk scoring, and blockchain-verified audit reports.

## Architecture

### Frontend (React + Vite)
- **Framework**: React 18 with Vite for fast development
- **Styling**: Tailwind CSS with custom design system
- **Routing**: React Router for SPA navigation
- **State Management**: Context API (Wallet, Toast)
- **Blockchain**: Stellar SDK + Freighter wallet integration

### Backend (Node.js + Express)
- **Runtime**: Node.js with ES modules
- **Framework**: Express.js REST API
- **Database**: MongoDB with Mongoose ODM
- **Analysis**: Custom static analysis engine
- **Security**: CORS, input validation, error handling

### Smart Contract (Rust + Soroban)
- **Language**: Rust
- **Platform**: Stellar Soroban
- **Network**: Testnet
- **Storage**: Persistent storage for audit records

## Key Features

1. **Automated Analysis**: 7 vulnerability detection rules
2. **Risk Scoring**: 0-100 score with 3 risk levels
3. **Blockchain Storage**: Immutable audit hash storage
4. **Wallet Integration**: Seamless Freighter connection
5. **Beautiful UI**: Premium dark theme with animations
6. **Dashboard**: Complete audit history and analytics

## Technology Highlights

- **Particle System**: Canvas-based animated background
- **Glassmorphism**: Modern card design with backdrop blur
- **Responsive**: Mobile-first design (375px+)
- **Real-time**: Instant analysis and feedback
- **Secure**: Wallet authentication and blockchain verification

## File Structure
```
StellarGuard/
├── src/                    # Frontend React app
├── backend/                # Node.js API server
├── contracts/              # Soroban smart contract
├── sample_contracts/       # Test contracts
├── public/                 # Static assets
└── docs/                   # Documentation
```

## Getting Started

1. **Install**: Run `./install.sh` (Linux/Mac) or `./install.ps1` (Windows)
2. **Configure**: Update .env files with your settings
3. **Start**: Launch MongoDB, backend, and frontend
4. **Deploy**: Deploy Soroban contract (see DEPLOYMENT.md)
5. **Test**: Use sample contracts to verify functionality

## API Endpoints

- `POST /api/audit` - Create audit
- `GET /api/audit/:id` - Get audit
- `GET /api/audit/wallet/:address` - Get wallet audits
- `PATCH /api/audit/:id/blockchain` - Update blockchain hash

## Vulnerability Rules

1. Missing Authorization (CRITICAL)
2. Integer Overflow/Underflow (HIGH)
3. Missing Balance Validation (CRITICAL)
4. Improper Input Validation (MEDIUM)
5. Unsafe Unwrap Usage (MEDIUM)
6. Missing Access Control (HIGH)
7. Reentrancy Risk (HIGH)

## Design System

**Colors**:
- Deep Space Black: #0A0A0F
- Midnight Navy: #0D1B2A
- Electric Blue: #0EA5E9
- Stellar Blue: #38BDF8
- Ice White: #F0F9FF

**Effects**:
- Animated particles
- Floating orbs
- Glassmorphism cards
- Gradient buttons
- Glow effects

## Dependencies

**Frontend**:
- react, react-dom, react-router-dom
- @stellar/stellar-sdk
- recharts, lucide-react
- axios, crypto-js
- tailwindcss

**Backend**:
- express, mongoose
- cors, dotenv
- multer, uuid

**Contract**:
- soroban-sdk

## Reference
Based on patterns from: https://github.com/nishitbhalerao/Stellar.RiseIn-VitalX

## License
MIT

## Author
Built for the Stellar ecosystem
