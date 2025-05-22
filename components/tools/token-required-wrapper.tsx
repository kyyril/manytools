"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Coins, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useTokens } from '@/hooks/use-tokens';
import { useAuth } from '@/hooks/use-auth';

const TokenRequiredWrapper = ({ children }: { children: React.ReactNode }) => {
  const { tokens, guestUsageCount } = useTokens();
  const { user } = useAuth();
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [showNoTokensPrompt, setShowNoTokensPrompt] = useState(false);

  useEffect(() => {
    // Check if guest has used up their free tries
    if (!user && guestUsageCount >= 2) {
      setShowLoginPrompt(true);
    }
    
    // Check if logged in user has no tokens
    if (user && tokens <= 0) {
      setShowNoTokensPrompt(true);
    }
  }, [user, tokens, guestUsageCount]);

  return (
    <>
      {children}
      
      {/* Login prompt for guests */}
      <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login Required</DialogTitle>
            <DialogDescription>
              You've used your free guest access. Please login or create an account to continue using our tools.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-4 flex items-start">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800 dark:text-amber-500">Guest limit reached</h4>
                <p className="text-sm text-amber-700 dark:text-amber-400">
                  You've used all 2 free guest attempts. Sign up to get 3 tokens and access to all tools.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
                Back to Home
              </Button>
              <Button onClick={() => router.push('/')} className="flex-1">
                Login / Register
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* No tokens prompt for logged in users */}
      <Dialog open={showNoTokensPrompt} onOpenChange={setShowNoTokensPrompt}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Out of Tokens</DialogTitle>
            <DialogDescription>
              You don't have any tokens left. Watch an ad to earn 5 more tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 flex items-start">
              <Coins className="h-5 w-5 text-blue-600 dark:text-blue-500 mr-3 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-500">Token balance: 0</h4>
                <p className="text-sm text-blue-700 dark:text-blue-400">
                  Each tool usage requires 1 token. Watch a short ad to earn 5 tokens.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
                Back to Home
              </Button>
              <Button onClick={() => router.push('/')} className="flex-1">
                Watch Ad
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TokenRequiredWrapper;