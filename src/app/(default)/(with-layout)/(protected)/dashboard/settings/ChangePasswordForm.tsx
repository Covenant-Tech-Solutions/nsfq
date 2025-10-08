/** @format */

// components/PasswordStrengthChecker.tsx
"use client";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function ChangePasswordForm() {
  const { tran } = useTranslations();
  const [changePassword, setChangePassword] = useState({
    password: "",
    password_confirmation: "",
  });

  const [frontendValidationError, setFrontendValidationError] = useState({});

  const {
    mutate: changePasswordMutate,
    isLoading: changePasswordMutateLoading,
    backendErrors: errors,
  } = useQueryMutation({
    url: "/profile/update-profile",
  });

  const handlePasswordValidation = () => {
    const { password, password_confirmation } = changePassword;

    if (!password) {
      setFrontendValidationError({ password: tran("Password is required!") });
      return false;
    }

    if (!password_confirmation) {
      setFrontendValidationError({
        password_confirmation: tran("Password confirmation is required!"),
      });
      return false;
    }

    if (password !== password_confirmation) {
      setFrontendValidationError({
        password_confirmation: tran("Passwords do not match!"),
      });
      return false;
    }

    setFrontendValidationError({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!handlePasswordValidation()) {
      return;
    }
    changePasswordMutate(changePassword, {
      onSuccess: () => {
        toast.success(tran("Password updated successfully."));
        setChangePassword({
          password: "",
          password_confirmation: "",
        });
      },
    });
  };

  return (
    <div className="mt-6 rounded-lg bg-white p-6 pt-6">
      <div className="flex flex-col pb-1">
        <p className="text-xl font-medium">{tran("Change Password")}</p>
        <p className="text-sm text-slate-500">
          {tran("You can change your password here.")}
        </p>

        <form onSubmit={handleSubmit} className="mx-auto w-full space-y-3 pt-6">
          <PasswordInput
            label={"New Password"}
            name="password"
            form={changePassword}
            setForm={setChangePassword}
            errors={errors || frontendValidationError}
          />

          <PasswordInput
            label={"Confirm New Password"}
            name="password_confirmation"
            form={changePassword}
            setForm={setChangePassword}
            errors={errors || frontendValidationError}
          />

          <div className="pt-3">
            <Button
              type="submit"
              className="w-full"
              loading={changePasswordMutateLoading}
            >
              {tran("Save")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
