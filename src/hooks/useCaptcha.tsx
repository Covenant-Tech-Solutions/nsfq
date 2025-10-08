import { useAuthStore } from "@/providers/AuthStoreProviders";
import { RecaptchaType } from "@/types";
import { useMemo } from "react";

export const useCaptcha = () => {
  const { appInfo } = useAuthStore((state) => state);

  const recaptcha = useMemo(() => {
    return appInfo?.extensions?.recaptcha;
  }, [appInfo]);

  return {
    recaptcha,
  } as {
    recaptcha: RecaptchaType;
  };
};
