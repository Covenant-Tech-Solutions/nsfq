/** @format */

"use client";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
/** @format */

import React, { useEffect, useRef } from "react";
type OtpFormProps = {
  setIsComplete: (value: boolean) => void;
  isInvalid: boolean;
  setIsInvalid: (value: boolean) => void;
  setOtp: (value: string) => void;
  otp: string;
  isReset: boolean;
};
const OtpInput = ({
  setIsComplete,
  isInvalid,
  setIsInvalid,
  setOtp,
  otp,
  isReset,
}: OtpFormProps) => {
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  // set value

  useEffect(() => {
    if (otp) {
      inputRefs.current.forEach((input, index) => {
        if (input) {
          input.value = otp[index] || "";
        }
      });
    }
  }, [otp]);

  useEffect(() => {
    if (isReset) {
      inputRefs.current[0]?.focus();
      inputRefs.current.forEach((input) => {
        if (input) {
          input.value = "";
        }
      });
    }
  }, [isReset]);

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Prevent form submission when Enter is pressed
    if (e.key === "Enter") {
      e.preventDefault();
      // Optionally, move to the next input or trigger verification if all fields are filled
      if (index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      } else {
        // If on the last input and all fields are filled, you could trigger verification
        if (checkCompletion()) {
          const verifyButton = document.querySelector('button[type="submit"]');
          if (verifyButton) {
            (verifyButton as HTMLButtonElement).click();
          }
        }
      }
      return;
    }

    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      e.key !== "ArrowLeft" &&
      e.key !== "ArrowRight" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    // Handle backspace to go to previous input
    if (
      (e.key === "Delete" || e.key === "Backspace") &&
      index > 0 &&
      !inputRefs.current[index]?.value
    ) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle left/right arrow keys for navigation
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const value = e.target.value;

    // Allow only numbers
    if (!/^[0-9]?$/.test(value)) {
      e.preventDefault();
      return;
    }

    // Reset validation states
    setIsInvalid(false);

    // Move to next input if a digit was entered
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all inputs are filled
    checkCompletion();
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  // Shared paste handler function to be used by both input paste events and global key events
  const processPastedContent = (content: string) => {
    // Filter only digits from pasted content
    const digits = content
      .replace(/\D/g, "")
      .slice(0, inputRefs.current.length);

    // Fill inputs with pasted digits
    digits.split("").forEach((digit, index) => {
      if (index < inputRefs.current.length) {
        const inputField = inputRefs.current[index];

        if (inputField) {
          inputField.value = digit;
        }
      }
    });
    // Focus on the next empty field or the last field
    const nextEmptyIndex =
      digits.length < inputRefs.current.length
        ? digits.length
        : inputRefs.current.length - 1;
    inputRefs.current[nextEmptyIndex]?.focus();
    setOtp(digits);

    // Check if form is complete after paste
    checkCompletion();
  };

  // Handle paste on individual input elements
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    processPastedContent(pastedData);
  };

  // Handle global keyboard events, particularly for Ctrl+V
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+V or Cmd+V (on Mac)
      if ((e.ctrlKey || e.metaKey) && e.key === "v") {
        // Only handle if the OTP form is in focus (any of its inputs)
        const activeInput = document.activeElement;
        const isOtpInput = inputRefs.current.some((ref) => ref === activeInput);

        if (isOtpInput) {
          // Read from clipboard API directly
          navigator.clipboard
            .readText()
            .then((text) => {
              // your function here
              processPastedContent(text);
            })
            .catch((err) => {
              console.error("Failed to read clipboard:", err);
            });
        }
      }
    };

    // Add global event listener
    document.addEventListener("keydown", handleGlobalKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleGlobalKeyDown);
    };
  });

  useEffect(() => {
    initialFucus();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkCompletion = () => {
    const isFilled = inputRefs.current.every((input) => input?.value);
    setIsComplete(isFilled);
    return isFilled;
  };

  const initialFucus = () => {
    inputRefs.current.forEach((input) => {
      if (input) input.value = "";
    });

    // Focus on first input
    inputRefs.current[0]?.focus();
    setIsInvalid(false);
    setIsComplete(false);
  };

  const handleOtpInput = (e: React.FormEvent<HTMLInputElement>) => {
    const value = e.currentTarget.value;

    // Allow only numbers
    if (!/^[0-9]?$/.test(value)) {
      e.preventDefault();
      return;
    }
    setOtp(inputRefs.current.map((input) => input?.value).join(""));
  };

  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);

  const otpLength =
    appInfo?.application_info?.otp?.digit_range[1].toString().length;

  return (
    <div className="flex justify-center gap-3">
      {Array.from({ length: otpLength }).map((_, index) => (
        <div
          key={index}
          className={`rounded-xl sm:size-[54px] ${
            isInvalid
              ? "border border-red-500 bg-red-50"
              : "border-dark5 border bg-white"
          } focus-within:border-b300 p-3.5 transition-colors`}
        >
          <input
            type="text"
            className="otp-form-item w-full bg-transparent text-center font-bold outline-none"
            maxLength={1}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onChange={(e) => handleInput(e, index)}
            onFocus={handleFocus}
            onPaste={(e) => handlePaste(e)}
            onInput={(e) => handleOtpInput(e)}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
          />
        </div>
      ))}
    </div>
  );
};

export default OtpInput;
