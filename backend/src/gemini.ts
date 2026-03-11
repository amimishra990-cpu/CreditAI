import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey || apiKey === "your_gemini_api_key_here") {
    console.warn("⚠️  GEMINI_API_KEY not set in .env — AI features will fail.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });
export const MODEL = "gemini-2.5-flash-preview-05-20";
