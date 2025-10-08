/** @format */

"use client";

import AuthPageTitle from "@/app/(default)/(auth-pages)/AuthPageTitle";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useTranslations } from "@/providers/TranslationProviders";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import OtpInput from "../ui/OtpInput";
import OtpTimer from "../ui/OTPTimer";
import { PasswordInput } from "../ui/PasswordInput";

const ChangePassOTPForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otpBreakTime, setOtpBreakTime] = useState(0);

  const otpVerifiedParam = searchParams.get("otp-verified");
  const [passwordResetForm, setPasswordResetForm] = useState({
    type: "email",
    email: "",
    password: "",
    password_confirmation: "",
  });
  const [otpInputHandler, setOtpInputHandler] = useState<{
    otp: string;
    isReset: boolean;
    isComplete: boolean;
    isInvalid: boolean;
  }>({
    otp: "",
    isReset: false,
    isComplete: false,
    isInvalid: false,
  });

  const isEmail = useMemo(() => !!searchParams.get("email"), [searchParams]);
  const userEmail = searchParams.get("email");
  const userPhone = searchParams.get("phone");

  const { sendOTP, setOtpBreakTimer } = useAuthHandler();

  const {
    mutate: verifyOTP,
    isLoading: verifyLoading,
    backendErrors: passResetErrors,
  } = useQueryMutation({
    isPublic: true,
    url: "auth/forgot-password",
  });

  useEffect(() => {
    if (isEmail) {
      const timerExists = localStorage.getItem(userEmail || "");
      if (userEmail && !timerExists) {
        handleResend();
      }
    }

    if (userPhone && !isEmail) {
      const timerExists = localStorage.getItem(userPhone || "");
      if (userPhone && !timerExists) {
        handleResend();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail, userPhone, isEmail, router]);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!otpInputHandler.otp.length) {
      setOtpInputHandler((prev) => ({
        ...prev,
        isInvalid: true,
        isComplete: false,
        isReset: false,
      }));
      return;
    }

    verifyOTP(
      {
        type: isEmail ? "email" : "phone",
        ...(isEmail
          ? { email: userEmail }
          : { phone: formatePhoneNumber(userPhone) }),
        otp: otpInputHandler.otp,
      },
      {
        onSuccess: async () => {
          toast.success("Successfully logged in");
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));

          setOtpBreakTime(0);

          router.push(
            `/change-pass-otp?otp-verified=true&email=${userEmail}&phone=${userPhone}`,
          );
        },
        onError: () => {
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: true,
          }));
        },
      },
    );
  };

  const handleSubmitPassword = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    verifyOTP(
      {
        type: isEmail ? "email" : "phone",
        ...(isEmail
          ? { email: userEmail }
          : { phone: formatePhoneNumber(userPhone) }),

        password: passwordResetForm.password,
        password_confirmation: passwordResetForm.password_confirmation,
      },
      {
        onSuccess: async () => {
          toast.success("Successfully logged in");
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));

          setOtpBreakTime(0);

          router.push("/sign-in");
        },
        onError: () => {
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: true,
          }));
        },
      },
    );
  };

  const formatePhoneNumber = (phone: string | undefined | null) => {
    if (!phone) return "";
    if (phone.startsWith("+")) return phone;
    return `+${phone?.trim()}`;
  };

  const handleResend = () => {
    sendOTP(
      {
        type: isEmail ? "email" : "phone",
        ...(isEmail
          ? { email: userEmail }
          : { phone: formatePhoneNumber(userPhone) }),
      },
      {
        onSuccess: (response: any) => {
          toast.success(response?.data?.message);
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));
          setOtpBreakTimer(isEmail ? userEmail || "" : userPhone || "");
          setOtpBreakTime(
            Number(
              localStorage.getItem(isEmail ? userEmail || "" : userPhone || ""),
            ) || 0,
          );
        },
      },
    );
  };

  const { tran } = useTranslations();

  return (
    <Suspense fallback={<Loader />}>
      {otpVerifiedParam ? (
        <form onSubmit={handleSubmitPassword} className="flex flex-col gap-3">
          <h4 className="heading-4 pb-1 text-center">
            {tran("Change Password")}
          </h4>
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
            <Button
              type="submit"
              loading={verifyLoading}
              disabled={verifyLoading}
              className="w-full"
            >
              {tran("Save")}
            </Button>
          </div>
        </form>
      ) : (
        <form
          className="otp-form relative flex flex-1 flex-col items-center justify-center gap-4 pt-8"
          onSubmit={handleVerify}
          tabIndex={0} // Make the form focusable
        >
          <AuthPageTitle title="Verify OTP" />

          <OtpInput
            setIsComplete={(isValue) =>
              setOtpInputHandler((prev) => ({
                ...prev,
                isComplete: isValue,
              }))
            }
            setIsInvalid={(isValue) =>
              setOtpInputHandler((prev) => ({
                ...prev,
                isInvalid: isValue,
              }))
            }
            setOtp={(value) =>
              setOtpInputHandler((prev) => ({
                ...prev,
                otp: value,
              }))
            }
            otp={otpInputHandler.otp}
            isInvalid={otpInputHandler.isInvalid}
            isReset={otpInputHandler.isReset}
          />

          <OtpTimer
            onClick={handleResend}
            loading={false}
            time={otpBreakTime}
            otpTimerKey={(isEmail ? userEmail : "")?.toString() ?? ""}
          />

          {otpInputHandler.isInvalid && (
            <p className="text-center text-sm text-red-500" role="alert">
              {tran("Please enter a valid OTP code")}
            </p>
          )}

          <div className="flex">
            <Button
              type="submit"
              disabled={verifyLoading}
              loading={verifyLoading}
              className={` ${otpInputHandler.isComplete ? "" : ""}`}
            >
              {tran("Verify")}
            </Button>
          </div>
        </form>
      )}
    </Suspense>
  );
};

export default ChangePassOTPForm;
