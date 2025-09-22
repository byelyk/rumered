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
  if (
    process.env.NEXT_PUBLIC_STACK_PROJECT_ID &&
    process.env.NEXT_PUBLIC_STACK_PUBLISHABLE_CLIENT_KEY
  ) {
    return <StackProvider>{children}</StackProvider>;
  }

  // Fallback for development without StackAuth
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
