"use client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { createQueryClient } from "@/lib/query-client";
import { ToastProvider } from "@/components/feedback/toast-provider";
export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => createQueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ToastProvider />
    </QueryClientProvider>
  );
}
