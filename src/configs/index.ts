/** @format */

export const SERVER_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://quize.safiul.pxlaxis.com";
export const API_BASE_URL =
  SERVER_URL + (process.env.NEXT_PUBLIC_API_VERSION_PATH || "/api/v1");

export const TOKEN_NAME = process.env.NEXT_PUBLIC_TOKEN_NAME || "token";

export const APP_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://quiz-roan-zeta.vercel.app";

export const ONBOARDING_POSITION = "ONBOARDING_POSITION";

export const MAINTENANCE = "MAINTENANCE";

export const ONBOARDING_STEPS = {
  verification: {
    value: "verification",
    url: "/verify-otp",
  },
  kyc: {
    value: "kyc",
    url: "/kyc",
  },
  waiting: {
    value: "waiting",
    url: "/waiting",
  },
  completed: {
    value: "completed",
    url: "/dashboard/profile",
  },
};

/**
 * check if the user is trying to access protected paths without a valid token also check if the user is verifying their email or phone
 * if the user is not authenticated, redirect to the sign-in page
 * if the user is authenticated and trying to access the verification or kyc page, redirect
 */
export const PROTECTED_PATHS = [
  "/dashboard",
  "/payment",
  "/result/quiz",
  "/result/quiz/preview",
  "/result/contest",
  "/result/contest/preview",
  "/checkout",
  "/play/contest",
  "/play/quiz",
];
