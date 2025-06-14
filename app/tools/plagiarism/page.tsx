"use client";

import { useState } from "react";
import { Search, RotateCw, Sparkles } from "lucide-react";
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
import {
  checkPlagiarism,
  correctPlagiarismWithGemini,
  PlagiarismCorrectionResult,
} from "@/lib/gemini";
import ToolHeader from "@/components/tools/tool-header";
import { cn } from "@/lib/utils";

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
  const [plagiarismResult, setPlagiarismResult] =
    useState<PlagiarismResult | null>(null);
  const [correctionResult, setCorrectionResult] =
    useState<PlagiarismCorrectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
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
    setPlagiarismResult(null);
    setCorrectionResult(null);

    try {
      const result = await checkPlagiarism(inputText);
      setPlagiarismResult(result);
      toast.success("Analysis complete!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Analysis failed");
      toast.error("Analysis failed");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCorrectPlagiarism = async () => {
    if (!inputText.trim()) {
      toast.error("No text to correct.");
      return;
    }

    if (!useToken()) {
      toast.error("Please watch an ad to earn more tokens.");
      return;
    }

    setIsCorrecting(true);
    setError(null);
    setCorrectionResult(null);

    try {
      const result = await correctPlagiarismWithGemini(inputText);
      setCorrectionResult(result);
      toast.success("Correction complete!");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Correction failed");
      toast.error("Correction failed");
    } finally {
      setIsCorrecting(false);
    }
  };

  const renderCorrectedText = (text: string) => {
    return text
      .split(/(\[corrected\].*?\[\/corrected\])/g)
      .map((part, index) => {
        if (part.startsWith("[corrected]") && part.endsWith("[/corrected]")) {
          const corrected = part.replace(
            /\[corrected\](.*?)\[\/corrected\]/,
            "$1"
          );
          return (
            <span
              key={index}
              className="bg-yellow-200 dark:bg-yellow-700 rounded px-1"
            >
              {corrected}
            </span>
          );
        }
        return part;
      });
  };

  return (
    <div className="container space-y-8 py-8">
      <ToolHeader
        title="Plagiarism Checker"
        description="Check content originality and get suggestions for correction."
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                className="w-full sm:w-1/2"
                onClick={handleAnalyze}
                disabled={isAnalyzing || isCorrecting}
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
              <Button
                className="w-full sm:w-1/2"
                onClick={handleCorrectPlagiarism}
                disabled={isCorrecting || isAnalyzing}
                variant="outline"
              >
                {isCorrecting ? (
                  <>
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                    Correcting...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Correct Plagiarism
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {plagiarismResult && (
        <Card>
          <CardHeader>
            <CardTitle>Plagiarism Analysis Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">
                  Originality Score
                </div>
                <div
                  className={`text-2xl font-bold ${
                    plagiarismResult.originalityScore > 70
                      ? "text-green-500"
                      : plagiarismResult.originalityScore > 40
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {plagiarismResult.originalityScore}%
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <div className="text-sm font-medium mb-2">Similarity Score</div>
                <div
                  className={`text-2xl font-bold ${
                    plagiarismResult.similarityScore < 30
                      ? "text-green-500"
                      : plagiarismResult.similarityScore < 60
                      ? "text-orange-500"
                      : "text-red-500"
                  }`}
                >
                  {plagiarismResult.similarityScore}%
                </div>
              </div>
            </div>

            {plagiarismResult.matchedSources.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-medium">Matched Sources</h3>
                <ul className="space-y-3">
                  {plagiarismResult.matchedSources.map((source, index) => (
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

      {correctionResult && (
        <Card>
          <CardHeader>
            <CardTitle>Plagiarism Correction Results</CardTitle>
            <CardDescription>
              Status:{" "}
              <span
                className={cn(
                  "font-semibold",
                  correctionResult.status === "original" && "text-green-500",
                  correctionResult.status === "partially_plagiarized" &&
                    "text-orange-500",
                  correctionResult.status === "plagiarized" && "text-red-500"
                )}
              >
                {correctionResult.status.replace(/_/g, " ")}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Corrected Text</h3>
              <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                <p className="text-sm leading-relaxed">
                  {renderCorrectedText(correctionResult.correctedText)}
                </p>
              </div>
            </div>

            {correctionResult.changes.length > 0 && (
              <div>
                <h3 className="font-medium mb-2">Detailed Changes</h3>
                <ul className="space-y-3">
                  {correctionResult.changes.map((change, index) => (
                    <li key={index} className="border rounded-lg p-3">
                      <p className="text-sm">
                        <span className="font-semibold">Original:</span>{" "}
                        <span className="line-through text-red-500">
                          {change.original}
                        </span>
                      </p>
                      <p className="text-sm mt-1">
                        <span className="font-semibold">Corrected:</span>{" "}
                        <span className="text-green-500">
                          {change.corrected}
                        </span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Reason: {change.reason}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {correctionResult.summary && (
              <div>
                <h3 className="font-medium mb-2">Summary</h3>
                <p className="text-sm text-muted-foreground">
                  {correctionResult.summary}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {error && (
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Plagiarism;
