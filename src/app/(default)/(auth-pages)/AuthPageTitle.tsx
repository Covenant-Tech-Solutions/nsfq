"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import { useSearchParams } from "next/navigation";

export default function AuthPageTitle({ title }: { title: string }) {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const phone = searchParams?.get("phone");

  const { tran } = useTranslations();
  return (
    <>
      <h4 className="heading-4 pb-1 text-center">{tran(title)}</h4>
      <p className="pt-2 text-center">
        {email && (
          <span>
            {tran("Send OTP to email:")} {email}
          </span>
        )}
        {phone && (
          <span>
            {tran("Send OTP to phone:")} {phone}
          </span>
        )}
      </p>
    </>
  );
}
