"use client";

import { useState } from 'react';
import { Scissors, Copy, CheckCheck, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTokens } from '@/hooks/use-tokens';
import { useToast } from '@/hooks/use-toast';
import ToolHeader from '@/components/tools/tool-header';
import ToolUsageExamples from '@/components/tools/tool-usage-examples';

export default function ParaphrasePage() {
  const { useToken } = useTokens();
  const { toast } = useToast();
  
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [style, setStyle] = useState('standard');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const handleParaphrase = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Empty input",
        description: "Please enter some text to paraphrase.",
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
      
      // Mock paraphrasing result based on selected style
      let result = '';
      
      switch (style) {
        case 'formal':
          result = `I would like to formally rephrase your text in a more professional manner. ${inputText.split(' ').slice(1).join(' ')}`;
          break;
        case 'simple':
          result = `Here's a simpler version of what you wrote. ${inputText.split(' ').slice(1).join(' ')}`;
          break;
        case 'creative':
          result = `Let me reimagine this text with more creativity and flair. ${inputText.split(' ').slice(1).join(' ')}`;
          break;
        default:
          result = `Here's a standard paraphrase of your text. ${inputText.split(' ').slice(1).join(' ')}`;
      }
      
      setOutputText(result);
      
      toast({
        title: "Paraphrasing complete",
        description: "Your text has been successfully paraphrased.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to paraphrase text. Please try again.",
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
    "The quick brown fox jumps over the lazy dog.",
    "Artificial intelligence is transforming how we interact with technology.",
    "Climate change represents one of the most significant challenges facing humanity today."
  ];
  
  return (
    <div className="space-y-8">
      <ToolHeader 
        title="Paraphrase Text" 
        description="Rewrite your content in different styles while preserving the original meaning."
        icon={Scissors}
        iconColor="text-blue-500"
      />
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Original Text</CardTitle>
            <CardDescription>Enter the text you want to paraphrase</CardDescription>
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
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="simple">Simple</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleParaphrase} 
                    disabled={isGenerating || !inputText.trim()}
                  >
                    {isGenerating ? (
                      <>
                        <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Paraphrase"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Paraphrased Text</CardTitle>
            <CardDescription>Your paraphrased content will appear here</CardDescription>
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
                  <p className="text-muted-foreground">Paraphrased text will appear here...</p>
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