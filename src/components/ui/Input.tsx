/** @format */

import React from "react";
import clsx from "clsx";
import { TextArea } from "@/components/ui/TextArea";

export interface InputProps {
  name: string;
  value: string;
  type?: string;
  className?: string;
  placeholder?: string;
  required?: boolean;
  validationError?: string;
  onChange: (value: string) => void;
  isInvalid?: boolean;
}

export const Input: React.FC<InputProps> = ({
  type = "text",
  name,
  value,
  validationError,
  onChange,
  className,
  placeholder,
  required,
  isInvalid,
  ...rest
}) => {
  const handleTextChange = (value: string) => {
    if (type === "number") {
      const numericValue = value.replace(/[^0-9]/g, "");
      onChange(numericValue);
    } else {
      onChange(value);
    }
  };

  return type === "textarea" ? (
    <TextArea
      name={name}
      value={value}
      onChange={onChange}
      className={className}
      placeholder={placeholder}
      required={required}
      validationError={validationError}
      isInvalid={isInvalid}
      {...rest}
    />
  ) : (
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={(e) => handleTextChange(e.target.value)}
      className={clsx(
        "border-primary/20 w-full rounded-xl border bg-white px-5 py-2 text-sm transition-all duration-200 outline-none sm:py-3",
        validationError && "border-red-500 focus:border-red-500",
        isInvalid && "border-red-500 focus:border-red-500",
        className,
      )}
      placeholder={placeholder}
      required={required}
      aria-invalid={!!validationError}
      aria-describedby={validationError ? `${name}-error` : undefined}
      {...rest}
    />
  );
};
