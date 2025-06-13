"use client";

import { useState } from "react";
import { Search, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useTokens } from "@/hooks/use-tokens";
import { checkPlagiarism, processWithGemini } from "@/lib/gemini";
import ToolHeader from "@/components/tools/tool-header";

interface Analysis {
  aiProbability: number;
  humanLikeness: number;
  confidence: number;
  indicators: string[];
  recommendations: string[];
  wordCount: number;
  readabilityScore: number;
}

interface PlagiarismResult {
  similarityScore: number;
  originalityScore: number;
  matchedSources: Array<{
    url: string;
    similarity: number;
    matchedText: string;
  }>;
}

const Plagiarism = () => {
  const { useToken } = useTokens();
  const [inputText, setInputText] = useState("");
  const [result, setResult] = useState<PlagiarismResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze.");
      return;
    }

    if (!useToken()) {
      toast.error("Please watch an ad to earn more tokens.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await checkPlagiarism(inputText);
      setResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Analysis failed");
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Keep only essential UI components
  return (
    <div className="container space-y-8 py-8">
      <ToolHeader
        title="Plagiarism Checker"
        description="Check content originality"
        icon={Search}
        iconColor="text-blue-500"
      />

      <Card>
        <CardHeader>
          <CardTitle>Text to Check</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Paste your text here..."
              className="min-h-[200px]"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <Button
              className="w-full"
              onClick={handleAnalyze}
              disabled={isAnalyzing}
            >
              {isAnalyzing ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Check Plagiarism
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">
                  Originality Score
                </div>
                <div
                  className={`text-2xl font-bold ${
                    result.originalityScore > 70
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {result.originalityScore}%
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Similarity Score</div>
                <div
                  className={`text-2xl font-bold ${
                    result.similarityScore < 30
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {result.similarityScore}%
                </div>
              </div>
            </div>

            {result.matchedSources.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Matched Sources</h3>
                <ul className="space-y-3">
                  {result.matchedSources.map((source, index) => (
                    <li key={index} className="border rounded-lg p-3">
                      <div className="flex justify-between items-center mb-2">
                        <a
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {source.url}
                        </a>
                        <span>{source.similarity}% match</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {source.matchedText}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Plagiarism;
