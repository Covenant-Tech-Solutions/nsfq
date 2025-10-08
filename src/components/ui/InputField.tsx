import React from "react";
import { FieldErrors, UseFormRegister } from "react-hook-form";

type FormValues = {
  name: string;
};

type FieldName = keyof FormValues;

type InputFiledProps = {
  title?: string;
  dynamicName: FieldName;
  isRequired?: boolean;
  type?: string;
  placeholder?: string;
  register: UseFormRegister<FormValues>;
  errors: FieldErrors<FormValues>;
  errorMessage: string;
};

export default function InputField({
  title,
  isRequired = false,
  type = "text",
  placeholder = "",
  register,
  errors,
  dynamicName,
  errorMessage,
}: InputFiledProps) {
  return (
    <label className="flex flex-1 flex-col items-start justify-start gap-2 sm:gap-3">
      {title && (
        <p className="max-sm:text-sm">
          {title}
          {isRequired && "*"}
        </p>
      )}
      <div className="border-dark5 w-full rounded-full border px-5 py-2 sm:py-3">
        <input
          type={type}
          className="text-light4/40 w-full bg-transparent text-sm outline-none"
          placeholder={placeholder}
          {...register(dynamicName, {
            required: `${title} is required`,
            minLength: {
              value: 6,
              message: errorMessage,
            },
          })}
        />
      </div>
      {errors[dynamicName] && (
        <p className="text-red-500">
          {errors[dynamicName]?.message?.toString()}
        </p>
      )}
    </label>
  );
}
