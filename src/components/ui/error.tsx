/** @format */

"use client"; // Error boundaries must be Client Components

import { useTranslations } from "@/providers/TranslationProviders";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: Readonly<{ error?: Error; reset?: () => void }>) {
  const { tran } = useTranslations();
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">
          {tran("Something went wrong")}
        </h2>
        <p className="mb-6 text-sm text-gray-600">{error?.message}</p>
        <button
          onClick={reset}
          className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
        >
          {tran("Try Again")}
        </button>
      </div>
    </div>
  );
}
