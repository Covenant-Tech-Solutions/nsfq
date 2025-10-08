import React, { useMemo } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { InputValidationMessage } from "@/components/ui/InputValidationMessage";

interface InputGroupProps {
  label: string;
  name: string;
  value: any;
  onChange: React.Dispatch<React.SetStateAction<any>>;
  placeholder?: string;
  required?: boolean;
  errors?: any;
  type?: string;
  isInvalid?: boolean;
}
export const InputGroup: React.FC<InputGroupProps> = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required,
  errors,
  type = "text",
  isInvalid,
}) => {
  const validationErrorMessage = useMemo(() => {
    if (typeof errors === "object") {
      return errors?.[name];
    }

    if (typeof errors === "string") {
      return errors;
    }

    return "";
  }, [errors, name]);

  return (
    <div className="flex w-full flex-1 flex-col items-start justify-start gap-2">
      <Label title={label} name={name} required={required} />
      <div className="w-full">
        <Input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          validationError={validationErrorMessage}
          isInvalid={isInvalid}
        />
        <InputValidationMessage message={validationErrorMessage} />
      </div>
    </div>
  );
};
