"use client";
import { getQueryClient } from "@/configs/query-client";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";

interface Types {
  children: React.ReactNode;
}
export default function GlobalProvider({ children }: Types) {
  return (
    <>
      <QueryClientProvider client={getQueryClient()}>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
      <Toaster position="top-right" />
    </>
  );
}
