# Migration from Gemini to Groq

## Changes Made

### 1. Dependencies
- Removed: `@google/genai`
- Added: `groq-sdk`

### 2. Configuration
- Environment variable changed from `GEMINI_API_KEY` to `GROQ_API_KEY`
- Model changed from `gemini-2.5-flash-preview-05-20` to `llama-3.3-70b-versatile`

### 3. API Structure
Groq uses OpenAI-compatible API format:

**Before (Gemini):**
```typescript
const response = await ai.models.generateContent({
    model: MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }]
});
const text = response?.candidates?.[0]?.content?.parts?.[0]?.text || "";
```

**After (Groq):**
```typescript
const response = await groq.chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 2048,
});
const text = response.choices[0]?.message?.content || "";
```

### 4. Vision/Multimodal Support
**Important:** Groq's LLaMA models don't support vision/multimodal input. The upload route now uses filename-based classification instead of document OCR. For full OCR capabilities, consider:
- Using a separate OCR service (Tesseract, AWS Textract, Google Vision API)
- Using Groq's vision-capable models when available
- Preprocessing documents with an OCR tool before analysis

## Next Steps

1. Get your Groq API key from [https://console.groq.com](https://console.groq.com)
2. Update `backend/.env` with your `GROQ_API_KEY`
3. Restart the backend server: `npm run dev`

## Model Options

Groq offers several models you can use by changing the `MODEL` constant in `backend/src/groq.ts`:

- `llama-3.3-70b-versatile` (default) - Best balance of speed and quality
- `llama-3.1-70b-versatile` - Alternative 70B model
- `llama-3.1-8b-instant` - Faster, smaller model
- `mixtral-8x7b-32768` - Large context window

Note: GPT OSS 120B is not currently available on Groq. Using LLaMA 3.3 70B as the closest alternative.
