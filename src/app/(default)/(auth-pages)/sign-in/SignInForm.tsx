/** @format */

"use client";
import Recaptcha from "@/components/extensions/Recaptcha";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function SignInForm() {
  const { tran } = useTranslations();
  const router = useRouter();
  const { login } = useAuthStore((state: any) => state);
  const { redirect, authConfig } = useAuthHandler();
  const signInCount = Cookies.get("sign_in_count");

  if (signInCount === "1") {
    Cookies.remove("sign_in_count");
    Cookies.set("sign_in_count", "2");
  }

  const [credentials, setCredentials] = useState<{
    username: string;
    captcha_token: string;
    loginPassword: string;
  }>({
    username: "user@gmail.com",
    captcha_token: "",
    loginPassword: "12345678",
  });
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") || "/";

  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    isPublic: true,
    url: "auth/sign-in",
  });

  const handleChange = (token: string | null) => {
    setCredentials({ ...credentials, captcha_token: token || "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (authConfig.recaptcha.is_enabled) {
      if (!credentials.captcha_token) {
        toast.error(tran("Please verify you are not a robot"));
        return;
      }
    }
    mutate(
      {
        username: credentials.username,
        password: credentials.loginPassword,
        captcha_token: credentials.captcha_token,
      },
      {
        onSuccess: (response: any) => {
          const data = response?.data?.data;

          if (data?.user?.is_2fa_enabled) {
            router.push(`/2fa-verify?email=${data.user.email}`);
            return;
          }

          if (!data?.token || !data?.user) {
            toast.error(tran("Something went wrong, please try again later"));
            return;
          }

          login(data.token, data.user);

          if (data?.user?.phone_verified_at && signInCount === "2") {
            Cookies.remove("sign_in_count");
          }

          if (decodeURIComponent(redirectPath) === "/") {
            router.push(redirect(data.user));
          } else {
            router.push(decodeURIComponent(redirectPath));
          }
        },
      },
    );
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
        <InputGroup
          label={"Email"}
          name="username"
          value={credentials.username}
          onChange={(e) =>
            setCredentials((prev) => ({
              ...prev,
              username: e,
            }))
          }
          errors={errors}
          placeholder="Enter your email/username"
        />
        <PasswordInput
          label={"Password"}
          name="loginPassword"
          form={credentials}
          setForm={setCredentials}
          errors={errors}
        />
        <Link
          href={"/forgot-password"}
          className="text-primary text-end text-sm hover:underline"
        >
          {tran("Forget Password?")}{" "}
        </Link>
        {/* Setup Recaptcha */}
        <Recaptcha handleChange={handleChange} />
        <div className="pt-3">
          <Button type="submit" loading={isLoading} className="w-full">
            {tran("Sign In")}
          </Button>
        </div>
      </form>
      <p className="text-center max-sm:text-sm">
        {tran("New to QuiziX Join our commission-free platform")}{" "}
        <Link href="/sign-up" className="text-secondary underline">
          {tran("Sign Up")}
        </Link>
      </p>
    </>
  );
}
