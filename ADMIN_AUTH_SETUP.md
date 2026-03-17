# Admin Authentication Setup

## Overview

The admin authentication system has been fixed to properly handle admin access with both frontend and backend authorization.

## How It Works

### 1. Admin User Registration
When a user logs in or signs up with an admin email, they are automatically granted admin privileges.

**Admin Emails:**
```
bhaleraonishit@gmail.com
admin@stellarguard.com
nishit@stellarguard.com
```

### 2. Backend Authentication Middleware

#### `authenticate` Middleware
- Checks for `x-user-email` header in every request
- Verifies that the user exists in the database
- Attaches user object to request for use in route handlers

#### `requireAdmin` Middleware
- Must be used after `authenticate` middleware
- Verifies that the user's `isAdmin` flag is set to `true`
- Returns 403 Forbidden if user is not admin

### 3. Protected Routes

The following routes now require admin authentication:

#### User Routes
- `GET /api/user/admin/all` - Get all users (protected)
- `DELETE /api/user/admin/:userEmail` - Delete user (protected)

#### Audit Routes
- `GET /api/audit/admin/all` - Get all audits (protected)
- `DELETE /api/audit/admin/:auditId` - Delete audit (protected)

### 4. Frontend Authorization

The `AuthContext` has been updated to:
- Fetch admin status from the backend during login
- Sync admin status when loading user from localStorage
- Provide `isAdmin` flag in the auth context

### 5. API Service

The `adminApiService.js` provides a utility service that:
- Automatically adds `x-user-email` header to all requests
- Handles authentication for admin endpoints
- Provides methods for all admin operations

## How to Use

### For Regular Users

1. Sign up or login with any email:
```javascript
const { login } = useAuth();
await login('user@example.com', 'password123');
```

2. User is created in the database with `isAdmin: false`

### For Admin Users

1. Login with an admin email:
```javascript
const { login } = useAuth();
await login('admin@stellarguard.com', 'anypassword');
```

2. The backend automatically sets `isAdmin: true` for known admin emails
3. Frontend fetches this status and enables admin features
4. User can now access admin dashboard and make admin API calls

### Making Admin API Calls

Use the `useAdminApi()` hook in your components:

```javascript
import { useAdminApi } from '../services/adminApiService';

function AdminComponent() {
  const adminApi = useAdminApi();

  const loadAllUsers = async () => {
    try {
      const data = await adminApi.fetchAllUsers();
      console.log('All users:', data.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  return (
    <button onClick={loadAllUsers}>Load Users</button>
  );
}
```

## Available Admin API Methods

### Users
- `fetchAllUsers()` - Get all users with audit counts
- `deleteUser(userEmail)` - Delete a user and all their audits
- `fetchUserDetails(userEmail)` - Get user and their audits

### Audits
- `fetchAllAudits()` - Get all audits
- `deleteAudit(auditId)` - Delete an audit
- `fetchAuditDetails(auditId)` - Get audit details

## Adding More Admin Accounts

To add more admin email addresses:

1. Edit [backend/routes/user.routes.js](../backend/routes/user.routes.js)
2. Add the email to the `ADMIN_EMAILS` array:

```javascript
const ADMIN_EMAILS = [
  'bhaleraonishit@gmail.com',
  'admin@stellarguard.com',
  'nishit@stellarguard.com',
  'newadmin@example.com'  // Add here
];
```

3. Restart the backend server

## Database Changes

### User Model Updated
Added `isAdmin` field to track admin status:

```javascript
{
  email: String,
  name: String,
  isAdmin: Boolean,  // NEW
  createdAt: Date,
  lastActive: Date,
  auditCount: Number
}
```

## Request/Response Examples

### Login Request
```javascript
// POST /api/user/register
{
  "email": "admin@stellarguard.com",
  "name": "Admin User"
}

// Response
{
  "success": true,
  "data": {
    "_id": "...",
    "email": "admin@stellarguard.com",
    "name": "Admin User",
    "isAdmin": true,  // Set automatically for admin emails
    "createdAt": "2026-03-16T...",
    "lastActive": "2026-03-16T..."
  }
}
```

### Protected Request Header
```javascript
GET /api/audit/admin/all HTTP/1.1
Host: localhost:3000
x-user-email: admin@stellarguard.com
Content-Type: application/json
```

### Unauthorized Response
```json
{
  "success": false,
  "error": "Admin access required"
}
```

## Error Handling

### Missing Email Header
```
401 Unauthorized
"User email is required in headers (x-user-email)"
```

### User Not Found
```
401 Unauthorized
"User not found"
```

### Not Admin
```
403 Forbidden
"Admin access required"
```

## Security Considerations

1. **Header-based Authentication**: Uses `x-user-email` header instead of cookies/tokens
2. **Backend Verification**: Every admin request is verified at the backend
3. **Database Syncing**: Admin status is stored in the database and synced with frontend
4. **Case-Insensitive Matching**: Admin email matching is case-insensitive
5. **No Password Storage**: Currently doesn't store passwords (demo mode)

## Testing Admin Features

### 1. Test Admin Login
```bash
# Use curl or Postman
curl -X POST http://localhost:3000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stellarguard.com",
    "name": "Admin"
  }'
```

### 2. Test Fetching All Audits
```bash
curl -X GET http://localhost:3000/api/audit/admin/all \
  -H "x-user-email: admin@stellarguard.com"
```

### 3. Test Unauthorized Access
```bash
# Should fail with 401/403
curl -X GET http://localhost:3000/api/audit/admin/all \
  -H "x-user-email: user@example.com"
```

## Troubleshooting

### Admin Dashboard Not Showing
1. Check browser console for errors
2. Verify you're logged in with an admin email
3. Check that the backend server is running
4. Verify the email is in the `ADMIN_EMAILS` list

### API Returns 403 Forbidden
1. Ensure `x-user-email` header is being sent
2. Verify the email in the header matches your login email
3. Check that the user exists in the database
4. Verify the user's `isAdmin` flag is `true` in the database

### Data Not Loading
1. Check browser DevTools Network tab for failed requests
2. Look at backend console for error logs
3. Verify MongoDB is running and connected
4. Check that audit/user data exists in the database

## Future Enhancements

- [ ] Implement JWT token-based authentication
- [ ] Add password hashing and verification
- [ ] Implement role-based access control (RBAC)
- [ ] Add audit logs for all admin actions
- [ ] Implement permission-based authorization
- [ ] Add multi-factor authentication (MFA) for admins
- [ ] Rate limiting for admin endpoints

---

For more information, see the main [README.md](../README.md)
