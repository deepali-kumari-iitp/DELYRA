import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function askGemini(prompt: string) {
  const maxRetries = 3;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      return response.text;
    } catch (error: any) {
      const status = error?.status;

      if (status !== 503 || attempt === maxRetries) {
        throw error;
      }

      const delay = 1000 * Math.pow(2, attempt);

      console.log(
        `Gemini temporarily unavailable. Retrying in ${delay}ms...`
      );

      await sleep(delay);
    }
  }

  throw new Error("Gemini request failed after retries.");
}