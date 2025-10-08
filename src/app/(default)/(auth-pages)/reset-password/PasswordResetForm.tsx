/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function PasswordResetForm() {
  const { tran } = useTranslations();
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = (searchParams.get("email") || "").replace(/^"|"$/g, "");
  const [passwordResetForm, setPasswordResetForm] = useState({
    type: "email",
    email: "",
    password: "",
    password_confirmation: "",
    otp: 12345,
  });

  useEffect(() => {
    setPasswordResetForm((prev) => ({ ...prev, email: email }));
  }, [email]);

  const { mutate: passResetMutate, backendErrors: passResetErrors } =
    useQueryMutation({
      isPublic: true,
      url: "auth/forgot-password",
    });

  const updatePassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    passResetMutate(passwordResetForm, {
      onSuccess: (response) => {
        if (response.data.statusCode == 200) {
          router.push("/dashboard");
        }
      },
    });
  };
  return (
    <form onSubmit={updatePassword} className="flex flex-col gap-3">
      <PasswordInput
        label={tran("Password")}
        name="password"
        form={passwordResetForm}
        setForm={setPasswordResetForm}
        errors={passResetErrors}
      />
      <PasswordInput
        label={tran("Confirm Password")}
        name="password_confirmation"
        form={passwordResetForm}
        setForm={setPasswordResetForm}
        errors={passResetErrors}
      />
      <div className="pt-4">
        <Button className="w-full">{tran("Save")}</Button>
      </div>
    </form>
  );
}
