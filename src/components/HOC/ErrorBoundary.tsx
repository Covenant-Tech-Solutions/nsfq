/** @format */
"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProviders";

interface Props {
  children: React.ReactNode;
  fallback?: React.ReactElement<{ error: Error | null; reset: () => void }>;
}

const ErrorBoundary: React.FC<Props> = ({ children, fallback }) => {
  const [hasError, setError] = useState(false);
  const [error, setErrorState] = useState<Error | null>(null);
  const { tran } = useTranslations();

  const resetError = () => {
    setError(false);
    setErrorState(null);
  };

  useEffect(() => {
    if (hasError) {
      console.error("Uncaught error:", error);
    }
  }, [hasError, error]);

  if (hasError) {
    if (fallback && React.isValidElement(fallback)) {
      return React.cloneElement(fallback, {
        error: error,
        reset: resetError,
      });
    }
    return <h2>{tran("Something went wrong")}</h2>;
  }

  return children;
};

export default ErrorBoundary;
