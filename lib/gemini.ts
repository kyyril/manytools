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

export async function generateChunkedContent(
  instruction: string,
  context: string,
  chunkRequest: string,
  config: GeminiConfig = geminiConfig
): Promise<GeminiResponse> {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel(config);

    const prompt = `
      Overall Instructions: ${instruction}
      Current Context: ${context}
      Generate the following chunk: ${chunkRequest}
      
      Please provide only the generated content for the chunk, no additional commentary.
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
      error:
        error instanceof Error
          ? error.message
          : "An error occurred during chunked generation",
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

export interface GrammarStyle {
  name: string;
  instruction: string;
  description: string;
}

export const grammarStyles: Record<string, GrammarStyle> = {
  standard: {
    name: "Standard",
    instruction: "Fix basic grammar, spelling, and punctuation errors",
    description: "Basic grammar correction",
  },
  academic: {
    name: "Academic",
    instruction:
      "Correct and enhance text for academic writing, using formal language",
    description: "Formal academic style",
  },
  business: {
    name: "Business",
    instruction: "Optimize text for professional business communication",
    description: "Professional business tone",
  },
  creative: {
    name: "Creative",
    instruction: "Fix errors while maintaining creative style and flow",
    description: "Creative writing style",
  },
};

export async function checkGrammarWithGemini(
  text: string,
  style: string,
  config: GeminiConfig = geminiConfig
): Promise<GeminiResponse> {
  const selectedStyle = grammarStyles[style] || grammarStyles.standard;

  const prompt = `
    Task: Grammar and Style Check
    Style: ${selectedStyle.name}
    Instructions: ${selectedStyle.instruction}
    
    Formatting Rules:
    1. Mark corrections with [fix=original text]corrected text[/fix]
    2. Mark style improvements with [improve]suggested text[/improve]
    3. Add error explanations with [note]explanation[/note]
    4. Calculate metrics:
       - [errors=N] for number of grammar/spelling errors
       - [improvements=N] for style improvements
       - [score=N] for overall writing score (0-100)
    
    Text to check:
    "${text}"
    
    Provide the corrected text with all markup.
  `;

  return processWithGemini(
    {
      text: prompt,
      instruction: selectedStyle.instruction,
    },
    {
      ...config,
      temperature: 0.1, // Low temperature for accurate corrections
    }
  );
}

export interface PlagiarismCorrectionResult {
  originalText: string;
  correctedText: string;
  changes: Array<{
    original: string;
    corrected: string;
    reason: string;
    startIndex: number;
    endIndex: number;
  }>;
  status: "plagiarized" | "original" | "partially_plagiarized";
  summary: string;
}

export const checkPlagiarism = async (text: string): Promise<any> => {
  const response = await processWithGemini({
    text,
    instruction: `
      Analyze this text for potential plagiarism. Return JSON with:
      - similarityScore: percentage of content that matches other sources (0-100)
      - originalityScore: percentage of original content (0-100)
      - matchedSources: array of matches with url, similarity percentage, and matched text
      
      Format response as valid JSON only.
    `,
  });

  try {
    const jsonString = response.content
      .replace(/```json\n(.*)\n```/s, "$1")
      .trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error(
      "Failed to parse plagiarism analysis response:",
      response.content,
      error
    );
    throw new Error("Failed to analyze text. Invalid response from AI.");
  }
};

export async function correctPlagiarismWithGemini(
  text: string,
  config: GeminiConfig = geminiConfig
): Promise<PlagiarismCorrectionResult> {
  const prompt = `
    Task: Correct plagiarized text and provide a clear status.
    Instructions:
    1. Analyze the provided text for plagiarized segments.
    2. Rewrite the plagiarized parts to make them original while preserving the original meaning.
    3. Highlight the corrected parts using [corrected]new text[/corrected] tags.
    4. Provide a JSON output with the following structure:
       - originalText: The original input text.
       - correctedText: The text after corrections, with highlighted changes.
       - changes: An array of objects, each detailing a specific correction:
         - original: The exact plagiarized phrase/sentence.
         - corrected: The new, original phrase/sentence.
         - reason: Explanation for the change (e.g., "Paraphrased to avoid plagiarism").
         - startIndex: The starting index of the original text in the input.
         - endIndex: The ending index of the original text in the input.
       - status: 'plagiarized' if significant plagiarism remains, 'original' if no plagiarism detected after correction, 'partially_plagiarized' if some parts were corrected but others might still be problematic.
       - summary: A brief summary of the correction process and overall originality status.

    Text to correct:
    "${text}"

    Provide only the JSON output.
  `;

  const response = await processWithGemini(
    {
      text: prompt,
      instruction: "Correct plagiarized text and provide detailed status.",
    },
    {
      ...config,
      temperature: 0.5, // Balance creativity for correction with accuracy
    }
  );

  try {
    const jsonString = response.content
      .replace(/```json\n(.*)\n```/s, "$1")
      .trim();
    const result = JSON.parse(jsonString);
    return result;
  } catch (error) {
    console.error(
      "Failed to parse Gemini correction response:",
      response.content,
      error
    );
    throw new Error(
      "Failed to process plagiarism correction. Invalid response from AI."
    );
  }
}
