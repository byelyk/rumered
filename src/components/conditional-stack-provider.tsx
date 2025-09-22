'use client';

import { ReactNode } from 'react';

interface ConditionalStackProviderProps {
  children: ReactNode;
}

export function ConditionalStackProvider({
  children,
}: ConditionalStackProviderProps) {
  // Use mock authentication for now
  // StackAuth will be enabled once properly configured in dashboard
  return <div className="min-h-screen flex flex-col">{children}</div>;
}
