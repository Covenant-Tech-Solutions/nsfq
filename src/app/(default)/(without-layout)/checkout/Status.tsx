/** @format */

"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export default function Status() {
  const { tran } = useTranslations();
  const params = useSearchParams();
  const redirectStatus = params.get("status");

  const statusText = useMemo(() => {
    if (redirectStatus === "succeeded") return "Payment successful";
    if (redirectStatus === "success") return "Payment successful";
    if (redirectStatus === "failed") return "Payment failed";
    if (redirectStatus === "fail") return "Payment failed";
    if (redirectStatus === "cancelled") return "Payment Cancelled";
    if (redirectStatus === "cancel") return "Payment Cancelled";
    return "";
  }, [redirectStatus]);

  return (
    <div className="flex h-dvh flex-col items-center justify-center">
      <div className="wave-animation">
        <div className="bg-g60 flex size-32 items-center justify-center rounded-full">
          <CheckIcon className="relative z-[500] text-6xl text-white" />
        </div>

        <div className="waves wave-1"></div>
        <div className="waves wave-2"></div>
        <div className="waves wave-3"></div>
      </div>
      <div className="pt-20 text-2xl">{<p>{tran(statusText)}</p>}</div>

      <Link href="/" className="btn-primary mt-10 text-lg">
        {tran("Go to home")}
      </Link>
    </div>
  );
}
