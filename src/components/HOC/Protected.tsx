/** @format */

"use client";
import { MAINTENANCE } from "@/configs";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { UserType } from "@/types/user";
import { getToken } from "@/utils";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

export const Protected = ({ children }: { children: React.ReactNode }) => {
  const { user }: { user: UserType } = useAuthStore((state: any) => state);
  const { redirect, authConfig } = useAuthHandler();
  const { tran } = useTranslations();
  const token = getToken();
  const maintenanceMode = Cookies.get(MAINTENANCE);
  const { push } = useRouter();

  const isReady = !!user && !!authConfig;

  useEffect(() => {
    if (maintenanceMode && maintenanceMode == "true") {
      push("/maintenance");
      return;
    }
    if (!token) {
      push("/sign-in");
      return;
    }

    if (!isReady) return;

    const needsVerification =
      (authConfig.is_email_enabled && !user?.email_verified_at) ||
      (authConfig.is_phone_enabled && !user?.phone_verified_at) ||
      (authConfig.is_kyc_enabled && !user?.is_kyc_verified);

    if (token && needsVerification) {
      push(redirect(user));
    }
  }, [token, user, push, redirect, maintenanceMode, tran, authConfig, isReady]);

  if (!isReady) {
    return (
      <div className="flex h-screen items-center justify-center">
        <svg className="loader_svg" viewBox="25 25 50 50">
          <circle r="20" cy="50" cx="50"></circle>
        </svg>
      </div>
    );
  }

  return <>{children}</>;
};
