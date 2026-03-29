# 🚀 CI/CD Pipeline Setup for StellarGuard

This document explains the comprehensive CI/CD pipeline implemented for the StellarGuard project.

## 📋 Overview

The CI/CD pipeline includes:
- **Continuous Integration** - Automated testing, linting, and building
- **Continuous Deployment** - Automated deployment to staging and production
- **Code Quality** - Automated code quality checks and security scanning
- **Dependency Management** - Automated dependency updates via Dependabot

## 🔧 Pipeline Components

### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
- **Frontend Build & Test** - Tests Node.js 18.x and 20.x
- **Backend Build & Test** - Tests Node.js 18.x and 20.x  
- **Security Scan** - npm audit and CodeQL analysis
- **Deploy Production** - Deploys to Vercel on `main` branch
- **Deploy Staging** - Deploys to Vercel on `develop` branch
- **Notification** - Reports deployment status

### 2. Test Suite (`.github/workflows/test.yml`)

**Triggers:**
- Push to `main`, `develop`, or `feature/*` branches
- Pull requests to `main` or `develop` branches

**Jobs:**
- **Unit Tests** - Frontend and backend unit tests with coverage
- **Integration Tests** - API integration tests with MongoDB
- **E2E Tests** - End-to-end testing with Playwright
- **Performance Tests** - Lighthouse CI performance auditing

### 3. Code Quality (`.github/workflows/code-quality.yml`)

**Triggers:**
- Push to `main` or `develop` branches
- Pull requests to `main` branch

**Jobs:**
- **Lint & Format Check** - ESLint and Prettier validation
- **Type Check** - TypeScript type checking (if applicable)
- **Dependency Audit** - Security vulnerability scanning
- **Bundle Analysis** - Bundle size analysis and optimization
- **Code Coverage** - Test coverage reporting

### 4. Release Pipeline (`.github/workflows/release.yml`)

**Triggers:**
- Git tags matching `v*.*.*` pattern

**Jobs:**
- **Create Release** - Generates changelog and release artifacts
- **Deploy Release** - Deploys tagged version to production
- **Notify Release** - Sends release notifications

## 🔐 Required Secrets

Add these secrets to your GitHub repository settings:

### Vercel Deployment
```bash
VERCEL_TOKEN=your_vercel_token_here
```

### Code Coverage (Optional)
```bash
CODECOV_TOKEN=your_codecov_token_here
```

### Lighthouse CI (Optional)
```bash
LHCI_GITHUB_APP_TOKEN=your_lighthouse_token_here
```

## 📦 Setup Instructions

### 1. Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
cd backend
npm install
```

### 2. Configure Vercel

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login and link project:
```bash
vercel login
vercel link
```

3. Get your Vercel token:
```bash
vercel tokens create
```

4. Add the token to GitHub Secrets as `VERCEL_TOKEN`

### 3. Configure Environment Variables

Create `.env` files based on `.env.example`:

**Root `.env`:**
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_STELLAR_NETWORK=testnet
```

**Backend `.env`:**
```env
MONGODB_URI=mongodb://localhost:27017/stellarguard
PORT=3000
NODE_ENV=development
```

### 4. Enable GitHub Features

1. **Enable Actions** - Go to repository Settings > Actions > General
2. **Enable Dependabot** - Dependabot will automatically create PRs for updates
3. **Enable Security** - Go to Settings > Security & analysis

## 🎯 Workflow Triggers

### Automatic Triggers
- **Push to main** → Full CI/CD + Production deployment
- **Push to develop** → Full CI/CD + Staging deployment  
- **Pull Request** → CI tests and quality checks
- **Git Tag (v*.*.*)** → Release pipeline
- **Weekly** → Dependabot dependency updates

### Manual Triggers
- **Workflow Dispatch** - Manual workflow execution
- **Repository Dispatch** - API-triggered workflows

## 📊 Quality Gates

### Code Quality Requirements
- ✅ ESLint passes with 0 errors
- ✅ Prettier formatting is correct
- ✅ No high-severity security vulnerabilities
- ✅ Bundle size within acceptable limits

### Test Requirements
- ✅ Unit tests pass with >80% coverage
- ✅ Integration tests pass
- ✅ E2E tests pass
- ✅ Performance scores meet thresholds

### Deployment Requirements
- ✅ All quality gates pass
- ✅ Security scan passes
- ✅ Build artifacts generated successfully

## 🔍 Monitoring & Notifications

### Build Status
- GitHub Actions provides build status badges
- Failed builds block deployments
- Notifications sent on deployment status

### Performance Monitoring
- Lighthouse CI tracks performance metrics
- Bundle analyzer monitors asset sizes
- Coverage reports track test coverage

### Security Monitoring
- Dependabot alerts for vulnerable dependencies
- CodeQL scans for security issues
- npm audit checks for known vulnerabilities

## 🚀 Deployment Strategy

### Environments
1. **Development** - Local development environment
2. **Staging** - `develop` branch → Vercel preview deployment
3. **Production** - `main` branch → Vercel production deployment

### Deployment Process
1. **Code Push** → Triggers CI pipeline
2. **Quality Checks** → Runs tests and quality gates
3. **Build Artifacts** → Creates deployable assets
4. **Deploy** → Pushes to Vercel
5. **Verify** → Confirms deployment success

### Rollback Strategy
- **Git Revert** - Revert problematic commits
- **Vercel Rollback** - Use Vercel dashboard to rollback
- **Tag Deployment** - Deploy previous stable tag

## 📋 Branch Strategy

### Main Branches
- **`main`** - Production-ready code, protected branch
- **`develop`** - Integration branch for features

### Feature Branches
- **`feature/feature-name`** - Individual features
- **`bugfix/bug-name`** - Bug fixes
- **`hotfix/issue-name`** - Critical production fixes

### Protection Rules
- **Main branch** requires PR reviews
- **Status checks** must pass before merge
- **Up-to-date** branches required for merge

## 🛠️ Local Development

### Running Tests
```bash
# Frontend tests
npm test

# Backend tests
cd backend && npm test

# E2E tests
npx playwright test
```

### Code Quality Checks
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

### Build & Preview
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel Deployment Guide](https://vercel.com/docs/deployments/overview)
- [Dependabot Configuration](https://docs.github.com/en/code-security/dependabot)
- [CodeQL Security Analysis](https://codeql.github.com/)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

## 🤝 Contributing

When contributing to the project:

1. **Create Feature Branch** from `develop`
2. **Make Changes** with proper tests
3. **Run Quality Checks** locally
4. **Create Pull Request** to `develop`
5. **Address Review Comments** if any
6. **Merge** after approval and CI passes

## 🔧 Troubleshooting

### Common Issues

**Build Failures:**
- Check Node.js version compatibility
- Verify all dependencies are installed
- Review error logs in Actions tab

**Deployment Failures:**
- Verify Vercel token is valid
- Check environment variables
- Ensure build artifacts are generated

**Test Failures:**
- Run tests locally first
- Check for environment-specific issues
- Review test configuration

### Getting Help
- Check GitHub Actions logs
- Review workflow files for configuration
- Open issue for persistent problems