# ⚡ Deploy NOW - 2 Minutes (No Installation)

**Zero setup. Just copy-paste your contract and click Deploy.**

---

## 🚀 The Fastest Way

### 1️⃣ Open Web IDE
```
→ Go to: https://soroban.stellar.org
```

---

### 2️⃣ Copy Your Contract Code

**In VS Code, open this file:**
```
contracts/data_storage/src/lib.rs
```

**Select ALL (Ctrl+A) → Copy (Ctrl+C)**

---

### 3️⃣ Paste in Web IDE

In the browser (soroban.stellar.org):
1. Click **"New Project"** (or **"+"** button)
2. Name it: `data_storage`
3. Click on **`src/lib.rs`** in left panel
4. **Delete all** template code (Ctrl+A → Del)
5. **Paste your code** (Ctrl+V)
6. Click **"Build"** button (green button, top)
7. Wait for ✅ **"Build successful"**

---

### 4️⃣ Deploy to Testnet

1. Click **"Deploy"** button
2. Click **"Select Wallet"** → Pick **Freighter**
3. **Approve** the connection popup
4. Wait 10 seconds...
5. See: **"Contract ID: CDATA..."** ✅

---

### 5️⃣ Copy Contract ID

You'll see something like:
```
CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

**Copy the entire thing** (on your screen)

---

## 🔧 6️⃣ Update .env File

In VS Code, open `.env` file:

**Find this:**
```env
VITE_CONTRACT_ID=your_deployed_contract_id_here
```

**Replace with your ID:**
```env
VITE_CONTRACT_ID=CDATA7Z2Z7AEBLGP7LK7JXSQPZXM5A3Q...
```

**Save** (Ctrl+S)

---

## ⚡ 7️⃣ Restart FRONTEND Server

In PowerShell (Desktop\StellarGuard folder):

```powershell
npm run dev
```

Wait for: `VITE v5.0.0 ready in XXX ms`

---

## ✅ 8️⃣ Test It!

1. Go to: **http://localhost:5173**
2. Login: `bhaleraonishit@gmail.com` / `nishit@stellarguard2026`
3. Upload any file
4. Click **"Store on Blockchain"**
5. See ✅ **Success message!**

---

## ⏱️ Total Time: 2-3 minutes

Yes, that's it. You're now storing data on the blockchain! 🎉

---

## 🆘 If stuck:

| Issue | Fix |
|-------|-----|
| Code won't build | Check you copied the ENTIRE file (should be 400+ lines) |
| Freighter doesn't pop up | Go to freighter.app, install extension, refresh page |
| Still shows "not deployed" | You forgot to **restart frontend** with `npm run dev` |
| Can't find Web IDE | Try: https://soroban.stellar.org/build |

---

**Go do it now!** You've got everything! ⚡✨
