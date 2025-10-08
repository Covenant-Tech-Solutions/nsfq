/** @format */

"use client";

import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { UserType } from "@/types/user";
import { getToken } from "@/utils";
import Cookies from "js-cookie";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";
import Loader from "../ui/Loader";
import OtpInput from "../ui/OtpInput";
import OtpTimer from "../ui/OTPTimer";

const OtpForm: React.FC = () => {
  const router = useRouter();
  const token = getToken();
  const searchParams = useSearchParams();
  const otp_expire_key = searchParams.get("email") || searchParams.get("phone");
  const [otpBreakTime, setOtpBreakTime] = useState(0);
  const {
    user,
    getUser,
  }: { user: UserType; getUser: () => Promise<UserType> } = useAuthStore(
    (state: any) => state,
  );
  const {
    sendOTP,
    otpSendLoading,
    verifyOTP,
    verifyLoading,
    redirect,
    setOtpBreakTimer,
  } = useAuthHandler();
  const [otpInputHandler, setOtpInputHandler] = useState<{
    isComplete: boolean;
    isInvalid: boolean;
    otp: string;
    isReset: boolean;
  }>({
    isComplete: false,
    isInvalid: false,
    otp: "",
    isReset: false,
  });
  const signInCount = Cookies.get("sign_in_count");

  const isEmail = useMemo(() => !!searchParams.get("email"), [searchParams]);

  useEffect(() => {
    if (token && !user?.email_verified_at && isEmail) {
      router.replace(redirect(user));
      const timerExists = localStorage.getItem(user?.email);
      if (user?.email && !timerExists) {
        handleResend();
      }
    }

    if (token && !user?.phone_verified_at && !isEmail && signInCount === "2") {
      router.replace(redirect(user));
      const timerExists = localStorage.getItem(user?.phone);
      if (user?.phone && !timerExists) {
        handleResend();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleVerify = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(otpInputHandler);
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
        otp: otpInputHandler.otp,
        ...(isEmail
          ? { email: otp_expire_key }
          : { phone: `+${otp_expire_key?.trim()}` }),
      },
      {
        onSuccess: async (response: any) => {
          toast.success(response?.data?.message);
          const updatedUser: UserType = await getUser();
          setOtpInputHandler((prev) => ({
            ...prev,
            isReset: true,
            isComplete: false,
            isInvalid: false,
          }));

          if (isEmail && updatedUser?.email_verified_at) {
            localStorage.removeItem(updatedUser?.email);
          }

          if (!isEmail && updatedUser?.phone_verified_at) {
            localStorage.removeItem(updatedUser?.phone);
          }

          setOtpBreakTime(0);

          if (!updatedUser?.phone_verified_at && signInCount === "2") {
            handleResend();
          }

          router.replace(redirect(updatedUser));
        },
        onError: (error: any) => {
          toast.error(error?.response?.data?.message);
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
          ? { email: user?.email }
          : { phone: formatePhoneNumber(user?.phone) }),
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
          setOtpBreakTimer(isEmail ? user?.email : user?.phone);
          setOtpBreakTime(
            Number(localStorage.getItem(isEmail ? user?.email : user?.phone)) ||
              0,
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
          loading={otpSendLoading}
          time={otpBreakTime}
          otpTimerKey={(isEmail ? user?.email : user?.phone)?.toString() ?? ""}
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

export default OtpForm;
