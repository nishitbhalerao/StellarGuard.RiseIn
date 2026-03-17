# Admin Access - Quick Fix Guide

Your admin authentication system is now secured with specific credentials!

## Admin Credentials

**Email:** `bhaleraonishit@gmail.com`
**Password:** `nishit@stellarguard2026`

⚠️ **IMPORTANT:** Only this exact combination grants admin access. Regular users can login with any email/password combination.

## What Was Wrong?
- ❌ Admin endpoints had NO security checks
- ❌ Multiple emails could be admin
- ❌ Password wasn't validated

## What's Fixed?
- ✅ Specific email & password required for admin
- ✅ Backend verifies admin credentials
- ✅ Database tracks admin status securely
- ✅ Frontend syncs with backend

## Quick Start

### 1. Login as Admin
Use exactly these credentials:
- **Email:** `bhaleraonishit@gmail.com`
- **Password:** `nishit@stellarguard2026`

### 2. You Should Now See
- ✅ Admin dashboard accessible
- ✅ All audits visible
- ✅ All users visible
- ✅ Can delete audits
- ✅ Can delete users
- ✅ Stats and analytics

### 3. Regular Users
Any other email/password combination creates a regular (non-admin) user:
- Can login with: `user@example.com` and any password
- Cannot access admin features
- Can only see their own audits

## How It Works

### Admin Login Flow
```
Enter: bhaleraonishit@gmail.com + nishit@stellarguard2026
        ↓
Backend verifies exact match
        ↓
Sets isAdmin=true in database
        ↓
Frontend loads admin dashboard
        ↓
Full admin access granted
```

### Regular User Login Flow
```
Enter: any other email + any password
        ↓
Backend creates regular user
        ↓
Sets isAdmin=false in database
        ↓
Can use basic features only
```

## Test It Now

1. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear all data
   - Reload page

2. **Login with admin credentials:**
   - Email: `bhaleraonishit@gmail.com`
   - Password: `nishit@stellarguard2026`

3. **Verify admin dashboard:**
   - Should show all audits
   - Should show all users
   - Delete buttons should work

4. **Test regular user:**
   - Logout
   - Login with: `user@test.com` / `anypassword`
   - Should NOT see admin dashboard
   - Should only see limited features

## Change Admin Credentials (If Needed)

⚠️ **Warning:** Keep these credentials safe!

To change them:

1. Open: `backend/routes/user.routes.js`
2. Find:
```javascript
const ADMIN_CREDENTIALS = {
  email: 'bhaleraonishit@gmail.com',
  password: 'nishit@stellarguard2026'
};
```
3. Update with new values
4. Restart backend server

## Troubleshooting

### "Admin access required" Error
1. Check your email - must be exact: `bhaleraonishit@gmail.com`
2. Check password - must be exact: `nishit@stellarguard2026`
3. Try logout and login again
4. Clear browser cache

### Still Can't Access Admin Dashboard?
1. Make sure backend is running
2. Make sure you used EXACT credentials
3. Check browser console for errors
4. Try restarting both servers

### Forgot Admin Password?
Update it in `backend/routes/user.routes.js` in the `ADMIN_CREDENTIALS` object

## Security Notes

1. **Hardcoded Credentials** - Currently stored in code (demo only)
2. **No Password Hashing** - Demo simplicity (add in production)
3. **Header Authentication** - Uses `x-user-email` header for verification
4. **Database Tracking** - Admin status stored in MongoDB

## API Details

### Admin Registration
```javascript
POST /api/user/register
{
  "email": "bhaleraonishit@gmail.com",
  "password": "nishit@stellarguard2026",
  "name": "Admin"
}

// Response
{
  "success": true,
  "data": {
    "email": "bhaleraonishit@gmail.com",
    "isAdmin": true  // Automatically set!
  }
}
```

### Regular User Registration
```javascript
POST /api/user/register
{
  "email": "user@example.com",
  "password": "anypassword",
  "name": "User"
}

// Response
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "isAdmin": false  // Regular user
  }
}
```

## Files Modified

1. **backend/routes/user.routes.js** - Admin credential validation
2. **src/context/AuthContext.jsx** - Sends password to backend
3. **backend/middleware/auth.middleware.js** - Validates requests
4. **src/services/adminApiService.js** - Secure API calls

## Restart Servers

Make sure both are running:

```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: Frontend
npm run dev
```

---

**Admin Email:** `bhaleraonishit@gmail.com`
**Admin Password:** `nishit@stellarguard2026`

Keep these credentials secure!

---

For detailed technical docs, see: [ADMIN_AUTH_SETUP.md](./ADMIN_AUTH_SETUP.md)
