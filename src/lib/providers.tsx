"use client";

import { ReactNode } from "react";
import { ClerkProvider } from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface ProviderProps {
  children: ReactNode;
}

export function ClerkAuthProvider({ children }: ProviderProps) {
  return <ClerkProvider>{children}</ClerkProvider>;
}

export function ReactQueryProvider({ children }: ProviderProps) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
