/** @format */

"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { CookieConsentType } from "@/types";
import { hasCookie, setCookie } from "cookies-next";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

interface CookieConsentProps {
  cookie: CookieConsentType;
}
const CookieConsent = ({ cookie }: CookieConsentProps) => {
  const [showConsent, setShowConsent] = useState(true);
  const { tran } = useTranslations();

  useEffect(() => {
    const checkCookie = async () => {
      const consent = await hasCookie("localConsent");
      setShowConsent(consent);
    };
    checkCookie();
  }, []);

  const acceptCookie = () => {
    setShowConsent(true);
    setCookie("localConsent", "true", {});
  };

  const handleDecline = () => {
    setShowConsent(true);
    setCookie("localConsent", "false", {});
  };

  if (showConsent) {
    return null;
  }

  return (
    <div
      className={`border-secondary/80 fixed right-0 bottom-0 z-50 mx-2 flex max-w-[400px] items-center justify-center divide-blue-400 rounded-xl border-2 border-t bg-white shadow-2xl sm:mx-5 ${showConsent ? "translate-y-0" : "translate-y-[-20px]"} duration-500`}
    >
      <div className="bg-secondary/5 flex w-full items-center justify-center px-3 py-5 sm:px-5 sm:py-8">
        <div className="">
          <h4 className="heading-4">{cookie?.title}</h4>
          <div className="pt-3">
            <p>{cookie?.description}</p>
            <div className="flex items-center justify-start gap-3 pt-6">
              <Button
                type="button"
                onClick={handleDecline}
                variant="danger-outline"
              >
                {tran("Decline")}
              </Button>
              <Button type="button" onClick={acceptCookie}>
                {tran("Accept")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;
