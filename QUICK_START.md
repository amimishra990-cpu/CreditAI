# Quick Start Guide

## ✅ Everything is Ready!

Your code has been successfully merged and all dependencies are installed.

## Start the Application

### 1. Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

Backend will run on: `http://localhost:5001`

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```

Frontend will run on: `http://localhost:3000`

## First Time Setup

### 1. Visit the Application
Open your browser and go to: `http://localhost:3000`

### 2. Sign Up
- Click "Get Started" or "Sign Up"
- Fill in your details:
  - Name
  - Email
  - Phone (optional)
  - Password (min 8 chars, uppercase, lowercase, number, special char)

### 3. Create Organization
- After signup, you'll be redirected to onboarding
- Enter your organization details:
  - Organization name
  - Industry
  - Company size
  - Website (optional)

### 4. Create Workspace
- From dashboard, click "New Workspace"
- Fill in company and loan details
- Start analyzing!

## Features Available

### Authentication
- ✅ Signup/Login with real credentials
- ✅ JWT token authentication
- ✅ Session management
- ✅ Password requirements enforced

### Multi-Tenant
- ✅ Multiple organizations per user
- ✅ Multiple workspaces per organization
- ✅ Role-based access (owner, admin, analyst, viewer)
- ✅ Organization switching

### Navigation
- ✅ TopBar with horizontal navigation
- ✅ Mobile responsive menu
- ✅ Protected routes
- ✅ User profile dropdown

### AI Features (New from GitHub)
- ✅ Groq SDK integration
- ✅ LangGraph multi-agent system
- ✅ Math framework for calculations
- ✅ Document classification
- ✅ Financial analysis
- ✅ Risk assessment

## API Endpoints

### Authentication
- `POST /api/auth/register` - Sign up
- `POST /api/auth/login` - Sign in
- `GET /api/auth/me` - Get profile
- `POST /api/auth/logout` - Sign out

### Organizations
- `GET /api/organizations` - List user's orgs
- `POST /api/organizations` - Create org
- `GET /api/organizations/:id` - Get org details
- `POST /api/organizations/:id/switch` - Switch org
- `POST /api/organizations/:id/workspaces` - Create workspace
- `GET /api/organizations/:id/workspaces` - List workspaces

### Analysis
- `POST /api/upload` - Upload documents
- `POST /api/classify` - Classify documents
- `POST /api/analyze` - Run analysis
- `POST /api/orchestrate` - Orchestrate agents
- `POST /api/early-warning` - Early warning system
- `POST /api/report` - Generate report

## Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_key
GROQ_API_KEY=your_groq_key
PORT=5001
MONGO_URI=mongodb://localhost:27017/creditai
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=8h
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

## Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
brew services start mongodb-community
# or
mongod --dbpath /path/to/data
```

### Port Already in Use
```bash
# Backend (5001)
lsof -ti:5001 | xargs kill -9

# Frontend (3000)
lsof -ti:3000 | xargs kill -9
```

### Clear Cache
```bash
# Frontend
cd frontend
rm -rf .next node_modules/.cache
npm install

# Backend
cd backend
rm -rf node_modules
npm install
```

## Git Commands

### Push to GitHub
```bash
git push origin main
```

### Check Status
```bash
git status
git log --oneline -5
```

## Project Structure

```
CreditAI/
├── backend/
│   ├── src/
│   │   ├── groq.ts                 # Groq SDK helpers
│   │   ├── langgraph-workflow.ts   # Multi-agent system
│   │   ├── mathFramework.ts        # Financial calculations
│   │   ├── middleware/             # Auth & security
│   │   ├── models/                 # User, Org, Workspace
│   │   └── routes/                 # API endpoints
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js pages
│   │   ├── components/             # React components
│   │   ├── contexts/               # Auth context
│   │   └── lib/                    # Utilities
│   └── package.json
│
└── MERGE_SUMMARY.md                # Merge details
```

## Success Checklist

- ✅ Backend dependencies installed
- ✅ Frontend dependencies installed
- ✅ Tailwind CSS working
- ✅ MongoDB connected
- ✅ All routes protected
- ✅ Multi-tenant architecture active
- ✅ New AI features integrated

## Next Steps

1. Test the signup/login flow
2. Create an organization
3. Create a workspace
4. Upload documents
5. Run analysis
6. Generate reports

## Support

If you encounter any issues:
1. Check the console for errors
2. Verify MongoDB is running
3. Check environment variables
4. Clear cache and reinstall dependencies
5. Review MERGE_SUMMARY.md for details

---

**Ready to go! 🚀**

Start both servers and visit `http://localhost:3000`
