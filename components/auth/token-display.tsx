"use client";

import { useState } from "react";
import { Coins, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { useTokens } from "@/hooks/use-tokens";

const TokenDisplay = () => {
  const { tokens, addTokens } = useTokens();
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const [adProgress, setAdProgress] = useState(0);
  const [showAdDialog, setShowAdDialog] = useState(false);

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    setAdProgress(0);
    setShowAdDialog(true);

    try {
      // Simulate ad progress
      const interval = setInterval(() => {
        setAdProgress((prev) => {
          const newProgress = prev + 2;
          if (newProgress >= 100) {
            clearInterval(interval);
            return 100;
          }
          return newProgress;
        });
      }, 100);

      // Wait for animation to complete
      await new Promise((resolve) => setTimeout(resolve, 5000));

      // Add tokens only after animation completes
      await addTokens(5);

      // Close dialog after a short delay
      setTimeout(() => {
        setIsWatchingAd(false);
        setShowAdDialog(false);
      }, 500);
    } catch (error) {
      console.error("Error during ad reward:", error);
      setIsWatchingAd(false);
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">
        <Coins className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
          {tokens}
        </span>
        <Button
          size="sm"
          variant="ghost"
          className="h-6 w-6 p-0 rounded-full ml-1 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-800"
          onClick={handleWatchAd}
          disabled={isWatchingAd}
        >
          <Play className="h-3 w-3" />
        </Button>
      </div>

      <Dialog
        open={showAdDialog}
        onOpenChange={(open) => !isWatchingAd && setShowAdDialog(open)}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Watch Ad for Tokens</DialogTitle>
            <DialogDescription>
              {adProgress < 100
                ? "Please watch the entire ad to receive 5 tokens."
                : "Thanks for watching! 5 tokens have been added to your account."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div className="w-full h-48 bg-slate-200 dark:bg-slate-700 rounded-md flex items-center justify-center mb-4">
              {adProgress < 100 ? (
                <span className="text-muted-foreground">Ad is playing...</span>
              ) : (
                <span className="text-green-600 font-medium">
                  Ad completed!
                </span>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Ad progress
                </span>
                <span className="text-sm font-medium">{adProgress}%</span>
              </div>
              <Progress value={adProgress} className="h-2" />
              {adProgress === 100 && (
                <div className="flex items-center justify-center mt-4">
                  <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-md flex items-center">
                    <Coins className="h-5 w-5 mr-2" />
                    <span className="font-medium">+5 Tokens Added!</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenDisplay;
