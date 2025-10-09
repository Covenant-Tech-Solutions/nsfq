/** @format */

import StructuredData from "@/components/extensions/StructuredData";
import { getAppInfo, getMenus, getPages } from "@/hooks/server";
import { AuthStoreProvider } from "@/providers/AuthStoreProviders";
import { ExtensionsProvider } from "@/providers/ExtensionsProvider";
import { MenuProvider } from "@/providers/MenuProvider";
import { PageProvider } from "@/providers/PageProvider";
import { ThemeColorProvider } from "@/providers/ThemeProvider";
import { TranslationProvider } from "@/providers/TranslationProviders";
import { Metadata } from "next";
import { useEffect, useRef, useState } from "react";

export const metadata: Metadata = {
  manifest: "/manifest.ts",
};

// Persistent Install App popup component
function InstallAppPopup() {
  const [show, setShow] = useState(false);
  const deferredPrompt = useRef<any>(null);

  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      deferredPrompt.current = e;
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
      const { outcome } = await deferredPrompt.current.userChoice;
      if (outcome === "accepted") {
        setShow(false);
      }
    }
  };

  // Always show if not installed and prompt is available
  if (!show) return null;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        left: 0,
        right: 0,
        zIndex: 9999,
        display: "flex",
        justifyContent: "center",
        pointerEvents: "auto",
      }}
    >
      <div className="bg-primary text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4">
        <span className="font-semibold">Install Brainbank</span>
        <button
          className="bg-white text-primary px-4 py-1 rounded-full font-bold"
          onClick={handleInstall}
        >
          Install
        </button>
      </div>
    </div>
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [pages, info, menu] = await Promise.all([
    getPages(),
    getAppInfo(),
    getMenus(),
  ]);

  return (
    <TranslationProvider>
      <ThemeColorProvider themeColor={info?.application_info?.theme}>
        <PageProvider pagesData={pages}>
          <MenuProvider menuData={menu}>
            <AuthStoreProvider info={info}>
              <ExtensionsProvider info={info}>
                {children}
                <StructuredData />
                {/* Persistent Install App popup */}
                <InstallAppPopup />
              </ExtensionsProvider>
            </AuthStoreProvider>
          </MenuProvider>
        </PageProvider>
      </ThemeColorProvider>
    </TranslationProvider>
  );
}
