import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCheck, X } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

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
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">
        Suggested Corrections ({corrections.length})
      </h3>
      <Table>
        <TableBody>
          {corrections.map((correction, index) => (
            <TableRow
              key={index}
              className={`border-b last:border-b-0 ${
                correction.applied ? "bg-green-50 dark:bg-green-900/20" : ""
              }`}
            >
              <TableCell className="p-2">
                <p className="text-sm">
                  <span className="line-through text-red-600 dark:text-red-400">
                    {correction.original}
                  </span>{" "}
                  →{" "}
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {correction.corrected}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({correction.explanation})
                  </span>
                </p>
              </TableCell>
              <TableCell className="w-fit p-2 text-right">
                <div className="flex gap-2 justify-end">
                  {!correction.applied && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onApplyCorrection(index)}
                        title="Apply Correction"
                      >
                        <CheckCheck className="h-4 w-4 text-green-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => onIgnoreCorrection(index)}
                        title="Ignore Correction"
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
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
