import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck, X } from "lucide-react";

interface CorrectionListProps {
  corrections: Array<{
    original: string;
    corrected: string;
    explanation: string;
    applied: boolean;
  }>;
  onApplyCorrection: (index: number) => void;
  onIgnoreCorrection: (index: number) => void;
}

export function CorrectionList({
  corrections,
  onApplyCorrection,
  onIgnoreCorrection,
}: CorrectionListProps) {
  if (corrections.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium text-muted-foreground">
        Suggested Corrections ({corrections.length})
      </h3>
      <div className="space-y-3">
        {corrections.map((correction, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg border ${
              correction.applied
                ? "bg-green-50 dark:bg-green-900/20 border-green-200"
                : "bg-red-50 dark:bg-red-900/20 border-red-200"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm">
                  <span className="line-through text-red-600 dark:text-red-400">
                    {correction.original}
                  </span>
                  {" → "}
                  <span className="text-green-600 dark:text-green-400 font-medium">
                    {correction.corrected}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {correction.explanation}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                {!correction.applied && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onApplyCorrection(index)}
                    >
                      <CheckCheck className="h-4 w-4 text-green-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => onIgnoreCorrection(index)}
                    >
                      <X className="h-4 w-4 text-red-600" />
                    </Button>
                  </>
                )}
                {correction.applied && (
                  <span className="text-xs text-green-600 dark:text-green-400">
                    Applied
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
