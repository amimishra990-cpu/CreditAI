# Frontend Security Implementation

## Overview

The CreditAI frontend implements enterprise-grade security with JWT authentication, protected routes, secure session management, and comprehensive error handling.

## Security Features Implemented

### 1. Authentication System

#### JWT Token Management
- **Storage**: Tokens stored in HTTP-only cookies (8-hour expiry)
- **User Data**: User profile stored in localStorage (non-sensitive data only)
- **Auto-refresh**: Token validation on app load
- **Secure logout**: Complete cleanup of auth data

#### Auth Context (`/src/contexts/AuthContext.tsx`)
```typescript
- Centralized authentication state management
- Automatic token validation on mount
- Protected API calls with auto-retry
- Session persistence across page reloads
```

### 2. Protected Routes

#### Route Protection (`/src/components/ProtectedRoute.tsx`)
- Automatic redirect to login for unauthenticated users
- Role-based access control (RBAC)
- Loading states during authentication check
- Hierarchical role system:
  - **Viewer** (Level 1): Read-only access
  - **Analyst** (Level 2): Can create and manage workspaces
  - **Admin** (Level 3): Full system access

#### Usage Example
```typescript
<ProtectedRoute requiredRole="analyst">
  <OnboardingPage />
</ProtectedRoute>
```

### 3. API Client (`/src/lib/api.ts`)

#### Axios Interceptors
**Request Interceptor:**
- Automatically adds JWT token to all requests
- Sets proper headers

**Response Interceptor:**
- Handles 401 (Unauthorized) - Auto logout and redirect
- Handles 403 (Forbidden) - Permission denied
- Handles 423 (Locked) - Account locked
- Handles 429 (Rate Limited) - Too many requests
- User-friendly error messages via toast notifications

#### API Methods
```typescript
- login(email, password)
- register(userData)
- getProfile()
- changePassword(current, new)
- createWorkspace(data)
- getWorkspaces()
- uploadDocuments(formData)
- runAnalysis(data)
- orchestrate(data)
- generateReport(data)
```

### 4. Secure Session Management

#### Cookie Configuration
```typescript
{
  expires: 1/3,  // 8 hours
  secure: true,  // HTTPS only in production
  sameSite: 'strict'  // CSRF protection
}
```

#### LocalStorage Usage
- Only non-sensitive data stored
- User profile (name, email, role, organization)
- Workspace ID for convenience
- No tokens or passwords ever stored

### 5. User Interface Security

#### Login Page (`/src/app/login/page.tsx`)
- Password visibility toggle
- Loading states prevent double submission
- Rate limiting feedback
- Account lockout warnings
- Security notices displayed

#### TopBar Component
- User profile display
- Role badge with color coding
- Secure logout functionality
- Organization display

### 6. Input Validation

#### Client-Side Validation
- Email format validation
- Password strength requirements
- Required field validation
- Real-time feedback

#### Server-Side Validation
- All inputs validated on backend
- Sanitization applied
- Error messages returned to frontend

## Security Best Practices

### 1. Token Security
```typescript
// ✅ Good - Token in HTTP-only cookie
Cookies.set(TOKEN_KEY, token, { 
  expires: 1/3, 
  secure: true,
  sameSite: 'strict' 
});

// ❌ Bad - Token in localStorage
localStorage.setItem('token', token);
```

### 2. Protected Routes
```typescript
// ✅ Good - Wrap sensitive pages
<ProtectedRoute requiredRole="analyst">
  <SensitivePage />
</ProtectedRoute>

// ❌ Bad - No protection
<SensitivePage />
```

### 3. API Calls
```typescript
// ✅ Good - Use apiClient with interceptors
const response = await apiClient.getWorkspaces();

// ❌ Bad - Direct fetch without auth
const response = await fetch('/api/workspaces');
```

### 4. Error Handling
```typescript
// ✅ Good - User-friendly messages
toast.error("Session expired. Please login again.");

// ❌ Bad - Technical error messages
toast.error(error.stack);
```

## Environment Variables

### Required (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

