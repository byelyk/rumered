'use client';

import { StackProvider } from '@stackframe/stack';
import { ReactNode } from 'react';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

export function ConditionalStackProvider({
  children,
}: ConditionalStackProviderProps) {
  // Only use StackProvider if we have the required environment variables
  if (process.env.NEXT_PUBLIC_STACKAUTH_API_KEY) {
    return <StackProvider>{children}</StackProvider>;
  }

  // Fallback for development without StackAuth
  return <>{children}</>;
}
