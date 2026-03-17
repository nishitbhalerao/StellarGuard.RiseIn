# Deployment Step-by-Step Visual Guide

Follow these steps exactly. Screenshots show what you should see.

## STEP 1: Open PowerShell
```
C:\Users\Nishit Bhalerao\Desktop\StellarGuard>
```

## STEP 2: Check Rust is Installed

**Type:**
```powershell
rustc --version
```

**You should see something like:**
```
rustc 1.75.0 (1d8b05fc5 2023-12-21)
```

✅ If you see a version → Continue to Step 3
❌ If error → Install from https://rustup.rs/

## STEP 3: Check Soroban is Installed

**Type:**
```powershell
soroban --version
```

**You should see:**
```
soroban 21.2.0
```

✅ If you see version → Continue to Step 4
❌ If error → Run this:
```powershell
cargo install soroban-cli
```
Then wait 2-3 minutes... you'll see:
```
Compiling soroban-cli v21.2.0
... lots of compilation ...
Finished release [optimized] target(s) in 145.23s
Installed package `soroban-cli` v21.2.0
```

## STEP 4: Navigate to Contract Folder

**Type:**
```powershell
cd contracts/data_storage
```

**You should see:**
```
C:\Users\Nishit Bhalerao\Desktop\StellarGuard\contracts\data_storage>
```

✅ Path shows `/data_storage` → Correct

## STEP 5: Build the Contract

**Type:**
```powershell
cargo build --release --target wasm32-unknown-unknown
```

**You'll see:**
```
   Compiling data-storage v0.1.0
    Finished release [optimized] target(s) in 15.23s
```

⏳ Wait 15-30 seconds

✅ If "Finished" message → Continue to Step 6
❌ If errors → Check they're real errors (not warnings)

## STEP 6: Create Your Wallet Key

**Type:**
```powershell
soroban keys generate --name mykey
```

**You'll be asked:**
```
Enter passphrase for key:
```

**Type a strong password** (you'll use this later)

Then confirm:
```
Re-enter passphrase:
```

**You'll see:**
```
Created keypair for key "mykey"

Public key: G3QZ7AFEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQX...
```

✅ Copy the `G3QZ7A...` address

**Alternative**: If you already have keys:
```powershell
soroban keys list
```

Copy any `G...` address

## STEP 7: Fund Your Account

**Go to**: https://stellar.org/developers/testnet-lab

**In browser:**
1. Paste the `G...` address from Step 6
2. Click "Get 10,000 XLM"
3. Wait for "Success!" message

✅ Your account now has 10,000 XLM

## STEP 8: Deploy Contract to Testnet

**Type:**
```powershell
soroban contract deploy `
  --wasm .\target\wasm32-unknown-unknown\release\data_storage.wasm `
  --source-account mykey `
  --network testnet
```

You'll be asked for your passphrase from Step 6.

**Type your password** (it won't show as you type)

**You'll see:**
```
Initialized and signing transaction...
Deploying contract...
[====================] 100%
Contract deployed
Contract ID: CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV
```

✅ **COPY THE CONTRACT ID** (the long `CDATA...` string)

## STEP 9: Update .env File

**In VS Code:**
1. Open `.env` file (in root folder)
2. Find the line:
```env
VITE_CONTRACT_ID=your_deployed_contract_id_here
```

3. Replace with your contract ID:
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3QXPQVQXPQVQXPQVQXPQVQXPQV
```

4. **Save file** (Ctrl+S)

✅ File saved with contract ID

## STEP 10: Restart Frontend

**In PowerShell (root directory):**

First, if anything is running, press `Ctrl+C` to stop it.

**Type:**
```powershell
npm run dev
```

You'll see:
```
  VITE v5.0.0  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

✅ Frontend running at localhost:5173

## STEP 11: Restart Backend

**In a NEW PowerShell window:**

```powershell
cd backend
npm start
```

You'll see:
```
🚀 StellarGuard backend running on port 3000
✅ MongoDB connected
```

✅ Backend running at localhost:3000

## STEP 12: Test It Works!

1. **Open browser**: http://localhost:5173
2. **Login**:
   - Email: `bhaleraonishit@gmail.com`
   - Password: `nishit@stellarguard2026`
3. **Click**: "Upload"
4. **Upload** any `.sol` file and click "Analyze"
5. **In report**, click: "Store on Blockchain"
6. **You should see**: "Audit stored on blockchain!" ✅

---

## If Something Goes Wrong

### Error: "passphrase incorrect"
- You entered the wrong password in Step 8
- Re-run: `soroban contract deploy ...`
- Type the correct password

### Error: "account not found"
- Your testnet account not funded
- Go to Step 7 again, fund account
- Wait 10 seconds
- Retry Step 8

### Error: "WASM file not found"
- You skipped Step 5 (cargo build)
- Go back to Step 4
- Run: `cargo build --release --target wasm32-unknown-unknown`
- Then try Step 8 again

### "Store on Blockchain" still shows error
- Check .env file has correct contract ID (Step 9)
- Check contract ID starts with `CDATA`
- Restart frontend: press `Ctrl+C`, then `npm run dev`

### Can't connect to http://localhost:5173
- Frontend not running (Step 10)
- Run: `npm run dev` in PowerShell

---

## All Done! ✅

Your smart contract is now deployed and your app can:
- ✅ Store audits on Stellar blockchain
- ✅ Generate immutable audit records
- ✅ Verify contract security on-chain
- ✅ Share blockchain-backed audit proofs

**Congratulations!** 🎉

---

## Common Questions

**Q: Can I use a different contract?**
A: Yes, deploy audit_registry instead: `cd ../audit_registry`

**Q: How long does deployment take?**
A: Usually 10-30 seconds

**Q: Do I need to pay anything?**
A: No, testnet is free. XLM from faucet is fake.

**Q: Can I deploy to mainnet later?**
A: Yes, but be careful. Mainnet costs real money.

**Q: What if I lose my passphrase?**
A: You can regenerate: `soroban keys generate --name newkey`

**Q: Can I change the contract ID later?**
A: Yes, just update .env and restart

**Q: What if deployment fails?**
A: Try again. Most common cause is funding issue (Step 7).

---

If still stuck, read: **DEPLOYMENT_STEPS.md** for detailed explanations.
