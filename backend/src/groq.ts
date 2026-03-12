import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GROQ_API_KEY;
if (!apiKey || apiKey === "your_groq_api_key_here") {
    console.warn("⚠️  GROQ_API_KEY not set in .env — AI features will fail.");
}

export const groq = new Groq({ apiKey: apiKey || "" });
export const MODEL = "llama-3.3-70b-versatile";
