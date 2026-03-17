# Quick Deployment Commands

Copy and paste these commands in PowerShell to deploy your smart contract.

## 1. Check Prerequisites (Run These First)

```powershell
# Check Rust
rustc --version

# Check Soroban CLI - if this fails, run the install command below
soroban --version
```

If `soroban --version` fails, install it:
```powershell
cargo install soroban-cli
```

## 2. Build Smart Contract

```powershell
cd contracts/data_storage
cargo build --release --target wasm32-unknown-unknown
```

⏳ Wait 15-30 seconds for build to complete.

## 3. Create or View Your Account

### Option A: Create new key (first time only)
```powershell
soroban keys generate --name mykey
```

**IMPORTANT**: Remember the passphrase you enter!

### Option B: List existing keys
```powershell
soroban keys list
```

After either command, you'll see a `Public Key: G...` - **save this address**.

## 4. Fund Your Account on Testnet

**Go to**: https://stellar.org/developers/testnet-lab

1. Paste the public key (the `G...` address)
2. Click "Get 10,000 XLM"
3. Wait for confirmation

## 5. Deploy Contract (This Creates Contract ID!)

```powershell
soroban contract deploy `
  --wasm .\target\wasm32-unknown-unknown\release\data_storage.wasm `
  --source-account mykey `
  --network testnet
```

⏳ Wait 10-30 seconds. Output will show:

```
Deployed contract to testnet
Contract ID: CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

**COPY THE CONTRACT ID** (the `CDATA...` part)

## 6. Update .env File

Open `.env` in VSCode and replace:

```env
VITE_API_URL=http://localhost:3000
VITE_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
VITE_NETWORK_PASSPHRASE=Test SDF Network ; September 2015
VITE_CONTRACT_ID=PASTE_YOUR_CONTRACT_ID_HERE
```

**Replace `PASTE_YOUR_CONTRACT_ID_HERE` with the contract ID from step 5**

Example:
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV
```

## 7. Restart Servers

### In Terminal with Ctrl+C to stop everything, then:

**Terminal 1** - Backend:
```powershell
cd backend
npm start
```

**Terminal 2** - Frontend (new terminal):
```powershell
npm run dev
```

## 8. Test It Works!

1. Open http://localhost:5173
2. Login with:
   - Email: `bhaleraonishit@gmail.com`
   - Password: `nishit@stellarguard2026`
3. Upload a contract for audit
4. In audit report, click "Store on Blockchain"
5. Should work now! ✅

---

## If You Get Stuck

### Error: "cargo: command not found"
Install Rust from: https://rustup.rs/

### Error: "soroban: command not found"
```powershell
rustup update
cargo install soroban-cli
```

### Error: "Account not found"
- Go to: https://stellar.org/developers/testnet-lab
- Fund your account again
- Wait 10 seconds
- Retry deployment

### Error: "WASM file not found"
- Make sure you ran `cargo build` first
- Check you're in `contracts/data_storage` folder
- Check file exists: `target/wasm32-unknown-unknown/release/data_storage.wasm`

---

## Summary

1. ✅ Build: `cargo build --release --target wasm32-unknown-unknown`
2. ✅ Deploy: `soroban contract deploy --wasm ... --source-account mykey --network testnet`
3. ✅ Copy: Contract ID from output
4. ✅ Update: `.env` file
5. ✅ Restart: `npm run dev` and `npm start`
6. ✅ Test: Click "Store on Blockchain" button

**Total time**: 5-10 minutes

---

**Need detailed help?** See: DEPLOYMENT_STEPS.md
