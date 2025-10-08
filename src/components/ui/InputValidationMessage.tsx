import React from "react";

export const InputValidationMessage = ({
  message,
  customStyle,
}: {
  message?: string;
  customStyle?: string;
}) => {
  return message ? (
    <div className={`mt-1 text-sm text-red-500 ${customStyle}`}>{message}</div>
  ) : null;
};
