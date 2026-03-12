# Multi-Tenant Architecture Migration Guide

## Overview

The application has been transformed from a single-tenant system with auto-generated credentials to a proper multi-tenant SaaS architecture with:

- Real user authentication (signup/login)
- Multiple organizations per user
- Multiple workspaces per organization
- Proper role-based access control

## Key Changes

### 1. Authentication Flow

**Before:**
- Landing page → Onboarding (auto-generates credentials) → Dashboard

**After:**
- Landing page → Signup/Login → Onboarding (create organization) → Dashboard

### 2. Data Model Changes

#### User Model
- Removed: `role`, `organization`, `workspaceId`, `hasOnboarded`
- Added: `organizations[]`, `currentOrganizationId`, `phone`, `avatar`, `emailVerified`

#### Organization Model (NEW)
- Multi-tenant organization management
- Members with roles (owner, admin, analyst, viewer)
- Organization settings and metadata

#### Workspace Model
- Changed: `userId` → `organizationId`, `createdBy`
- Added: `name`, `status`
- Workspaces now belong to organizations, not individual users

### 3. New Features

#### User Registration
- `/signup` - New user registration page
- Password requirements enforced
- No auto-generated credentials

#### Organization Management
- Users can create multiple organizations
- Switch between organizations
- Invite members (future feature)

#### Workspace Management
- Create workspaces within organizations
- Organization-scoped workspace access
- Proper status tracking (draft, in_progress, completed, archived)

## API Changes

### New Endpoints

```
POST   /api/auth/register              - Register new user
GET    /api/organizations              - List user's organizations
POST   /api/organizations              - Create organization
GET    /api/organizations/:id          - Get organization details
POST   /api/organizations/:id/switch   - Switch active organization
POST   /api/organizations/:id/workspaces - Create workspace in org
GET    /api/organizations/:id/workspaces - List org workspaces
```

### Modified Endpoints

```
POST   /api/auth/login                 - Now returns requiresOnboarding flag
GET    /api/auth/me                    - Returns updated user structure
GET    /api/workspace/:id              - Now checks organization membership
```

### Removed Endpoints

```
POST   /api/onboard                    - Removed auto-credential generation
```

## Frontend Changes

### New Pages

1. `/signup` - User registration
2. `/onboarding` - Organization creation (not company onboarding)
3. `/workspace/new` - Create new workspace
4. `/workspace/[id]` - Individual workspace view (to be implemented)

### Updated Pages

1. `/` (Landing) - Links to signup instead of old onboarding
2. `/login` - Links to signup page
3. `/dashboard` - Shows organizations and workspaces

## Migration Steps for Existing Data

If you have existing data, run this migration:

```javascript
// MongoDB migration script
db.users.updateMany({}, [
  {
    $set: {
      organizations: [
        {
          organizationId: "$_id", // Create org from user
          role: "owner",
          joinedAt: new Date()
        }
      ],
      currentOrganizationId: "$_id"
    }
  },
  {
    $unset: ["role", "workspaceId", "hasOnboarded"]
  }
]);

// Create organizations from existing users
db.users.find().forEach(user => {
  db.organizations.insertOne({
    name: user.organization,
    slug: user.organization.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    ownerId: user._id.toString(),
    members: [{
      userId: user._id.toString(),
      role: "owner",
      joinedAt: new Date()
    }],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });
});

// Update workspaces
db.workspaces.updateMany({}, [
  {
    $set: {
      organizationId: "$userId", // Map to org
      createdBy: "$userId",
      name: { $concat: ["Workspace - ", "$company.name"] },
      status: "completed"
    }
  },
  {
    $unset: ["userId"]
  }
]);
```

## Environment Variables

No new environment variables required. Existing setup works as-is.

## Testing the New Flow

1. Start backend: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Visit `http://localhost:3000`
4. Click "Get Started" → Sign up
5. Complete onboarding (create organization)
6. Create workspaces from dashboard

## Security Improvements

1. No auto-generated credentials
2. Password strength requirements enforced
3. Proper session management
4. Organization-level access control
5. Role-based permissions

## Next Steps

Consider implementing:

1. Email verification
2. Password reset flow
3. Member invitation system
4. Organization settings page
5. Workspace collaboration features
6. Audit logs per organization
7. Usage analytics per organization

## Breaking Changes

⚠️ **Important**: This is a breaking change. Existing users will need to:

1. Re-register with their email
2. Create their organization
3. Recreate workspaces (or run migration script)

## Support

For issues or questions, refer to:
- `backend/src/models/` - Updated data models
- `backend/src/routes/organizations.ts` - Organization management
- `frontend/src/app/onboarding/page.tsx` - New onboarding flow
