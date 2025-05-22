"use client";

import { useState } from "react";
import { FileCheck, Copy, CheckCheck, RotateCw, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { checkGrammarWithGemini, grammarStyles } from "@/lib/gemini";
import { useTokens } from "@/hooks/use-tokens";
import { useToast } from "@/hooks/use-toast";
import ToolHeader from "@/components/tools/tool-header";
import ToolUsageExamples from "@/components/tools/tool-usage-examples";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CorrectionList } from "@/components/tools/correction-list";

export default function GrammarPage() {
  const { useToken } = useTokens();
  const { toast } = useToast();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [stats, setStats] = useState<null | {
    errors: number;
    improvements: number;
    readabilityScore: number;
  }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState("standard");
  const [showExplanations, setShowExplanations] = useState(true);
  const [corrections, setCorrections] = useState<
    Array<{
      original: string;
      corrected: string;
      explanation: string;
      applied: boolean;
    }>
  >([]);

  const handleCheck = async () => {
    if (!inputText.trim()) {
      toast("Please enter some text to check.");
      return;
    }

    if (!useToken()) {
      toast("Please watch an ad to earn more tokens.");
      return;
    }

    setIsGenerating(true);

    try {
      const response = await checkGrammarWithGemini(inputText, style);

      if (response.error) {
        throw new Error(response.error);
      }

      // Extract corrections from the response
      const correctionMatches = [
        ...response.content.matchAll(
          /\[fix=(.*?)\](.*?)\[\/fix\].*?\[note\](.*?)\[\/note\]/g
        ),
      ];

      const newCorrections = correctionMatches.map((match) => ({
        original: match[1],
        corrected: match[2],
        explanation: match[3],
        applied: false,
      }));

      setCorrections(newCorrections);

      // Process the formatted text
      const formattedText = response.content
        .replace(/\[errors=\d+\]|\[improvements=\d+\]|\[score=\d+\]/g, "") // Remove status markers from main text
        .replace(
          /\[fix=(.*?)\](.*?)\[\/fix\]/g,
          (_, original, corrected) =>
            `<span class="correction-item group relative inline-block mr-1" data-original="${original}">
              <mark class="bg-red-100 dark:bg-red-900/30 cursor-pointer hover:bg-red-200 dark:hover:bg-red-800/40 px-1 rounded">
                ${corrected}
              </mark>
              <span class="absolute hidden group-hover:block bg-white dark:bg-gray-800 text-sm p-2 rounded shadow-lg -top-8 left-0 z-10 border min-w-[200px]">
                Original: "${original}"
              </span>
            </span>`
        )
        .replace(
          /\[improve\](.*?)\[\/improve\]/g,
          '<mark class="bg-amber-100 dark:bg-amber-900/30 px-1 rounded inline-block mr-1">$1</mark>'
        )
        .replace(
          /\[note\](.*?)\[\/note\]/g,
          '<span class="explanation text-xs text-muted-foreground italic inline-block ml-1 mr-2">💡 $1</span>'
        );
      setOutputText(formattedText);

      // Extract metrics
      const errorsMatch = response.content.match(/\[errors=(\d+)\]/);
      const improvementsMatch = response.content.match(
        /\[improvements=(\d+)\]/
      );
      const scoreMatch = response.content.match(/\[score=(\d+)\]/);

      setStats({
        errors: parseInt(errorsMatch?.[1] || "0"),
        improvements: parseInt(improvementsMatch?.[1] || "0"),
        readabilityScore: parseInt(scoreMatch?.[1] || "0"),
      });

      toast("Grammar check complete");
    } catch (error) {
      toast("Failed to check grammar. Please try again.");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast("Copied!");
  };

  const handleApplyCorrection = (index: number) => {
    const correction = corrections[index];
    if (!correction || correction.applied) return;

    const newText = inputText.replace(
      correction.original,
      correction.corrected
    );
    setInputText(newText);

    setCorrections((prev) =>
      prev.map((c, i) => (i === index ? { ...c, applied: true } : c))
    );

    toast("Correction applied!");
  };

  const handleIgnoreCorrection = (index: number) => {
    setCorrections((prev) => prev.filter((_, i) => i !== index));
  };

  const examples = [
    "i cant believe how amazing this product is! its definately worth the money and i would recomend it to anyone who asks me about it.",
    "The team have completed the project on time, but there was several issues with the implementation that needs to be fixed urgently.",
    "we went to the store yesterday, we bought some grocerys for dinner but we forgot to get desert so we had to go back later",
  ];

  return (
    <div className="space-y-8">
      <ToolHeader
        title="Grammar Checker"
        description="Fix grammar, spelling, and punctuation errors in your text."
        icon={FileCheck}
        iconColor="text-amber-500"
      />

      <TooltipProvider>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Original Texttxxxt</CardTitle>
              <CardDescription>
                Enter the text you want to check
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your text here..."
                  className="min-h-[200px] resize-none"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
                <div className="flex items-center justify-between">
                  <ToolUsageExamples
                    examples={examples}
                    onSelectExample={(example) => setInputText(example)}
                  />
                  <div className="flex items-center gap-2">
                    <Select value={style} onValueChange={setStyle}>
                      <SelectTrigger className="w-[150px]">
                        <SelectValue placeholder="Style" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(grammarStyles).map(([key, style]) => (
                          <SelectItem key={key} value={key}>
                            {style.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setShowExplanations(!showExplanations)}
                        >
                          <Info
                            className={`h-4 w-4 ${
                              showExplanations ? "text-blue-500" : ""
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Toggle error explanations</p>
                      </TooltipContent>
                    </Tooltip>

                    <Button
                      onClick={handleCheck}
                      disabled={isGenerating || !inputText.trim()}
                    >
                      {isGenerating ? (
                        <>
                          <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                          Checking...
                        </>
                      ) : (
                        "Check Grammar"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Corrected Text</CardTitle>
              <CardDescription>Review and apply suggestions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div
                  className={`min-h-[200px] p-3 rounded-md border ${
                    outputText ? "bg-muted/50" : "bg-muted/30"
                  }`}
                >
                  {isGenerating ? (
                    <div className="flex flex-col gap-2 animate-pulse">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                      <div className="h-4 bg-muted rounded w-4/5"></div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="whitespace-pre-line"
                        dangerouslySetInnerHTML={{ __html: outputText }}
                      />
                      {corrections.length > 0 && (
                        <div className="mt-6">
                          <CorrectionList
                            corrections={corrections}
                            onApplyCorrection={handleApplyCorrection}
                            onIgnoreCorrection={handleIgnoreCorrection}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>

                {stats && (
                  <div className="grid grid-cols-3 gap-4 pb-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-center">
                      <p className="text-2xl font-bold text-amber-600">
                        {stats.errors}
                      </p>
                      <p className="text-xs text-amber-800 dark:text-amber-400">
                        Errors Fixed
                      </p>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-center">
                      <p className="text-2xl font-bold text-green-600">
                        {stats.improvements}
                      </p>
                      <p className="text-xs text-green-800 dark:text-green-400">
                        Improvements
                      </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {stats.readabilityScore}
                      </p>
                      <p className="text-xs text-blue-800 dark:text-blue-400">
                        Readability
                      </p>
                    </div>
                  </div>
                )}

                {outputText && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                      {copied ? (
                        <>
                          <CheckCheck className="mr-2 h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    </div>
  );
}
