/** @format */

"use client";
import { useTranslations } from "@/providers/TranslationProviders";
import React from "react";
import { Button } from "./Button";
import ImageLoader from "./ImageLoader";

interface DataNotFoundProps {
  title?: string;
  message?: string;
  paddingTop?: string;
  imageSize?: string;
  imageSrc?: string;
  redirect?: string;
}

const imageSizes: Record<string, string> = {
  sm: "w-32 h-auto mb-4",
  md: "w-48 h-auto mb-4",
  lg: "w-64 h-auto mb-6",
  xl: "w-80 h-auto mb-8",
};

const DataNotFound: React.FC<DataNotFoundProps> = ({
  title = "Data Not Found",
  message = "The data you are looking for does not exist. Please refresh the page.",
  paddingTop = "py-10",
  imageSize = "lg",
  imageSrc = "/quiz-not-found.webp",
  redirect = "",
}) => {
  const { tran } = useTranslations();

  const imageClass = imageSizes[imageSize];

  return (
    <div
      className={`flex flex-col items-center justify-center bg-white pt-20 ${paddingTop} px-4`}
    >
      <ImageLoader
        src={imageSrc}
        alt="Page Not Found"
        className={imageClass}
        width={50}
        height={50}
      />
      <h1 className="mb-2 text-2xl font-semibold text-gray-800">
        {tran(title)}
      </h1>
      <p className="text-center text-gray-600">{tran(message)}</p>
      {redirect && (
        <Button
          href={redirect || "/"}
          type="button"
          variant="primary"
          size="md"
          className="mt-4"
        >
          {tran("Go Back")}
        </Button>
      )}
    </div>
  );
};

export default DataNotFound;
