# New Onboarding Flow - CreditAI

## Overview

The system now implements a streamlined onboarding flow where new users complete a one-time registration, receive auto-generated credentials, and can then login to access their dashboard.

## User Journey

### 1. Landing Page (/)
- **New Users**: Click "Get Started" → Go to Onboarding
- **Existing Users**: Click "Sign In" → Go to Login

### 2. Onboarding (/onboarding)
- **Public Access**: No authentication required
- **One-Time Only**: Each company (CIN) can only onboard once
- **Auto-Generated Credentials**: System creates secure login credentials

#### Form Fields:
**Step 1 - Company Details:**
- Company Name* (required)
- CIN* (required)
- PAN* (required)
- Sector* (required)
- Annual Turnover
- Contact Person* (required)
- Contact Email (optional - auto-generated if not provided)

**Step 2 - Loan Details:**
- Loan Type
- Loan Amount* (required)
- Loan Tenure
- Interest Rate

#### What Happens:
1. User fills company and loan details
2. System validates CIN is unique (prevents duplicate onboarding)
3. Backend creates:
   - Workspace with company/loan data
   - User account with auto-generated password
   - Links user to workspace
4. User sees credentials screen with:
   - Email (auto-generated or provided)
   - Password (12-char secure password)
   - Copy buttons for both
   - Warning to save credentials
5. User is auto-logged in
6. Redirected to dashboard

### 3. Credentials Screen
- **One-Time Display**: Password shown only once
- **Copy to Clipboard**: Easy copy buttons
- **Security Warning**: Prominent warning to save credentials
- **Auto-Login**: User automatically logged in after onboarding

### 4. Login (/login)
- **For Returning Users**: Use credentials from onboarding
- **Security Features**:
  - Account lockout after 5 failed attempts
  - Rate limiting
  - Session management (8-hour tokens)

### 5. Dashboard (Protected)
- **Authentication Required**: Must be logged in
- **Single Workspace**: Each user has one workspace
- **No Re-Onboarding**: Cannot create multiple workspaces

## Technical Implementation

### Backend Changes

#### User Model Updates
```typescript
- Added: workspaceId (link to workspace)
- Added: hasOnboarded (track onboarding status)
```

#### Onboarding Endpoint (`POST /api/onboard`)
- **Public**: No authentication required
- **Creates**:
  1. Workspace
  2. User account
  3. Auto-generated credentials
- **Returns**:
  - Workspace ID
  - User credentials (email + password)
  - JWT token for immediate login
  - User profile

#### Password Generation
- 12 characters minimum
- Includes: uppercase, lowercase, numbers, special chars
- Cryptographically secure random generation

#### Email Generation
- Format: `{companyname}.{cin}@creditai.system`
- Or uses provided contact email

### Frontend Changes

#### Onboarding Page
- **No Authentication**: Public access
- **Two-Step Form**: Company details → Loan details
- **Credentials Display**: Shows generated credentials
- **Copy Functionality**: Easy credential copying
- **Auto-Login**: Immediate access after onboarding

#### Layout Changes
- **No Sidebar**: Cleaner interface
- **Top Navbar Only**: User menu, logout, profile
- **Protected Routes**: Dashboard and features require login

### Security Features

1. **One-Time Onboarding**
   - CIN uniqueness check
   - Prevents duplicate registrations
   - Error message for existing companies

2. **Secure Credentials**
   - Strong password generation
   - Bcrypt hashing (12 rounds)
   - One-time display

3. **Session Management**
   - JWT tokens (8-hour expiry)
   - HTTP-only cookies
   - Auto-logout on expiration

4. **Access Control**
   - Users can only access their own workspace
   - Admins can view all workspaces
   - Role-based permissions

## API Endpoints

### Public Endpoints
```
POST /api/onboard - Create workspace and user account
POST /api/auth/login - Login with credentials
```

### Protected Endpoints (Require Authentication)
```
GET /api/my-workspace - Get user's workspace
GET /api/workspace/:id - Get specific workspace (own or admin)
GET /api/workspaces - List all workspaces (admin only)
DELETE /api/workspace/:id - Delete workspace (admin only)
GET /api/auth/me - Get current user profile
POST /api/auth/change-password - Change password
POST /api/auth/logout - Logout
```

## User Roles

### Analyst (Default)
- Access own workspace
- Upload documents
- Run analysis
- View reports

### Admin
- All analyst permissions
- View all workspaces
- Delete workspaces
- Manage users

## Testing the Flow

### 1. First-Time User
```bash
1. Visit http://localhost:3000
2. Click "Get Started"
3. Fill onboarding form:
   - Company: TechnoSteel Industries Pvt. Ltd.
   - CIN: U27100MH2010PTC198765
   - PAN: AAACT1234E
   - Sector: Steel Manufacturing
   - Annual Turnover: ₹ 48.5 Cr
   - Contact Person: John Doe
   - Contact Email: (leave blank or provide)
   - Loan Type: Working Capital
   - Loan Amount: ₹ 12 Cr
   - Loan Tenure: 5 years
   - Interest Rate: 11.5%
4. Click "Create Account"
5. SAVE THE CREDENTIALS shown
6. Click "Continue to Dashboard"
7. Access dashboard
```

### 2. Returning User
```bash
1. Visit http://localhost:3000
2. Click "Sign In"
3. Enter saved credentials
4. Access dashboard
```

### 3. Duplicate Onboarding Attempt
```bash
1. Try to onboard with same CIN
2. See error: "Company already onboarded. Please use login."
```

## Environment Variables

### Backend
```env
GROQ_API_KEY=your_groq_api_key
JWT_SECRET=your_secure_jwt_secret
PORT=5001
MONGO_URI=mongodb://localhost:27017/creditai
FRONTEND_URL=http://localhost:3000
```

### Frontend
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

## Security Best Practices

1. **Save Credentials Immediately**
   - Password shown only once
   - No password recovery (admin must reset)

2. **Use Strong Passwords**
   - Auto-generated passwords are secure
   - Change password after first login if desired

3. **Protect JWT Secret**
   - Use strong random string (32+ chars)
   - Never commit to version control

4. **HTTPS in Production**
   - Always use HTTPS
   - Secure cookie settings

## Troubleshooting

### "Company already onboarded"
- Company with this CIN already exists
- Use login instead of onboarding
- Contact admin if you forgot credentials

### "Session expired"
- Token expired (8 hours)
- Login again with saved credentials

### "Cannot access workspace"
- User can only access their own workspace
- Check if logged in with correct account

### Lost Credentials
- No self-service password reset
- Contact system administrator
- Admin can reset password manually

## Future Enhancements

1. **Password Reset Flow**
   - Email-based password reset
   - Security questions
   - Admin-initiated reset

2. **Multi-Workspace Support**
   - Allow users to manage multiple companies
   - Workspace switching
   - Role per workspace

3. **Email Notifications**
   - Welcome email with credentials
   - Login notifications
   - Activity alerts

4. **Two-Factor Authentication**
   - TOTP-based 2FA
   - SMS verification
   - Backup codes

## Support

For issues or questions:
1. Check this documentation
2. Review error messages
3. Check browser console
4. Verify backend is running
5. Contact system administrator
