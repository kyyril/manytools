"use client";

import { useState } from 'react';
import { FileCheck, Copy, CheckCheck, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useTokens } from '@/hooks/use-tokens';
import { useToast } from '@/hooks/use-toast';
import ToolHeader from '@/components/tools/tool-header';
import ToolUsageExamples from '@/components/tools/tool-usage-examples';

export default function GrammarPage() {
  const { useToken } = useTokens();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [stats, setStats] = useState<null | {
    errors: number;
    improvements: number;
    readabilityScore: number;
  }>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleCheck = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to check grammar.",
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
      
      // Mock grammar checking result
      // This is a very simple mock - in reality, you'd use a real grammar API
      const errors = Math.floor(Math.random() * 5);
      const improvements = Math.floor(Math.random() * 3) + 2;
      const readabilityScore = Math.floor(Math.random() * 30) + 70;
      
      // Simple mock corrections - in real life, this would be more sophisticated
      let corrected = inputText
        .replace(/\si\s/g, " I ")
        .replace(/\s\s+/g, " ")
        .replace(/\b(cant|didnt|wont|shouldnt|couldnt)\b/g, (match) => {
          const map: Record<string, string> = {
            'cant': "can't",
            'didnt': "didn't",
            'wont': "won't",
            'shouldnt': "shouldn't",
            'couldnt': "couldn't"
          };
          return map[match] || match;
        });
      
      setOutputText(corrected);
      setStats({
        errors,
        improvements,
        readabilityScore
      });
      
      toast({
        title: "Grammar check complete",
        description: `Found ${errors} errors and made ${improvements} improvements.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to check grammar. Please try again.",
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
      description: "Corrected text copied to clipboard.",
    });
  };
  
  const examples = [
    "i cant believe how amazing this product is! its definately worth the money and i would recomend it to anyone who asks me about it.",
    "The team have completed the project on time, but there was several issues with the implementation that needs to be fixed urgently.",
    "we went to the store yesterday, we bought some grocerys for dinner but we forgot to get desert so we had to go back later"
  ];
  
  return (
    <div className="space-y-8">
      <ToolHeader 
        title="Grammar Checker" 
        description="Fix grammar, spelling, and punctuation errors in your text."
        icon={FileCheck}
        iconColor="text-amber-500"
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Enter the text you want to check</CardDescription>
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
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Corrected Text</CardTitle>
            <CardDescription>Corrections will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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
                  <p className="text-muted-foreground">Corrected text will appear here...</p>
                )}
              </div>
              
              {stats && (
                <div className="grid grid-cols-3 gap-4 pb-4">
                  <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold text-amber-600">{stats.errors}</p>
                    <p className="text-xs text-amber-800 dark:text-amber-400">Errors Fixed</p>
                  </div>
                  <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold text-green-600">{stats.improvements}</p>
                    <p className="text-xs text-green-800 dark:text-green-400">Improvements</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-md text-center">
                    <p className="text-2xl font-bold text-blue-600">{stats.readabilityScore}</p>
                    <p className="text-xs text-blue-800 dark:text-blue-400">Readability</p>
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
    </div>
  );
}