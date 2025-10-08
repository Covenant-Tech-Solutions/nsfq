/** @format */

"use client";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

const OauthLogin = ({ provider }: { provider: string }) => {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  useEffect(() => {
    if (provider) {
      window.opener.postMessage(
        { code: code, provider: provider },
        window.location.origin,
      );
    }
  }, [code, provider]);
  return null;
};

export default OauthLogin;
