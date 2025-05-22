import { ReactNode } from 'react';
import TokenRequiredWrapper from '@/components/tools/token-required-wrapper';

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <TokenRequiredWrapper>
        {children}
      </TokenRequiredWrapper>
    </div>
  );
}