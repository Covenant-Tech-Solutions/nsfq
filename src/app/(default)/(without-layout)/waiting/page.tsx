/** @format */

"use client";
import { Button } from "@/components/ui/Button";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AuthStore } from "@/stores/auth";
import { AppInfoType } from "@/types";
import { UserType } from "@/types/user";
import {
  ClockCounterClockwiseIcon,
  SignOutIcon,
} from "@phosphor-icons/react/dist/ssr";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Waiting() {
  const {
    logout,
    appInfo,
    user,
  }: { logout: () => void; appInfo: AppInfoType; user: UserType } =
    useAuthStore((state: AuthStore) => state);
  const { redirect } = useAuthHandler();
  const { tran } = useTranslations();
  const { push } = useRouter();
  useEffect(() => {
    if (user?.kyc?.status === "approved") {
      push(redirect(user));
    }
  }, [user, push, redirect]);
  return (
    <div className="bg-slate-40 flex min-h-screen items-center justify-center">
      <div className="mx-auto max-w-md rounded-xl bg-white p-8 text-center shadow-2xl">
        <div className="relative mx-auto mb-6 h-32 w-32">
          <div className="border-t-primary border-r-primary/20 border-b-primary/20 border-l-primary/20 absolute inset-0 animate-spin rounded-full border-4"></div>

          <div className="text-primary absolute inset-0 flex items-center justify-center opacity-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <h1 className="mb-2 text-2xl font-bold text-gray-800">
          {tran("Awaiting Approval")}
        </h1>
        <p className="mb-6 text-gray-600">
          {tran("Your account is under review. Please wait for approval.")}
        </p>

        <div className="space-y-4">
          <div className="bg-slate-30 rounded-lg p-4">
            <h3 className="mb-2 font-medium text-slate-800"></h3>
            <ul className="space-y-2 text-left text-sm text-gray-600">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary mr-2 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{tran("We are reviewing your account.")}</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary mr-2 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {tran(
                    "You will receive an email notification once approved.",
                  )}
                </span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-primary mr-2 h-5 w-5 flex-shrink-0"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>
                  {tran("Access to participate in Contests will be granted soon.")}
                </span>
              </li>
            </ul>
          </div>

          <div className="text-sm text-gray-500">
            <p>
              {tran("Yout Accounts usually get approved in ")}
              <span className="font-medium text-slate-600">
                {" "}
                {appInfo?.application_info?.KYC_approval_time ||
                  "some few minutes.."}
              </span>
            </p>
            <p className="mt-1">
              {tran("For any inquiries, please contact us at ")}
              <a
                href="mailto:brainbank@nexmatics.africa"
                className="text-slate-600 underline hover:text-slate-800"
              >
                {appInfo?.application_info?.company_info.email ||
                  "brainbank@nexmatics.africa"}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <Button href="/" variant="primary" className="w-full">
            <ClockCounterClockwiseIcon />
            {tran("Back to Home")}
          </Button>
          <Button
            variant="secondary"
            onClick={() => logout()}
            className="w-full"
          >
            <SignOutIcon />
            {tran("Logout")}
          </Button>
        </div>
      </div>
    </div>
  );
}
