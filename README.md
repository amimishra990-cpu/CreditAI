# CreditAI

An AI-powered credit appraisal system using multi-agent analysis for comprehensive loan evaluation.

## Features

- Document upload and analysis (PDFs, images, spreadsheets)
- Multi-agent credit analysis system
- Real-time early warning alerts
- Automated credit appraisal memo generation
- Interactive dashboard with risk visualization

## Tech Stack

### Backend
- Node.js + Express + TypeScript
- MongoDB with Mongoose
- Groq API (LLaMA 3.3 70B model)
- Multer for file uploads

### Frontend
- Next.js 15 with React 19
- TypeScript
- Tailwind CSS
- Framer Motion animations

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB
- Groq API key from [https://console.groq.com](https://console.groq.com)

### Backend Setup

1. Navigate to backend:
```bash
cd backend
npm install
```

2. Create `.env` file:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
MONGO_URI=mongodb://localhost:27017/creditai
```

3. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

## Architecture

The system uses a multi-agent architecture powered by Groq's LLaMA 3.3 70B:

1. **Document Analysis Agent** - Extracts and validates financial data
2. **Financial Analysis Agent** - Evaluates financial health and ratios
3. **Research Agent** - Analyzes industry trends and market sentiment
4. **Promoter Analysis Agent** - Assesses management and promoter risk
5. **Central Orchestrator** - Synthesizes insights for final decision
6. **Early Warning System** - Monitors for risk signals

## API Endpoints

- `POST /api/upload` - Upload financial documents
- `POST /api/classify` - Extract structured data
- `POST /api/analyze` - Run multi-agent analysis
- `POST /api/orchestrate` - Generate credit decision
- `POST /api/report` - Create credit appraisal memo
- `POST /api/early-warning` - Get risk alerts
- `POST /api/onboard` - Create workspace
