/** @format */
"use client";
import logo from "@/../public/logo.svg";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import Link from "next/link";
import ImageLoader from "./ImageLoader";

export default function Logo({ link = "/" }: { link?: string }) {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);

  return (
    <Link
      href={link}
      className="flex items-center justify-start gap-0.5 sm:gap-2"
    >
      <ImageLoader
        src={appInfo?.application_info?.logo_favicon?.logo_dark || logo}
        alt={appInfo?.application_info?.company_info?.name}
        className="max-sm:size-7"
        width={40}
        height={40}
      />
      <span className="heading-3">
        {appInfo?.application_info?.company_info?.name}
      </span>
    </Link>
  );
}
