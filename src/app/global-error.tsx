/** @format */

"use client";

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  return (
    <html>
      <body className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-800">
        <div className="max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-red-600">
            Something went wrong
          </h2>
          <p className="mb-4 text-sm text-gray-500">{error.message}</p>
          <button
            onClick={reset}
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
