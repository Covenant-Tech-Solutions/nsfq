/** @format */

"use client";

import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import OtpInput from "../ui/OtpInput";
import OtpTimer from "../ui/OTPTimer";

const TwoFAVerifyForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otpBreakTime, setOtpBreakTime] = useState(0);

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

  const { login } = useAuthStore((state: any) => state);
  const isEmail = useMemo(() => !!searchParams.get("email"), [searchParams]);
  const userEmail = searchParams.get("email");
  const userPhone = searchParams.get("phone");

  const { sendOTP, setOtpBreakTimer } = useAuthHandler();

  const { mutate: verifyOTP, isLoading: verifyLoading } = useQueryMutation({
    isPublic: true,
    url: "auth/sign-in-with-2fa",
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
        onSuccess: async (response: any) => {
          toast.success("Successfully logged in");
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));

          setOtpBreakTime(0);

          if (!response?.data?.data?.token || !response?.data?.data?.user) {
            toast.error(tran("Something went wrong, please try again later"));
            return;
          }

          login(response?.data?.data?.token, response?.data?.data?.user);

          router.push("/");
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
      <form
        className="otp-form relative flex flex-1 flex-col items-center justify-center gap-4 pt-8"
        onSubmit={handleVerify}
        tabIndex={0} // Make the form focusable
      >
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
            loading={verifyLoading}
            className={` ${otpInputHandler.isComplete ? "" : ""}`}
          >
            {tran("Verify")}
          </Button>
        </div>
      </form>
    </Suspense>
  );
};

export default TwoFAVerifyForm;
