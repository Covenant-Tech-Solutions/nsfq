/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import { secondToTime } from "@/utils/helper";
import { SpinnerIcon } from "@phosphor-icons/react/dist/ssr";
import { useCallback, useEffect, useState } from "react";

type OtpTimerProps = {
  onClick: () => void;
  loading?: boolean;
  time?: number;
  otpTimerKey: string;
};

const OtpTimer = ({
  onClick,
  loading = false,
  time = 0,
  otpTimerKey,
}: OtpTimerProps) => {
  const { tran } = useTranslations();
  const [timer, setTimer] = useState<number>(0);

  useEffect(() => {
    const now = Date.now();
    const storedExpiry = localStorage.getItem(otpTimerKey);
    if (storedExpiry) {
      const expiryTime = parseInt(storedExpiry);
      const remaining = Math.floor((expiryTime - now) / 1000);
      if (remaining > 0) {
        setTimer(remaining);
      } else {
        localStorage.removeItem(otpTimerKey);
        setTimer(0);
      }
    }
  }, [otpTimerKey, time]);

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          localStorage.removeItem(otpTimerKey);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, otpTimerKey]);

  const handleResend = useCallback(() => {
    if (loading) return;
    onClick();
  }, [onClick, loading]);

  return (
    <div>
      {timer > 0 ? (
        <p className="pt-4 text-center">
          {tran("Resend OTP in")} {secondToTime(timer)} {tran("seconds")}
        </p>
      ) : (
        <div className="pt-4 text-center">
          {tran("Didn't receive email?")}
          <button
            type="button"
            className="text-secondary ml-1 font-medium underline"
            onClick={handleResend}
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <SpinnerIcon className="animate-spin" />
                <span className="ml-2">{tran("Loading...")}</span>
              </div>
            ) : (
              tran("Resend")
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default OtpTimer;
