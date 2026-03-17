# ⚡ Deploy in 10 Minutes - Express Guide

Copy-paste your way to blockchain deployment in under 10 minutes.

## 🎯 The Fastest Path

### 1️⃣ Open PowerShell and Navigate
```powershell
cd C:\Users\Nishit Bhalerao\Desktop\StellarGuard\contracts\data_storage
```

### 2️⃣ Build (Takes 2 min)
```powershell
cargo build --release --target wasm32-unknown-unknown
```
⏳ Wait for completion...

### 3️⃣ Create Your Key (1 min)
```powershell
soroban keys generate --name mykey
```
- Enter a strong password twice
- **Copy the Public key: G...** address

### 4️⃣ Fund Account (2 min)
**Go to**: https://stellar.org/developers/testnet-lab
1. Paste your G... address
2. Click "Get 10,000 XLM"
3. Wait for success

### 5️⃣ Deploy! (2 min)
```powershell
soroban contract deploy `
  --wasm .\target\wasm32-unknown-unknown\release\data_storage.wasm `
  --source-account mykey `
  --network testnet
```
- Type your password when asked
- **Copy the Contract ID: CDATA...**

### 6️⃣ Update .env (1 min)
Edit `.env` file, replace this line:
```env
VITE_CONTRACT_ID=your_deployed_contract_id_here
```

With your contract ID:
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

Save file (Ctrl+S)

### 7️⃣ Restart Servers (1 min)

**New PowerShell Window:**
```powershell
npm run dev
```

**Another new PowerShell Window:**
```powershell
cd backend
npm start
```

### 8️⃣ Test It! 
1. Go to http://localhost:5173
2. Login: `bhaleraonishit@gmail.com` / `nishit@stellarguard2026`
3. Upload contract
4. Click "Store on Blockchain"
5. ✅ It works!

---

## ⚡ Total: ~10 minutes

---

## 🆘 If Something Goes Wrong

| Error | Fix |
|-------|-----|
| `cargo: not found` | Install Rust: rustup.rs |
| `soroban: not found` | `cargo install soroban-cli` |
| `account not found` | Fund account at testnet faucet again |
| `passphrase incorrect` | Retry deployment, type correct password |
| Still shows error message | Restart frontend with `npm run dev` |

---

## More Help?

- Detailed: **DEPLOYMENT_STEPS.md**
- Visual: **DEPLOYMENT_VISUAL.md**
- Checklist: **DEPLOY_CHECKLIST.md**

---

Go! ⚡
