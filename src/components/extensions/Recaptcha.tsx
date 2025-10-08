"use client";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import { useMemo, useRef } from "react";
import ReCAPTCHA from "react-google-recaptcha";
interface RecaptchaPropsType {
  handleChange: (token: string | null) => void;
}
const Recaptcha = ({ handleChange }: RecaptchaPropsType) => {
  const recaptchaRef = useRef(null);
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const { site_key, is_enabled } = useMemo(() => {
    return {
      site_key: appInfo?.extensions?.recaptcha?.site_key,
      is_enabled: appInfo?.extensions?.recaptcha?.is_enabled,
    };
  }, [appInfo]);
  return is_enabled && site_key ? (
    <div className="form-group">
      <ReCAPTCHA
        sitekey={site_key}
        ref={recaptchaRef}
        onChange={handleChange}
      />
    </div>
  ) : null;
};

export default Recaptcha;
