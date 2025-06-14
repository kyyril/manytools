import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_1!;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export async function countTokens(text: string): Promise<number> {
  try {
    const { totalTokens } = await model.countTokens(text);
    return totalTokens;
  } catch (error) {
    console.error("Error counting tokens:", error);
    return 0;
  }
}
