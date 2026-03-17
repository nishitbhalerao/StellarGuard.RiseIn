# 🛡️ StellarGuard

> **Smart Contract Security Auditor for Stellar Soroban**

[![React](https://img.shields.io/badge/React-18.2.0-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![Stellar](https://img.shields.io/badge/Stellar-Soroban-purple?logo=stellar)](https://stellar.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Active-success)](#)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Quick Start](#quick-start)
- [Usage Guide](#usage-guide)
- [Vulnerability Detection](#vulnerability-detection)
- [API Endpoints](#api-endpoints)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**StellarGuard** is a comprehensive security auditing platform for Stellar Soroban smart contracts. It provides automated vulnerability detection, risk scoring, and blockchain verification to help developers write secure and reliable blockchain applications.

The platform combines static code analysis with blockchain integration to deliver an intuitive, powerful security audit experience. With real-time analysis, detailed reports, and a beautiful user interface, StellarGuard makes smart contract security accessible to everyone.

### Key Highlights

- ⚡ **Real-time Analysis** - Get vulnerability reports in less than 1 second
- 🔒 **7 Vulnerability Rules** - Comprehensive static analysis engine
- 📊 **Risk Scoring** - Intelligent 0-100 scoring system with 3 risk levels
- 🗂️ **Blockchain Verification** - Store audit hashes on Stellar Soroban
- 💼 **Professional Dashboard** - Track all your audits in one place
- 🎨 **Beautiful UI** - Modern glassmorphism design with smooth animations
- 📱 **Mobile Responsive** - Works perfectly on all devices

## ✨ Features

### Frontend Features
- 🌟 Animated starfield background with particle effects
- 📤 Drag-and-drop file upload for Rust contracts
- 🔗 GitHub URL input option for direct contract analysis
- 📈 Real-time animated score gauge component
- 🔍 Detailed vulnerability list with expandable descriptions
- 📊 Audit dashboard with history and statistics
- 🎯 Risk level badges (SECURE/MEDIUM/HIGH)
- 🔔 Toast notification system for user feedback
- 💳 Freighter wallet integration for blockchain transactions
- 🎭 Smooth animations and transitions throughout the UI

### Backend Features
- 🚀 Express.js REST API with CORS support
- 🗄️ MongoDB database integration with Mongoose ODM
- 🔬 Advanced static analysis engine
- 📐 Intelligent risk scoring algorithm
- ✅ Input validation and error handling
- 🔐 Secure API endpoints
- 📝 Audit history management
- 🔗 Blockchain integration layer

### Blockchain Features
- ⛓️ Stellar Soroban smart contracts (Rust)
- 💾 Immutable audit hash storage
- 👛 Freighter wallet integration
- 🔐 Transaction signing and verification
- 🌐 Stellar testnet configuration
- 📋 Multi-function contract system (store/retrieve audits)

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | UI library and component framework |
| **Vite** | Fast build tool and dev server |
| **Tailwind CSS** | Utility-first CSS framework |
| **React Router** | Client-side routing |
| **Recharts** | Data visualization and charts |
| **Lucide React** | Icon library |
| **Axios** | HTTP client for API calls |
| **Freighter API** | Stellar wallet integration |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js** | JavaScript runtime |
| **Express.js** | Web framework |
| **MongoDB** | NoSQL database |
| **Mongoose** | MongoDB ODM |
| **Crypto-js** | Cryptographic utilities |

### Blockchain
| Technology | Purpose |
|---|---|
| **Rust** | Smart contract language |
| **Soroban** | Stellar smart contract platform |
| **Stellar SDK** | Blockchain interaction |
| **Testnet** | Development network |

## 📁 Project Structure

```
StellarGuard/
├── src/                          # React frontend
│   ├── components/
│   │   ├── AnimatedBackground.jsx    # Particle effect background
│   │   ├── Navbar.jsx               # Navigation component
│   │   ├── ScoreGauge.jsx           # Animated score gauge
│   │   └── Toast.jsx                # Toast notifications
│   ├── pages/
│   │   ├── LandingPage.jsx          # Home page
│   │   ├── UploadPage.jsx           # Contract upload & analysis
│   │   ├── AuditReport.jsx          # Detailed audit report
│   │   ├── AdminDashboard.jsx       # Admin controls
│   │   └── Dashboard.jsx            # User audit history
│   ├── context/
│   │   ├── AuthContext.jsx          # Authentication state
│   │   ├── WalletContext.jsx        # Wallet state management
│   │   └── ToastContext.jsx         # Toast notifications state
│   ├── services/
│   │   ├── apiService.js            # Backend API client
│   │   ├── walletService.js         # Wallet operations
│   │   ├── stellarService.js        # Blockchain interactions
│   │   └── adminApiService.js       # Admin API client
│   ├── utils/                       # Utility functions
│   ├── App.jsx                      # Main app component
│   ├── main.jsx                     # Entry point
│   └── index.css                    # Global styles
│
├── backend/                         # Node.js/Express server
│   ├── server.js                    # Server entry point
│   ├── middleware/
│   │   └── auth.middleware.js       # Authentication middleware
│   ├── models/
│   │   ├── User.model.js            # User schema
│   │   └── Audit.model.js           # Audit schema
│   ├── routes/
│   │   ├── user.routes.js           # User endpoints
│   │   └── audit.routes.js          # Audit endpoints
│   ├── services/
│   │   ├── analyzer.service.js      # Contract analyzer
│   │   └── score.service.js         # Scoring algorithm
│   └── package.json
│
├── contracts/                       # Stellar Soroban contracts
│   ├── audit_registry/
│   │   ├── Cargo.toml               # Rust dependencies
│   │   └── src/lib.rs               # Smart contract code
│   └── data_storage/
│       ├── Cargo.toml
│       └── src/lib.rs
│
├── sample_contracts/                # Example contracts
│   ├── secure_token.rs              # Secure implementation
│   └── vulnerable_token.rs          # Known vulnerabilities
│
├── public/                          # Static assets
├── vite.config.js                   # Vite configuration
├── tailwind.config.js               # Tailwind configuration
├── postcss.config.js                # PostCSS configuration
├── package.json                     # Frontend dependencies
└── README.md                        # This file
```

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** 16.0.0 or higher
- **npm** 8.0.0 or higher
- **MongoDB** 5.0 or higher (or MongoDB Atlas account)
- **Rust** (for smart contract development)
- **Git** 2.0 or higher

### Step 1: Clone the Repository

```bash
git clone https://github.com/nishitbhalerao/StellarGuard.git
cd StellarGuard
```

### Step 2: Install Frontend Dependencies

```bash
# Install root dependencies
npm install

# Install Tailwind CSS dependencies (if needed)
npm install -D tailwindcss postcss autoprefixer
```

### Step 3: Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

### Step 4: Configure Environment Variables

Create a `.env` file in the `backend` folder:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/stellarguard
# Or use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/stellarguard

# Server Configuration
PORT=5000
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# Stellar Configuration
STELLAR_NETWORK=testnet
STELLAR_HORIZON_URL=https://horizon-testnet.stellar.org
```

Create a `.env` file in the root folder:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_STELLAR_NETWORK=testnet
```

### Step 5: Start MongoDB

```bash
# On Windows (if installed locally)
mongod

# Or use MongoDB Atlas (configured in .env)
```

## ⚡ Quick Start

### Development Mode

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm install  # if not done
node server.js
# Server running on http://localhost:5000
```

**Terminal 2 - Start Frontend Dev Server:**
```bash
npm run dev
# Frontend running on http://localhost:5173
```

### Build for Production

```bash
# Frontend build
npm run build

# Output will be in dist/ folder
```

## 📖 Usage Guide

### 1. Landing Page
Visit `http://localhost:5173` to see the beautiful landing page with:
- Animated background
- Project overview
- CTA buttons to get started

### 2. Upload Contract
1. Navigate to "Analyze" or "Upload"
2. Choose one of these options:
   - **Drag & Drop** a Rust contract file (.rs)
   - **Upload file** using the file picker
   - **Paste GitHub URL** to analyze a remote contract
3. Click "Analyze" or wait for auto-upload
4. View real-time analysis results

### 3. View Audit Report
After analysis completes:
- **Score Gauge** shows overall security score (0-100)
- **Risk Level** badge indicates vulnerability severity
- **Vulnerability List** with detailed findings:
  - Vulnerability ID and name
  - Severity level
  - Description and recommendations
  - Code snippets showing the issue
- **Statistics** about the contract

### 4. Dashboard
Access your audit history:
- View all previous audits
- Filter by date or risk level
- Click to view full reports
- Track security improvements

### 5. Freighter Wallet Integration
1. Install [Freighter Wallet](https://www.freighter.app/) browser extension
2. Create or import a Stellar account
3. Connect to StellarGuard via the wallet button
4. Approve blockchain transactions to store audit hashes

## 🔐 Vulnerability Detection

StellarGuard identifies 7 critical vulnerability patterns:

### 1. AUTH_001: Missing Authorization (CRITICAL)
- **Description:** Functions lack authorization checks
- **Risk:** Unauthorized users can execute sensitive operations
- **Fix:** Implement signature verification and access control

### 2. MATH_001: Integer Overflow/Underflow (HIGH)
- **Description:** Arithmetic operations without bound checking
- **Risk:** Values can exceed or fall below expected ranges
- **Fix:** Use checked arithmetic or range validation

### 3. BAL_001: Missing Balance Validation (CRITICAL)
- **Description:** No verification of sufficient balance before transfers
- **Risk:** Contracts may attempt invalid transfers
- **Fix:** Validate balance before every transfer operation

### 4. INPUT_001: Improper Input Validation (MEDIUM)
- **Description:** User inputs not properly sanitized
- **Risk:** Unexpected values can cause errors or exploits
- **Fix:** Validate all inputs against expected ranges/types

### 5. ERR_001: Unsafe Unwrap Usage (MEDIUM)
- **Description:** Unwrap calls that can panic on error
- **Risk:** Unhandled errors cause contract failures
- **Fix:** Use proper error handling (match, ? operator)

### 6. ACCESS_001: Missing Access Control (HIGH)
- **Description:** No verification of caller permissions
- **Risk:** Anyone can access protected functions
- **Fix:** Implement role-based access control (RBAC)

### 7. REEN_001: Reentrancy Risk (HIGH)
- **Description:** External calls before state updates
- **Risk:** Reentrancy attacks can drain funds
- **Fix:** Update state before external calls (Checks-Effects-Interactions)

## 🔌 API Endpoints

### Audit Endpoints

#### POST /api/audit/analyze
Analyze a smart contract for vulnerabilities.

```bash
curl -X POST http://localhost:5000/api/audit/analyze \
  -H "Content-Type: application/json" \
  -d '{"contractCode": "pub fn transfer(..."}'
```

**Response:**
```json
{
  "success": true,
  "audit": {
    "auditId": "audit_123",
    "score": 75,
    "riskLevel": "MEDIUM",
    "vulnerabilities": [
      {
        "id": "MATH_001",
        "name": "Integer Overflow",
        "severity": "HIGH",
        "line": 45,
        "description": "..."
      }
    ]
  }
}
```

#### GET /api/audit/:auditId
Retrieve a specific audit report.

#### GET /api/audit/wallet/:walletAddress
Get all audits for a wallet.

#### POST /api/audit/store-blockchain
Store audit hash on Stellar Soroban.

### User Endpoints

#### POST /api/user/register
Create a new user account.

#### POST /api/user/login
Authenticate user and get token.

#### GET /api/user/profile
Get current user profile.

## 🏗️ Architecture

### Frontend Architecture
```
React App
├── Pages Layer
│   ├── LandingPage
│   ├── UploadPage
│   ├── AuditReport
│   ├── AdminDashboard
│   └── Dashboard
├── Component Layer
│   ├── Navbar
│   ├── AnimatedBackground
│   ├── ScoreGauge
│   └── Toast
├── Context Layer (State Management)
│   ├── AuthContext
│   ├── WalletContext
│   └── ToastContext
└── Service Layer (API Integration)
    ├── apiService (Backend API)
    ├── walletService (Wallet operations)
    └── stellarService (Blockchain)
```

### Backend Architecture
```
Express Server
├── Routes Layer
│   ├── /api/audit/*
│   ├── /api/user/*
│   └── /api/admin/*
├── Middleware Layer
│   ├── auth.middleware
│   ├── error handling
│   └── logging
├── Service Layer
│   ├── analyzer.service (Vulnerability detection)
│   ├── score.service (Risk calculation)
│   └── blockchain.service
└── Model Layer
    ├── Audit Model
    └── User Model
```

### Data Flow
```
1. User uploads contract on Frontend
   ↓
2. Frontend sends to Backend API
   ↓
3. Backend Analyzer Service scans code
   ↓
4. Vulnerabilities detected and scored
   ↓
5. Report stored in MongoDB
   ↓
6. Response sent back to Frontend
   ↓
7. Report displayed with Score Gauge
   ↓
8. Optional: User approves blockchain storage
   ↓
9. Audit hash stored on Stellar Soroban
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository** on GitHub
2. **Create a branch** for your feature (`git checkout -b feature/AmazingFeature`)
3. **Make your changes** with clear, descriptive commits
4. **Write tests** for new functionality
5. **Push to the branch** (`git push origin feature/AmazingFeature`)
6. **Open a Pull Request** with a detailed description

### Development Guidelines
- Follow existing code style and conventions
- Write clear commit messages
- Test your changes locally before submitting PR
- Update documentation for new features
- Ensure all tests pass

### Reporting Issues
If you find bugs or have suggestions:
1. Check if issue already exists
2. Create detailed bug reports with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots/error logs if applicable
   - System information

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙋 Support & Contact

- **GitHub Issues:** [Report bugs or request features](https://github.com/nishitbhalerao/StellarGuard/issues)
- **Discussions:** [Join community discussions](https://github.com/nishitbhalerao/StellarGuard/discussions)
- **Email:** contact@stellarguard.dev

## 🙏 Acknowledgments

- [Stellar Foundation](https://stellar.org/) for the Soroban platform
- [Freighter](https://www.freighter.app/) for wallet integration
- [React](https://react.dev/) community
- All contributors and testers

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| **Total Files** | 45+ |
| **Lines of Code** | 3000+ |
| **Components** | 4 |
| **Pages** | 4 |
| **API Endpoints** | 8+ |
| **Vulnerability Rules** | 7 |
| **Documentation Files** | 10+ |

---

<div align="center">

**Made with ❤️ for Stellar Developers**

[⭐ Star us on GitHub](https://github.com/nishitbhalerao/StellarGuard) | [🐛 Report Issues](https://github.com/nishitbhalerao/StellarGuard/issues) | [💬 Discussions](https://github.com/nishitbhalerao/StellarGuard/discussions)

</div>
