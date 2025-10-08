/** @format */

"use client";
import Loader from "@/components/ui/Loader";
import { ThemeColorType } from "@/types";
import NextTopLoader from "nextjs-toploader";
import { createContext, Suspense, useContext, useEffect, useMemo } from "react";

const ThemeContext = createContext<{ theme: ThemeColorType | undefined }>({
  theme: {
    primary_color: "",
    secondary_color: "",
  },
});

type ThemeProviderTypes = {
  children: React.ReactNode;
  themeColor: ThemeColorType | undefined;
};

export const ThemeColorProvider = ({
  children,
  themeColor,
}: ThemeProviderTypes) => {
  const value = useMemo(() => ({ theme: themeColor }), [themeColor]);
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/service-worker.js")
          .then((reg) => {
            reg.active?.postMessage({
              type: "SET_CACHE_KEY",
              cacheName: process.env.NEXT_PUBLIC_API_BASE_URL, // dynamic key
            });
          })
          .catch((err) => console.error("SW registration failed:", err));
      });
    }
  }, []);
  useEffect(() => {
    const { primary_color, secondary_color } = value.theme || {};
    if (primary_color && secondary_color) {
      document.documentElement.style.setProperty(
        "--primary",
        primary_color || "#008744",
      );
      document.documentElement.style.setProperty(
        "--secondary",
        secondary_color,
      );
    }
  }, [value]);

  return (
    <Suspense fallback={<Loader />}>
      <ThemeContext.Provider value={value}>
        <NextTopLoader color={value?.theme?.primary_color} showSpinner />
        {children}
      </ThemeContext.Provider>
    </Suspense>
  );
};

export const useThemeColor = () => {
  return useContext(ThemeContext);
};
