"use client";
import { useTranslations } from "@/providers/TranslationProviders";

export default function ForgotPasswordTitle() {
  const { tran } = useTranslations();
  return (
    <div className="flex flex-col items-center justify-center text-center">
      <h4 className="heading-4"> {tran("Forgot Password")}</h4>
      <p className="max-w-[350px] pt-2">
        {tran(
          "Enter your email or phone to send the verification email to reset password",
        )}
      </p>
    </div>
  );
}
