"use client";

import { useState } from 'react';
import { FileText, Copy, CheckCheck, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from "@/components/ui/slider";
import { useTokens } from '@/hooks/use-tokens';
import { useToast } from '@/hooks/use-toast';
import ToolHeader from '@/components/tools/tool-header';
import ToolUsageExamples from '@/components/tools/tool-usage-examples';

export default function SummarizePage() {
  const { useToken } = useTokens();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [length, setLength] = useState([50]); // percentage of original text
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to summarize.",
        variant: "destructive",
      });
      return;
    }
    
    // Check token availability
    if (!useToken()) {
      toast({
        title: "No tokens available",
        description: "Please watch an ad to earn more tokens.",
        variant: "destructive",
      });
      return;
    }
    
    setIsGenerating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock summarizing result based on selected length
      const words = inputText.split(' ');
      const summaryLength = Math.max(Math.floor(words.length * length[0] / 100), 5);
      const summary = `Summary (${length[0]}% of original): ${words.slice(0, summaryLength).join(' ')}`;
      
      setOutputText(summary);
      
      toast({
        title: "Summarizing complete",
        description: "Your text has been successfully summarized.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to summarize text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    toast({
      title: "Copied!",
      description: "Text copied to clipboard.",
    });
  };
  
  const examples = [
    "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. AI research has been defined as the field of study of intelligent agents, which refers to any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
    "Climate change refers to long-term shifts in temperatures and weather patterns. These shifts may be natural, such as through variations in the solar cycle. But since the 1800s, human activities have been the main driver of climate change, primarily due to burning fossil fuels like coal, oil and gas.",
    "The COVID-19 pandemic, also known as the coronavirus pandemic, is an ongoing global pandemic of coronavirus disease 2019 (COVID-19) caused by severe acute respiratory syndrome coronavirus 2 (SARS-CoV-2). The novel virus was first identified in the Chinese city of Wuhan in December 2019; a lockdown in Wuhan and other cities in surrounding Hubei failed to contain the outbreak, and it spread to other parts of mainland China and around the world."
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
            <CardDescription>Enter the text you want to summarize</CardDescription>
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
            <CardDescription>Your summarized content will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Summary Length: {length[0]}%</span>
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
              
              <div className={`min-h-[200px] p-3 rounded-md border ${outputText ? 'bg-muted/50' : 'bg-muted/30'}`}>
                {isGenerating ? (
                  <div className="flex flex-col gap-2 animate-pulse">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-5/6"></div>
                    <div className="h-4 bg-muted rounded w-4/5"></div>
                  </div>
                ) : outputText ? (
                  <p className="whitespace-pre-line">{outputText}</p>
                ) : (
                  <p className="text-muted-foreground">Summarized text will appear here...</p>
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