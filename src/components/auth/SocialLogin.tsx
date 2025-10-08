/** @format */

"use client";
import fbLogo from "@/../public/fb-logo.png";
import githubIcon from "@/../public/github-logo.png";
import google from "@/../public/google.svg";
import linkedinIcon from "@/../public/linkedin.png";
import xLogo from "@/../public/x-logo.png";
import { publicInstance } from "@/configs/axiosConfig";
import { getFetchInstance } from "@/configs/getFetchInstance";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useOAuthPopup } from "@/hooks/useAuthPopup";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import { UserType } from "@/types/user";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useMemo } from "react";
import ImageLoader from "../ui/ImageLoader";

const providers = [
  {
    icon: google,
    name: "Google",
    provider: "google",
  },
  {
    icon: fbLogo,
    name: "Facebook",
    provider: "facebook",
  },
  {
    icon: xLogo,
    name: "Twitter",
    provider: "twitter",
  },
  {
    icon: linkedinIcon,
    name: "LinkedIn",
    provider: "linkedin",
  },
  {
    icon: githubIcon,
    name: "GitHub",
    provider: "github",
  },
];
const SocialLogin: React.FC = () => {
  const { openGlobalPopup, authCode, provider } = useOAuthPopup();
  const { redirect } = useAuthHandler();
  const {
    login,
    appInfo,
  }: {
    login: (token: string, user: UserType) => void;
    appInfo: AppInfoType;
  } = useAuthStore((state: any) => state);

  const { push } = useRouter();

  const searchParams = useSearchParams();

  const referer = searchParams.get("referer");

  useEffect(() => {
    const getLoginFromCode = async () => {
      let url = "";

      if (referer) {
        url = `/auth/login/${provider}/callback?code=${authCode}&referer=${referer}`;
      } else {
        url = `/auth/login/${provider}/callback?code=${authCode}`;
      }
      const response = (await getFetchInstance({
        url: url,
      })) as any;

      if (response?.data) {
        const data = response?.data;
        login(data.token, data.user);
        push(redirect(data.user));
      }
    };

    if (authCode) {
      getLoginFromCode();
    }
  }, [authCode, login, provider, push, referer, redirect]);
  const handleSocialiteLogin = async (provider: string) => {
    const response = await publicInstance.get(`/auth/login/${provider}`);

    if (response.status === 200) {
      openGlobalPopup(response?.data?.data?.redirect_url);
    }
  };

  const authProviders = useMemo(() => {
    const enabledAuthProviders = appInfo?.application_info?.auth_providers;
    if (!enabledAuthProviders) return [];

    return providers.filter((provider) =>
      enabledAuthProviders.some(
        (p) => p.id === provider.provider && p.is_enabled,
      ),
    );
  }, [appInfo?.application_info?.auth_providers]);

  return (
    <ul className="mt-5 flex w-full flex-wrap items-center justify-center gap-2">
      {authProviders.map((provider) => (
        <li key={provider.provider} className="rounded-full">
          <button
            type="button"
            className="border-dark5 flex size-12 cursor-pointer items-center justify-center rounded-full border text-sm"
            onClick={() => handleSocialiteLogin(provider.provider)}
          >
            <ImageLoader
              src={provider?.icon}
              alt={provider?.name}
              height={24}
              width={24}
              className="size-6"
            />
          </button>
        </li>
      ))}
    </ul>
  );
};

export default SocialLogin;
