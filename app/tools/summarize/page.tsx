"use client";

import { useState } from "react";
import { FileText, Copy, CheckCheck, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTokens } from "@/hooks/use-tokens";
import { useToast } from "@/hooks/use-toast";
import ToolHeader from "@/components/tools/tool-header";
import ToolUsageExamples from "@/components/tools/tool-usage-examples";
import { summarizeWithGemini, summarizeStyles } from "@/lib/gemini";

export default function SummarizePage() {
  const { useToken } = useTokens();
  const { toast } = useToast();

  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [length, setLength] = useState([50]); // percentage of original text
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState("smart");

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast({ description: "Please enter some text to summarize." });
      return;
    }

    if (!useToken()) {
      toast({ description: "Please watch an ad to earn more tokens." });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await summarizeWithGemini(inputText, style, length[0]);

      if (response.error) {
        throw new Error(response.error);
      }

      // Process the formatted text
      const formattedText = response.content
        .replace(
          /\[key\](.*?)\[\/key\]/g,
          '<mark class="bg-emerald-200 dark:bg-emerald-800/50">$1</mark>'
        )
        .replace(
          /\[TLDR\]/g,
          '<strong class="text-emerald-600 dark:text-emerald-400">TLDR:</strong>'
        )
        .replace(/•/g, "◆");

      setOutputText(formattedText);

      toast({ description: "Summarization complete" });
    } catch (error) {
      toast({
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({ description: "Copied!" });
  };

  const examples = [
    "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
    "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas.",
    "The COVID-19 pandemic, also known as the coronavirus pandemic, is an ongoing global pandemic of coronavirus disease 2019 (COVID-19) caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The novel virus was first identified in the Chinese city of Wuhan in December 2019; a lockdown in Wuhan and other cities in surrounding Hubei failed to contain the outbreak, and it spread to other parts of mainland China and around the world.",
  ];

  return (
    <div className="space-y-8">
      <ToolHeader
        title="Summarize Text"
        description="Condense long content into concise summaries while preserving key information."
        icon={FileText}
        iconColor="text-emerald-500"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>
              Enter the text you want to summarize
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
                      {Object.entries(summarizeStyles).map(([key, style]) => (
                        <SelectItem key={key} value={key}>
                          {style.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleSummarize}
                    disabled={isGenerating || !inputText.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Summarize"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summarized Text</CardTitle>
            <CardDescription>
              Your summarized content will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">
                    Summary Length: {length[0]}%
                  </span>
                </div>
                <Slider
                  value={length}
                  onValueChange={setLength}
                  min={10}
                  max={90}
                  step={5}
                  className="py-4"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Short</span>
                  <span>Medium</span>
                  <span>Detailed</span>
                </div>
              </div>

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
                ) : outputText ? (
                  <p
                    className="whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: outputText }}
                  ></p>
                ) : (
                  <p className="text-muted-foreground">
                    Summarized text will appear here...
                  </p>
                )}
              </div>
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
    </div>
  );
}
