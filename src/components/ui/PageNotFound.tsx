/** @format */

"use client";
import React from "react";
import ImageLoader from "./ImageLoader";
import { useTranslations } from "@/providers/TranslationProviders";

const PageNotFound = ({
  title = "Page Not Found",
  message = "The page you are looking for does not exist.",
}) => {
  const { tran } = useTranslations();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4">
      <ImageLoader
        src="/images/404.png"
        alt="Page Not Found"
        className="mb-6 h-auto w-64"
        width={50}
        height={50}
      />
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">
        {tran(title)}
      </h1>
      <p className="text-center text-gray-600">{tran(message)}</p>
    </div>
  );
};

export default PageNotFound;
