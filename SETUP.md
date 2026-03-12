# CreditAI Setup Guide

## Prerequisites

1. **Node.js 18+** - [Download](https://nodejs.org/)
2. **MongoDB** - [Download](https://www.mongodb.com/try/download/community)
3. **Groq API Key** - [Get from console.groq.com](https://console.groq.com)

## Quick Start

### 1. Start MongoDB

**Option A: Using MongoDB Community Edition**
```bash
# macOS (if installed via Homebrew)
brew services start mongodb-community

# Or manually
mongod --dbpath /usr/local/var/mongodb
```

**Option B: Using Docker**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Option C: Use MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get your connection string
- Update `MONGO_URI` in `backend/.env`

### 2. Setup Backend

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit backend/.env and add your Groq API key:
# GROQ_API_KEY=your_actual_groq_api_key_here

# Start the backend server
npm run dev
```

Backend will run on: **http://localhost:5001**

### 3. Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start the frontend
npm run dev
```

Frontend will run on: **http://localhost:3000**

## Verify Setup

1. **Check Backend Health:**
   ```bash
   curl http://localhost:5001/api/health
   ```
   Should return: `{"status":"ok","timestamp":"..."}`

2. **Check MongoDB Connection:**
   - Look for "✅ MongoDB connected" in backend terminal

3. **Open Frontend:**
   - Navigate to http://localhost:3000
   - You should see the CreditAI homepage

## Test the System

1. Go to **Onboarding** page
2. Fill in the dummy company details:
   - Company Name: `TechnoSteel Industries Pvt. Ltd.`
   - CIN: `U27100MH2010PTC198765`
   - PAN: `AAACT1234E`
   - Sector: `Steel Manufacturing`
   - Annual Turnover: `₹ 48.5 Cr`
   - Loan Type: `Working Capital`
   - Loan Amount: `₹ 12 Cr`
   - Loan Tenure: `5 years`
   - Interest Rate: `11.5%`

3. Click "Create Workspace & Continue"
4. Upload financial documents
5. Run analysis

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongosh` or `mongo`
- Verify GROQ_API_KEY is set in `backend/.env`
- Check port 5001 is not in use: `lsof -i :5001`

### Frontend API errors
- Ensure backend is running on port 5001
- Check `frontend/.env.local` has correct BACKEND_URL
- Clear browser cache and restart frontend

### MongoDB connection failed
- Start MongoDB: `brew services start mongodb-community`
- Or use Docker: `docker start mongodb`
- Check connection string in `backend/.env`

### Groq API errors
- Verify API key is valid at [console.groq.com](https://console.groq.com)
- Check API rate limits
- Ensure you have credits/quota available

## Environment Variables

### Backend (`backend/.env`)
```env
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
MONGO_URI=mongodb://localhost:27017/creditai
```

### Frontend (`frontend/.env.local`)
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5001
```

## Architecture

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│   Frontend  │────────▶│   Next.js   │────────▶│   Backend   │
│  (React)    │         │  API Routes │         │  (Express)  │
│  Port 3000  │         │  (Proxy)    │         │  Port 5001  │
└─────────────┘         └─────────────┘         └──────┬──────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │   MongoDB     │
                                                │  Port 27017   │
                                                └───────────────┘
                                                        │
                                                        ▼
                                                ┌───────────────┐
                                                │  Groq API     │
                                                │ (LLaMA 3.3)   │
                                                └───────────────┘
```

## Next Steps

Once everything is running:
1. Create a workspace via Onboarding
2. Upload financial documents
3. Run multi-agent analysis
4. View orchestrator decision
5. Generate credit appraisal report
6. Monitor early warning alerts
