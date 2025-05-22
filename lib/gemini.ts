import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = "AIzaSyA8yqakjPYaHsTRSOKjG5d4-6tYXfYN1Wg";

interface GeminiConfig {
  model: string;
  temperature?: number;
  maxOutputTokens?: number;
}

interface GeminiRequest {
  text: string;
  instruction: string;
}

interface GeminiResponse {
  content: string;
  error?: string;
}

export const geminiConfig: GeminiConfig = {
  model: "gemini-1.5-flash",
  temperature: 0.7,
  maxOutputTokens: 1024,
};

export async function processWithGemini(
  request: GeminiRequest,
  config: GeminiConfig = geminiConfig
): Promise<GeminiResponse> {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel(config);

    const prompt = `
      Instructions: ${request.instruction}
      Text to process: ${request.text}
      
      Please provide output in a clear, consistent format.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const formattedText = response.text().trim();

    return {
      content: formattedText,
    };
  } catch (error) {
    return {
      content: "",
      error: error instanceof Error ? error.message : "An error occurred",
    };
  }
}
