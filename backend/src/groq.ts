import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groqApiKey = process.env.GROQ_API_KEY;
if (!groqApiKey) {
    console.warn("⚠️  GROQ_API_KEY not set in .env — Groq AI features will fail.");
}

export const groqClient = new Groq({ apiKey: groqApiKey || "" });

// Model constants
export const GROQ_MODEL_VERSATILE = "llama-3.3-70b-versatile";
export const GROQ_MODEL_SCOUT = "meta-llama/llama-4-scout-17b-16e-instruct";
export const GROQ_MODEL_KIMI = "moonshotai/kimi-k2-instruct-0905";

/**
 * Call Groq API and return the full text response.
 * Collects all streamed chunks into a single string.
 */
export async function callGroq(
    model: string,
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
): Promise<string> {
    const temperature = options?.temperature ?? 0.7;
    const maxTokens = options?.maxTokens ?? 4096;

    const completion = await groqClient.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_completion_tokens: maxTokens,
        top_p: 1,
        stream: false,
        stop: null,
    });

    return completion.choices?.[0]?.message?.content || "";
}

/**
 * Call Groq and parse the response as JSON.
 * Falls back to returning { raw: text } if JSON parsing fails.
 */
export async function callGroqJSON(
    model: string,
    prompt: string,
    options?: { temperature?: number; maxTokens?: number }
): Promise<any> {
    const text = await callGroq(model, prompt, options);
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch {
            return { raw: text };
        }
    }
    return { raw: text };
}
