import { queryClient } from "@/shared/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}