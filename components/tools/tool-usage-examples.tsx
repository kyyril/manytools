"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { LightbulbIcon } from 'lucide-react';

interface ToolUsageExamplesProps {
  examples: string[];
  onSelectExample: (example: string) => void;
}

const ToolUsageExamples = ({ examples, onSelectExample }: ToolUsageExamplesProps) => {
  const [open, setOpen] = useState(false);

  const handleSelectExample = (example: string) => {
    onSelectExample(example);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <LightbulbIcon className="mr-2 h-4 w-4" />
          Examples
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[300px] p-0">
        <div className="p-4 border-b">
          <h4 className="font-medium">Example texts</h4>
          <p className="text-sm text-muted-foreground">
            Click an example to use it
          </p>
        </div>
        <div className="space-y-2 p-4">
          {examples.map((example, index) => (
            <div
              key={index}
              onClick={() => handleSelectExample(example)}
              className="text-sm p-2 rounded hover:bg-muted cursor-pointer"
            >
              {example.length > 60 ? example.substring(0, 60) + '...' : example}
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ToolUsageExamples;