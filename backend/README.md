## Backend - Credit AI System

This is the backend API for the Credit AI system, powered by Groq's LLaMA 3.3 70B model.

### Setup

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables in `.env`:
```
GROQ_API_KEY=your_groq_api_key_here
PORT=5001
MONGO_URI=mongodb://localhost:27017/creditai
```

3. Get your Groq API key from [https://console.groq.com](https://console.groq.com)

4. Start MongoDB locally or use a cloud instance

5. Run the development server:
```bash
npm run dev
```

### API Endpoints

- POST `/api/upload` - Upload and analyze financial documents
- POST `/api/classify` - Extract structured data from documents
- POST `/api/analyze` - Run multi-agent analysis
- POST `/api/orchestrate` - Generate final credit decision
- POST `/api/report` - Generate credit appraisal memo
- POST `/api/early-warning` - Detect risk alerts
- POST `/api/onboard` - Create new workspace

### Tech Stack

- Express.js
- TypeScript
- MongoDB with Mongoose
- Groq SDK (LLaMA 3.3 70B)
- Multer for file uploads