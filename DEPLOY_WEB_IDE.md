# 🌐 Deploy Using Soroban Web IDE (5 minutes)

**Zero installation. Deploy in your browser.**

---

## 📋 Step 1: Get Your Contract Code

Open this file and **copy all the code**:
```
contracts/data_storage/src/lib.rs
```

---

## 🌍 Step 2: Go to Soroban Playground

**Open this link** in your browser:
```
https://soroban.stellar.org
```

Or search: **"Soroban Playground"**

---

## 📝 Step 3: Create New Contract

1. Click **"+ New"** or **"Create Contract"**
2. Name it: `data_storage`
3. Select **"Empty Rust Project"**
4. Wait for it to load (takes 10 seconds)

---

## 🔧 Step 4: Paste Your Contract

1. In the left panel, click `src/lib.rs`
2. **Delete all** the template code
3. **Paste** the code from `contracts/data_storage/src/lib.rs`
4. Click **"Build"** button (or Ctrl+S)
5. Wait for ✅ "Build successful"

---

## 🚀 Step 5: Deploy to Testnet

1. Click **"Deploy"** button (green button, top-right)
2. It asks for your **Freighter wallet** (if not installed, install from freighter.app)
3. Click **"Connect Wallet"**
4. **Approve** in Freighter popup
5. It shows: **"Funding account..."** → Wait 10 seconds
6. Shows: **"Contract ID: CDATA..."** ✅

---

## 💾 Step 6: Copy Contract ID

On the deployment screen, you'll see:
```
Contract ID: CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

**Copy this entire ID** (including the CDATA part)

---

## 🔐 Step 7: Update .env File

1. Open: `.env` file in VS Code
2. Find this line:
```env
VITE_CONTRACT_ID=your_deployed_contract_id_here
```

3. Replace with your actual ID:
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

4. **Save** (Ctrl+S)

---

## ⚡ Step 8: Restart Servers

**Open PowerShell in StellarGuard folder:**

**Terminal 1 (Frontend):**
```powershell
npm run dev
```

**Terminal 2 (Backend):**
```powershell
cd backend
npm start
```

Wait for both to show "running" or "listening"

---

## ✅ Step 9: Test Blockchain Feature

1. Go to: **http://localhost:5173**
2. Login: `bhaleraonishit@gmail.com` / `nishit@stellarguard2026`
3. Upload a contract file
4. Click **"Store on Blockchain"**
5. Should show ✅ **Success!**

---

## 🎯 Done! 

Your contract is now deployed and blockchain storage works!

---

## 🆘 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Contract not found" error | Contract ID was copied wrong - check VITE_CONTRACT_ID in .env |
| Freighter wallet popup won't appear | Install Freighter extension: freighter.app |
| Still shows "not deployed" error | Restart frontend: `npm run dev` (must restart after .env change) |
| "Build failed" in Web IDE | Check if code was pasted completely (should have `#[contract]` at top) |

---

## 📱 Alternative: If Web IDE is down

If soroban.stellar.org is unavailable:

**Use this mirror:**
```
https://stellar.expert/soroban
```

Or try later today.

---

**Need help? Follow the steps above!** ✨
