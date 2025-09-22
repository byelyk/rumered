'use client';

import { StackProvider } from '@stackframe/stack';
import { ReactNode } from 'react';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

export function ConditionalStackProvider({
  children,
}: ConditionalStackProviderProps) {
  // Always use StackProvider now that we have real StackAuth keys
  return <StackProvider>{children}</StackProvider>;
}