### Production Configuration
```env
NEXT_PUBLIC_BACKEND_URL=https://api.your-domain.com
```

## Component Security Checklist

### Before Deploying a New Component

- [ ] Wrap with ProtectedRoute if sensitive
- [ ] Use apiClient for all API calls
- [ ] Validate all user inputs
- [ ] Handle loading and error states
- [ ] Never expose sensitive data in console.log
- [ ] Use toast for user feedback
- [ ] Test with different user roles
- [ ] Verify RBAC works correctly

## Common Security Patterns

### 1. Fetching Protected Data
```typescript
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await apiClient.getWorkspaces();
      setData(response.data);
    } catch (error) {
      // Error handled by interceptor
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### 2. Form Submission with Auth
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await apiClient.createWorkspace(formData);
    toast.success("Workspace created!");
    router.push("/dashboard");
  } catch (error) {
    // Error handled by interceptor
  } finally {
    setLoading(false);
  }
};
```

### 3. Role-Based UI
```typescript
const { user } = useAuth();

return (
  <>
    {user?.role === "admin" && (
      <AdminOnlyButton />
    )}
    
    {["admin", "analyst"].includes(user?.role || "") && (
      <CreateWorkspaceButton />
    )}
  </>
);
```

## Security Testing

### Manual Testing Checklist

1. **Authentication Flow**
   - [ ] Login with valid credentials
   - [ ] Login with invalid credentials
   - [ ] Login with locked account
   - [ ] Logout functionality
   - [ ] Session persistence after refresh
   - [ ] Token expiration handling

2. **Authorization**
   - [ ] Viewer cannot access analyst features
   - [ ] Analyst cannot access admin features
   - [ ] Admin can access all features
   - [ ] Protected routes redirect correctly

3. **API Security**
   - [ ] Requests include auth token
   - [ ] 401 triggers logout
   - [ ] 403 shows permission error
   - [ ] Rate limiting works
   - [ ] Error messages are user-friendly

4. **Session Management**
   - [ ] Token expires after 8 hours
   - [ ] Logout clears all auth data
   - [ ] Multiple tabs sync auth state
   - [ ] Browser back button doesn't expose data

## Troubleshooting

### "Session expired" on every request
**Cause**: Token not being sent or invalid
**Fix**: Check cookie settings, ensure HTTPS in production

### Infinite redirect loop
**Cause**: Protected route redirecting to itself
**Fix**: Ensure login page is not wrapped in ProtectedRoute

### CORS errors
**Cause**: Backend not allowing frontend origin
**Fix**: Update CORS settings in backend to include frontend URL

### Token not persisting
**Cause**: Cookie settings incompatible with browser
**Fix**: Check secure/sameSite settings, use HTTPS

## Production Deployment

### Security Checklist

- [ ] Use HTTPS for all connections
- [ ] Set secure: true for cookies
- [ ] Update NEXT_PUBLIC_BACKEND_URL to production API
- [ ] Enable CSP headers
- [ ] Set up rate limiting on frontend (Cloudflare, etc.)
- [ ] Implement session timeout warnings
- [ ] Add security headers via Next.js config
- [ ] Enable audit logging
- [ ] Set up monitoring and alerts
- [ ] Test all auth flows in production

### Next.js Security Headers

Add to `next.config.ts`:
```typescript
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};
```

## Monitoring & Logging

### What to Monitor
- Failed login attempts
- 401/403 errors
- API response times
- Token expiration events
- User session duration

### Logging Best Practices
```typescript
// ✅ Good - Log important events
console.log('User logged in:', user.email);

// ❌ Bad - Log sensitive data
console.log('Token:', token);
console.log('Password:', password);
```

## Additional Resources

- [OWASP Frontend Security](https://cheatsheetseries.owasp.org/)
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [React Security](https://reactjs.org/docs/dom-elements.html#dangerouslysetinnerhtml)

## Support

For security issues:
1. Check this documentation
2. Review browser console for errors
3. Check network tab for API responses
4. Verify backend is running and accessible
5. Contact your security team for critical issues
