/** @format */

import {
  ONBOARDING_POSITION,
  ONBOARDING_STEPS,
  PROTECTED_PATHS,
} from "@/configs";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType, RecaptchaType } from "@/types";
import { UserType } from "@/types/user";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import Cookies from "js-cookie";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { useQueryMutation } from "./mutate/useQueryMutation";

type useAuthHandlerTypes = {
  recaptcha: RecaptchaType;
  authConfig: {
    recaptcha: RecaptchaType;
    is_phone_enabled: boolean;
    is_email_enabled: boolean;
    is_kyc_enabled: boolean;
  };
  sendOTP: UseMutateFunction<
    AxiosResponse<any, any>,
    any,
    {
      [key: string]: any;
    },
    unknown
  >;
  verifyOTP: UseMutateFunction<
    AxiosResponse<any, any>,
    any,
    {
      [key: string]: any;
    },
    unknown
  >;
  otpSendLoading: boolean;
  verifyLoading: boolean;
  redirect: (user: UserType) => string;
  setKycWaitingStep: () => void;
  setOtpBreakTimer: (otp_expire_key: string) => void;
};
export const useAuthHandler = () => {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const path = usePathname();
  const signInCount = Cookies.get("sign_in_count");

  const authConfig = useMemo(() => {
    return {
      recaptcha: appInfo?.extensions?.recaptcha,
      is_phone_enabled:
        appInfo?.service_switch?.system_config?.phone_verification?.is_enabled,
      is_email_enabled:
        appInfo?.service_switch?.system_config?.email_verification?.is_enabled,
      is_kyc_enabled:
        appInfo?.service_switch?.system_config?.is_kyc_enabled?.is_enabled,
    };
  }, [appInfo]);

  const { mutate: sendOTP, isLoading: otpSendLoading } = useQueryMutation({
    isPublic: true,
    url: "auth/send-otp",
  });

  const { mutate: verifyOTP, isLoading: verifyLoading } = useQueryMutation({
    isPublic: true,
    url: "auth/verify-email-or-phone",
  });

  const setOtpBreakTimer = (otp_expire_key: string) => {
    const breakTime =
      Number(appInfo?.application_info?.otp?.expire_time || 2) * 60;
    const newExpiry = Date.now() + breakTime * 1000;
    localStorage.setItem(otp_expire_key, newExpiry.toString());
  };

  const redirect = (user: UserType) => {
    const { is_email_enabled, is_phone_enabled, is_kyc_enabled } = authConfig;

    if (
      (is_email_enabled && !user?.email_verified_at) ||
      (is_phone_enabled && !user?.phone_verified_at)
    ) {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.verification.value);
      if (!user?.email_verified_at) {
        return `/verify-otp/?email=${user?.email}`;
      }
      if (
        !user?.phone_verified_at &&
        user?.phone &&
        !user?.phone_verified_at &&
        signInCount === "2"
      ) {
        return `/verify-otp/?phone=${user?.phone}`;
      }
    }
    if (
      is_kyc_enabled &&
      !user?.is_kyc_verified &&
      (!user?.kyc || user?.kyc?.status === "rejected")
    ) {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.kyc.value);
      return "/kyc";
    }

    if (
      is_kyc_enabled &&
      !user?.is_kyc_verified &&
      Cookies.get(ONBOARDING_POSITION) === ONBOARDING_STEPS.waiting.value
    ) {
      return "/waiting";
    }

    if (user?.kyc && user?.kyc?.status === "pending") {
      Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.waiting.value);
      return "/waiting";
    }

    Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.completed.value);

    if (user?.phone_verified_at) {
      if (signInCount === "2") {
        Cookies.remove("sign_in_count");
      } else {
        Cookies.set("sign_in_count", "1");
      }
    }

    const isSameUrl = PROTECTED_PATHS.find((p) => path && path?.startsWith(p));
    if (!isSameUrl) {
      return "/dashboard/profile";
    }
  };

  const setKycWaitingStep = () => {
    Cookies.set(ONBOARDING_POSITION, ONBOARDING_STEPS.waiting.value);
  };

  return {
    authConfig,
    sendOTP,
    verifyOTP,
    otpSendLoading,
    verifyLoading,
    redirect,
    setKycWaitingStep,
    setOtpBreakTimer,
  } as useAuthHandlerTypes;
};
