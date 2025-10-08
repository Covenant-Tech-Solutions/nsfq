/** @format */

"use client";
import Recaptcha from "@/components/extensions/Recaptcha";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";
import InputPhone from "@/components/ui/InputPhone";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { countryCodes } from "@/constants/country-codes";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { UserType } from "@/types/user";
import { cn } from "@/utils/cn";
import { CheckIcon } from "@phosphor-icons/react/dist/ssr";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import toast from "react-hot-toast";

interface Props {
  countryCode: string;
}

export default function SignUpForm({ countryCode }: Props) {
  const { tran } = useTranslations();
  const { authConfig, redirect } = useAuthHandler();
  const searchParams = useSearchParams();
  const refererUserName = searchParams.get("referer");
  const { login } = useAuthStore((state: AuthStore) => state);
  const router = useRouter();
  const filteredCountry = useMemo(
    () =>
      countryCodes.find(
        (country) => country.code.toLowerCase() === countryCode.toLowerCase(),
      ),
    [countryCode],
  );

  const [signUpForm, setSignUpForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    referer: refererUserName || "",
    password: "",
    country_code: filteredCountry?.name || "US",
    phone: "",
    dial_code: filteredCountry?.dial_code || "+1",
    password_confirmation: "",
    captcha_token: "",
    agree: 0,
  });

  // need frontend validation
  const [frontendValidation, setFrontendValidation] = useState({
    first_name: false,
    last_name: false,
    email: false,
    password: false,
    password_confirmation: false,
    country_code: false,
    dial_code: false,
    agree: false,
  });

  const isPasswordMatch = useMemo(
    () => signUpForm.password === signUpForm.password_confirmation,
    [signUpForm.password, signUpForm.password_confirmation],
  );

  const isFormValid = useMemo(
    () =>
      signUpForm.first_name &&
      signUpForm.last_name &&
      signUpForm.email &&
      signUpForm.password &&
      signUpForm.password_confirmation &&
      signUpForm.country_code &&
      signUpForm.dial_code &&
      signUpForm.agree,
    [
      signUpForm.first_name,
      signUpForm.last_name,
      signUpForm.email,
      signUpForm.password,
      signUpForm.password_confirmation,
      signUpForm.country_code,
      signUpForm.dial_code,
      signUpForm.agree,
    ],
  );

  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    isPublic: true,
    url: "auth/sign-up",
  });

  const handleChange = (token: string | null) => {
    setSignUpForm({ ...signUpForm, captcha_token: token || "" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isFormValid) {
      setFrontendValidation({
        first_name: !signUpForm.first_name,
        last_name: !signUpForm.last_name,
        email: !signUpForm.email,
        password: !signUpForm.password || !isPasswordMatch,
        password_confirmation:
          !signUpForm.password_confirmation || !isPasswordMatch,
        country_code: !signUpForm.country_code,
        dial_code: !signUpForm.dial_code,
        agree: !signUpForm.agree,
      });
      return;
    }
    if (authConfig.recaptcha.is_enabled) {
      if (!signUpForm.captcha_token) {
        toast.error(tran("Please verify you are not a robot"));
        return;
      }
    }
    mutate(
      {
        ...signUpForm,
        phone: `${signUpForm.dial_code}${signUpForm.phone}`,
      },
      {
        onSuccess: (response: any) => {
          const data = response?.data?.data;

          if (!data?.token || !data?.user) {
            toast.error(tran("Something went wrong, please try again later"));
            return;
          }

          const user = data?.user as UserType;

          login(data.token, user);
          Cookies.set("sign_in_count", "1");

          router.push(redirect(user));
        },
      },
    );
  };
  return (
    <React.Fragment>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <InputGroup
            label={"First Name"}
            name="first_name"
            value={signUpForm.first_name}
            onChange={(e) =>
              setSignUpForm((prev) => ({
                ...prev,
                first_name: e,
              }))
            }
            errors={errors}
            placeholder={tran("Enter Your First Name")}
            isInvalid={frontendValidation.first_name}
          />
          <InputGroup
            label={"Last Name"}
            name="last_name"
            value={signUpForm.last_name}
            onChange={(e) =>
              setSignUpForm((prev) => ({
                ...prev,
                last_name: e,
              }))
            }
            errors={errors}
            isInvalid={frontendValidation.last_name}
            placeholder={tran("Enter Your Last Name")}
          />
        </div>
        <InputGroup
          label={"Email"}
          name="email"
          value={signUpForm.email}
          onChange={(e) =>
            setSignUpForm((prev) => ({
              ...prev,
              email: e,
            }))
          }
          errors={errors}
          isInvalid={frontendValidation.email}
          placeholder={tran("Enter Your Email")}
        />
        <InputPhone
          phone={signUpForm.phone}
          dialCode={signUpForm.dial_code}
          setPhoneNumber={(number) =>
            setSignUpForm((prev) => ({ ...prev, phone: number }))
          }
          setCountryCode={(code) =>
            setSignUpForm((prev) => ({
              ...prev,
              country_code: code,
            }))
          }
          setDialCode={(code) =>
            setSignUpForm((prev) => ({ ...prev, dial_code: code }))
          }
          errors={errors}
          name="country_code"
        />
        <PasswordInput
          label={tran("Password")}
          name="password"
          form={signUpForm}
          setForm={setSignUpForm}
          errors={errors}
          isInvalid={frontendValidation.password}
        />
        <PasswordInput
          label={tran("Confirm Password")}
          name="password_confirmation"
          form={signUpForm}
          setForm={setSignUpForm}
          errors={errors}
          isInvalid={frontendValidation.password_confirmation}
        />

        {/* Agree Terms */}
        <label
          htmlFor="agree_terms"
          className={cn(
            "flex cursor-pointer items-center justify-start gap-2",
            frontendValidation.agree && "text-red-500",
          )}
        >
          <input
            type="checkbox"
            className="peer hidden"
            id="agree_terms"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setSignUpForm({
                ...signUpForm,
                agree: e.target.checked ? 1 : 0,
              });
            }}
          />
          <span className="border-secondary peer-checked:text-secondary flex size-4 items-center justify-center rounded-sm border text-sm text-transparent">
            <CheckIcon size={20} />
          </span>
          <span>
            {tran("I agree to the")}{" "}
            <Link href="/terms-conditions" className="text-secondary underline">
              {tran("Terms & Conditions")}
            </Link>
          </span>
        </label>
        {/* Setup Recaptcha */}
        <Recaptcha handleChange={handleChange} />
        <div className="pt-3">
          <Button type="submit" loading={isLoading} className="w-full">
            {tran("Sign Up")}
          </Button>
        </div>
      </form>
      <p className="text-center max-sm:text-sm">
        {tran("Already have an account?")}{" "}
        <Link href="/sign-in" className="text-secondary hover:underline">
          {tran("Sign In")}
        </Link>
      </p>
    </React.Fragment>
  );
}
