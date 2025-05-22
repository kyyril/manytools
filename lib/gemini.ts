import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_1!;

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

export interface ParaphraseStyle {
  name: string;
  instruction: string;
}

export const paraphraseStyles: Record<string, ParaphraseStyle> = {
  standard: {
    name: "Standard",
    instruction:
      "Rewrite the text while maintaining its original meaning, using standard language.",
  },
  formal: {
    name: "Formal",
    instruction:
      "Rewrite the text in a formal and professional tone, using sophisticated vocabulary.",
  },
  simple: {
    name: "Simple",
    instruction:
      "Simplify the text using clear, straightforward language while preserving the core meaning.",
  },
  creative: {
    name: "Creative",
    instruction:
      "Rewrite the text creatively with engaging language while keeping the main message.",
  },
};

export async function paraphraseWithGemini(
  text: string,
  style: string,
  config: GeminiConfig = geminiConfig
): Promise<GeminiResponse> {
  const selectedStyle = paraphraseStyles[style] || paraphraseStyles.standard;

  const prompt = `
    Task: Paraphrase the following text
    Style: ${selectedStyle.name}
    Instructions: ${selectedStyle.instruction}
    
    Important formatting rules:
    1. Mark changed phrases with [highlight]changed text[/highlight]
    2. Preserve original meaning while modifying the structure
    3. Maintain appropriate tone for the selected style
    4. Keep similar length to the original
    
    Text to paraphrase:
    "${text}"
    
    Provide only the paraphrased text with highlights, no additional commentary.
  `;

  return processWithGemini(
    {
      text: prompt,
      instruction: selectedStyle.instruction,
    },
    {
      ...config,
      temperature: 0.7, // Adjust for creativity while maintaining coherence
    }
  );
}

export interface SummarizeStyle {
  name: string;
  instruction: string;
  description: string;
}

export const summarizeStyles: Record<string, SummarizeStyle> = {
  smart: {
    name: "Smart",
    instruction:
      "Create a concise summary with key points highlighted and maintain academic tone",
    description: "Intelligent summary with highlighted key concepts",
  },
  bullet: {
    name: "Bullet Points",
    instruction:
      "Transform the text into organized bullet points with main ideas and supporting details",
    description: "Clear bullet-point format",
  },
  storytelling: {
    name: "Storytelling",
    instruction:
      "Summarize the text in an engaging narrative style while preserving key information",
    description: "Narrative style summary",
  },
  eli5: {
    name: "ELI5",
    instruction:
      "Explain the text as if explaining to a 5-year-old, using simple language",
    description: "Simplified explanation",
  },
};

export async function summarizeWithGemini(
  text: string,
  style: string,
  length: number,
  config: GeminiConfig = geminiConfig
): Promise<GeminiResponse> {
  const selectedStyle = summarizeStyles[style] || summarizeStyles.smart;

  const prompt = `
    Task: Summarize the following text
    Style: ${selectedStyle.name}
    Target Length: ${length}% of original
    
    Formatting Instructions:
    1. Mark important concepts with [key]important text[/key]
    2. For bullet points style, use • at the start of each point
    3. Add a [TLDR] section at the beginning for ultra-short summary
    4. Maintain the specified style's tone and format
    
    Text to summarize:
    "${text}"
    
    Provide the summary following the specified format.
  `;

  return processWithGemini(
    {
      text: prompt,
      instruction: selectedStyle.instruction,
    },
    {
      ...config,
      temperature: 0.3, // Lower temperature for more focused summaries
    }
  );
}
