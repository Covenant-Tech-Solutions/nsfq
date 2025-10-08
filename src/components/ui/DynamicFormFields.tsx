/** @format */

import { InputGroup } from "@/components/ui/InputGroup";
import { Label } from "@/components/ui/Label";
import { Select } from "@/components/ui/Select";
import { InputValidationMessage } from "@/components/ui/InputValidationMessage";
import { useMemo } from "react";
import { useTranslations } from "@/providers/TranslationProviders";

type FieldType = "text" | "number" | "textarea" | "image" | "file" | "select";

type InputProps = {
  name: string;
  label: string;
  value: string;
  type: FieldType;
  className?: string;
  options?: any;
  placeholder?: string;
  required?: boolean;
  validationError?: string;
  onChange: (value: string | File | null | undefined) => void;
};

export const DynamicFormFields: React.FC<InputProps> = ({
  name,
  label,
  value,
  options,
  type,
  placeholder,
  required,
  validationError,
  onChange,
}) => {
  const commonProps = {
    label,
    placeholder: placeholder || `Enter ${label}`,
    name,
    value,
    required,
    errors: validationError,
    onChange,
  };

  const { tran } = useTranslations();

  const validationErrorMessage = useMemo(() => {
    if (typeof validationError === "object") {
      return validationError?.[name];
    }

    if (typeof validationError === "string") {
      return validationError;
    }

    return "";
  }, [validationError, name]);

  const renderFileInput = (accept: string) => (
    <div className="flex w-full flex-col gap-2">
      <Label title={label} name={name} required={required} />
      <input
        type="file"
        accept={accept}
        onChange={(e) => onChange(e.target.files?.[0])}
        className="border-primary/20 w-full rounded-xl border bg-white px-5 py-2 text-sm outline-none sm:py-3"
      />
      <InputValidationMessage message={validationErrorMessage} />
    </div>
  );

  switch (type) {
    case "text":
    case "number":
    case "textarea":
      return <InputGroup type={type} {...commonProps} />;
    case "image":
      return renderFileInput("image/*");
    case "file":
      return renderFileInput(".pdf,.doc,.docx");
    case "select":
      return (
        <div className="flex w-full flex-col gap-2">
          <Label title={label} name={name} required={required} />
          <Select {...commonProps} options={options} />
          <InputValidationMessage message={validationErrorMessage} />
        </div>
      );
    default:
      return (
        <p>
          {tran("Unsupported field type:")} {type}
        </p>
      );
  }
};
