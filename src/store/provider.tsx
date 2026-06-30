"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { Provider } from "react-redux";
import { Toaster } from "sonner";

import { getQueryClient } from "@/lib/react-query";
import { store } from "@/store";
import { FirebaseNotificationListener } from "@/components/providers/FirebaseNotificationListener";

// ============================================================
// Global Providers Wrapper
// ============================================================
interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(() => getQueryClient());

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
        <FirebaseNotificationListener />
        <Toaster
          position="bottom-right"
          richColors
          closeButton
          expand={false}
          visibleToasts={1}
          toastOptions={{
            duration: 4000,
            className: "text-base md:text-lg font-semibold py-4 px-5 shadow-xl rounded-xl border border-border/10",
            classNames: {
              title: "font-bold text-base md:text-[17px]",
              description: "text-sm font-medium opacity-90",
              closeButton: "scale-110",
            }
          }}
        />
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </Provider>
  );
}

