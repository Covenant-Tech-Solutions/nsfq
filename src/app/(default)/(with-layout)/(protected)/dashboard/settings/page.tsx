/** @format */
"use client";

import { useTranslations } from "@/providers/TranslationProviders";
import ChangePasswordForm from "./ChangePasswordForm";
import TwoFactorAuthToggle from "./TwoFactorAuthToggle";
import UpdateUserProfile from "./UpdateUserProfile";

export default function Settings() {
  const { tran } = useTranslations();
  return (
    <div className="bg-primary/5 rounded-xl p-6">
      <h3 className="heading-3 pb-6 !font-medium">{tran("Settings")}</h3>
      <UpdateUserProfile tran={tran} />
      <ChangePasswordForm />
      <TwoFactorAuthToggle />
    </div>
  );
}
