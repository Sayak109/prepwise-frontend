"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/feedback/toast-provider";
import { GlobalQueryLoadingBar } from "@/components/feedback/global-query-loading-bar";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalQueryLoadingBar />
      {children}
      <ToastProvider />
    </QueryClientProvider>
  );
}
