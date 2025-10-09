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
import InstallAppPopup from "./InstallAppPopup"; // ✅ import client component

export const metadata: Metadata = {
  manifest: "/manifest.ts",
  title: "Brainbank",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
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
                <InstallAppPopup /> {/* ✅ Now isolated */}
              </ExtensionsProvider>
            </AuthStoreProvider>
          </MenuProvider>
        </PageProvider>
      </ThemeColorProvider>
    </TranslationProvider>
  );
}