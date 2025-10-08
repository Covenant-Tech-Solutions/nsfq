import CookieConsent from "@/components/extensions/CookieConsent";
import { AppInfoType } from "@/types";
import { GoogleAnalytics } from "@next/third-parties/google";
import React from "react";

interface Types {
  info: AppInfoType | undefined;
  children: React.ReactNode;
}
export const ExtensionsProvider = ({ info, children }: Types) => {
  const googleAnalytics = info?.extensions?.google_analytics;
  const cookie_consent = info?.service_switch?.cookie_consent;
  return (
    <React.Fragment>
      {children}
      {cookie_consent?.is_enabled && cookie_consent ? (
        <CookieConsent cookie={cookie_consent} />
      ) : null}
      {googleAnalytics?.is_enabled && googleAnalytics?.measurement_id ? (
        <GoogleAnalytics gaId={googleAnalytics?.measurement_id} />
      ) : null}
    </React.Fragment>
  );
};
