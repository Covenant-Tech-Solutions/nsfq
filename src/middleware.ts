/** @format */

import { NextRequest, NextResponse } from "next/server";
import {
  MAINTENANCE,
  ONBOARDING_POSITION,
  ONBOARDING_STEPS,
  PROTECTED_PATHS,
  TOKEN_NAME,
} from "./configs";

export function middleware(request: NextRequest) {
  const maintenance = request?.cookies?.get(MAINTENANCE)?.value;
  if (
    request.nextUrl.pathname.startsWith("/_next/") ||
    request.nextUrl.pathname.startsWith("/public/")
  ) {
    return NextResponse.next();
  }

  if (
    maintenance === "true" &&
    !request.nextUrl.pathname.startsWith("/maintenance")
  ) {
    return NextResponse.redirect(new URL("/maintenance", request.url));
  }

  const token = request?.cookies?.get(TOKEN_NAME)?.value;

  const onboardingPosition = request?.cookies?.get(ONBOARDING_POSITION)?.value;

  /**
   * check if the user token is present in the cookies
   * if not, redirect to the sign-in page
   */
  const authProtectedPaths = ["/verify-otp", "/kyc", "/waiting"];

  /**
   * check if the user is trying to access guest paths
   */
  const guestPaths = ["/sign-in", "/sign-up"];

  const isProtectedPaths = PROTECTED_PATHS.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  const isAuthProtectedPaths = authProtectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  const isGuestPaths = guestPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path),
  );

  if (!token && (isProtectedPaths || isAuthProtectedPaths)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    token &&
    onboardingPosition &&
    onboardingPosition !== ONBOARDING_STEPS.completed.value &&
    isProtectedPaths
  ) {
    type OnboardingStepKey = keyof typeof ONBOARDING_STEPS;
    const stepKey = Object.keys(ONBOARDING_STEPS).find(
      (key) =>
        ONBOARDING_STEPS[key as OnboardingStepKey].value === onboardingPosition,
    ) as OnboardingStepKey | undefined;

    if (stepKey) {
      return NextResponse.redirect(
        new URL(ONBOARDING_STEPS[stepKey].url, request.url),
      );
    }
  }

  if (token && isGuestPaths) {
    return NextResponse.redirect(new URL("/dashboard/profile", request.url));
  }
}
