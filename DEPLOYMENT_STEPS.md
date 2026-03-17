# Smart Contract Deployment Guide

Follow these steps in order to deploy your smart contract to Stellar Soroban testnet.

## Step 1: Install Required Tools

### Check if Rust is installed
```powershell
rustc --version
```

If not installed, install from: https://rustup.rs/

### Install Soroban CLI
```powershell
cargo install soroban-cli
```

### Verify installation
```powershell
soroban --version
```

## Step 2: Build the Smart Contract

```powershell
# Navigate to contract directory
cd contracts/data_storage

# Build for WASM
cargo build --release --target wasm32-unknown-unknown
```

✅ Success: File created at `target/wasm32-unknown-unknown/release/data_storage.wasm`

## Step 3: Set Up Your Testnet Account

### Option A: Use Freighter Wallet (Recommended)
1. Install Freighter: https://www.freighter.app/
2. Create a new account
3. Get the public key (your account address)
4. You can use Freighter to sign transactions

### Option B: Create CLI Key
```powershell
# Create a new keypair for deployment
soroban keys generate --name mykey

# This will ask for a passphrase (remember it!)
# Output: Public Key: G...
```

### Option C: Use Existing Key
```powershell
# List existing keys
soroban keys list
```

**Save your public key** - you'll need it next.

## Step 4: Fund Your Testnet Account

Visit Stellar Testnet Faucet: https://stellar.org/developers/testnet-lab

1. Paste your public key (from Freighter or CLI output)
2. Click "Get 10,000 XLM"
3. Wait for confirmation
4. Check balance: 10,000 XLM should appear

## Step 5: Deploy Contract to Testnet

```powershell
# Deploy using a key
soroban contract deploy \
  --wasm ./target/wasm32-unknown-unknown/release/data_storage.wasm \
  --source-account mykey \
  --network testnet
```

### What to expect:
- Takes 10-30 seconds
- Outputs contract ID starting with "C" (e.g., `CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...`)

**COPY THE CONTRACT ID** - You'll need this immediately!

## Step 6: Update .env File

Edit `.env` in project root:

```env
VITE_API_URL=http://localhost:3000
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...  # Paste your contract ID here!
```

## Step 7: Restart Development Server

### Terminal 1: Restart Backend
```powershell
cd backend
npm start
```

### Terminal 2: Restart Frontend
```powershell
npm run dev
```

## Step 8: Test Blockchain Storage

1. Open http://localhost:5173
2. Login with admin credentials
3. Upload a contract for audit
4. Click "Store on Blockchain" button
5. Should now work! ✅

---

## Troubleshooting

### "cargo: command not found"
- Install Rust: https://rustup.rs/
- Restart terminal/PowerShell

### "soroban: command not found"
```powershell
# Install Soroban CLI
cargo install soroban-cli

# If that fails, update cargo first
rustup update

# Then try again
cargo install soroban-cli
```

### "Compiler error during build"
```powershell
# Update Rust
rustup update

# Clean and rebuild
cd contracts/data_storage
cargo clean
cargo build --release --target wasm32-unknown-unknown
```

### "Account not found" error during deploy
- Your testnet account not funded
- Go to: https://stellar.org/developers/testnet-lab
- Paste public key
- Click "Get 10,000 XLM"
- Wait 10 seconds
- Try deploy again

### "No such file or directory: target/wasm32-unknown-unknown/release/data_storage.wasm"
- Make sure you ran `cargo build` first
- Make sure you're in the `contracts/data_storage` directory
- Check output for build errors

### "network passphrase" error
- Make sure testnet name is correct: `testnet`
- Check .env file VITE_NETWORK_PASSPHRASE is exactly: `Test SDF Network ; September 2015`

## What Each Contract Does

### data_storage (Recommended for most uses)
- Store key-value data
- Owner-based access control
- Public/private flags
- Update and delete support
- Perfect for audit storage

**Deploy this one if unsure**

### audit_registry (Legacy)
- Store audit hashes only
- Simpler functionality
- Lighter weight
- Use if you want minimal contract

## Deployment Checklist

- [ ] Rust installed (`rustc --version` works)
- [ ] Soroban CLI installed (`soroban --version` works)
- [ ] Created account (Freighter or CLI key)
- [ ] Account funded with 10 XLM (from testnet faucet)
- [ ] Built contract (`cargo build --release --target wasm32-unknown-unknown`)
- [ ] Have contract ID (from deployment output)
- [ ] Updated .env with VITE_CONTRACT_ID
- [ ] Restarted frontend (`npm run dev`)
- [ ] Restarted backend (`npm start`)
- [ ] Tested "Store on Blockchain" button

## Expected Output

### When Building
```
Compiling data_storage v0.1.0
    Finished release [optimized] target(s) in 15.23s
```

### When Deploying
```
Deployed contract to testnet
Contract ID: CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV
```

## After Deployment

### Your app should:
- ✅ Accept blockchain storage
- ✅ Store audit hashes on-chain
- ✅ Show transaction hash when successful
- ✅ No more "smart contract not deployed" message

### You can now:
- ✅ Store all future audits on blockchain
- ✅ Retrieve audit hashes on-chain
- ✅ Use Stellar blockchain as audit record
- ✅ Share immutable audit proofs

---

## Next Steps After Deployment

1. **Test thoroughly** on testnet
2. **Security review** before mainnet
3. **Verify contracts** work as expected
4. **Create monitoring** for transaction costs
5. **Plan mainnet deployment** (when ready)

## Need Help?

- Check logs in browser console (F12)
- Check terminal output for errors
- Read Soroban docs: https://soroban.stellar.org/
- Visit Stellar Discord: https://discord.gg/stellar

---

**Ready?** Start from **Step 1** and follow each step in order!
