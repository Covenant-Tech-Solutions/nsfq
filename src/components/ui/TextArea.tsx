/** @format */

import React from "react";
import clsx from "clsx";

export interface TextareaProps {
  name: string;
  value: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  onChange: (value: string) => void;
  validationError?: string;
  isInvalid?: boolean;
}

export const TextArea: React.FC<TextareaProps> = ({
  name,
  value,
  onChange,
  className,
  placeholder,
  required,
  validationError,
  isInvalid,
  ...rest
}) => {
  return (
    <textarea
      id={name}
      name={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={clsx(
        "border-primary/20 min-h-40 w-full rounded-md border bg-white px-3 py-2 outline-none max-sm:text-sm sm:px-4 sm:py-3",
        validationError && "border-red-500 focus:border-red-500",
        isInvalid && "border-red-500 focus:border-red-500",
        className,
      )}
      aria-invalid={!!validationError}
      aria-describedby={validationError ? `${name}-error` : undefined}
      {...rest}
    ></textarea>
  );
};
