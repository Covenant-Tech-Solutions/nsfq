/** @format */

import React from "react";
import clsx from "clsx";

interface FileUploadProps {
  name: string;
  label?: string;
  value: File[] | null;
  onChange: (files: File[] | null) => void;
  accept?: string;
  className?: string;
  placeholder?: string;
  multiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  name,
  label,
  value,
  onChange,
  accept = "*",
  className,
  placeholder = "Choose File(s)",
  multiple = true,
}) => {
  return (
    <label htmlFor={name} className={clsx("cursor-pointer", className)}>
      <input
        type="file"
        id={name}
        name={name}
        accept={accept}
        multiple={multiple}
        onChange={(e) => {
          const files = e.target.files ? Array.from(e.target.files) : null;
          onChange(files);
        }}
        className="hidden"
      />

      <div className="border-primary/20 w-full rounded-md border bg-white p-2 text-sm">
        <p className="truncate">
          <span className="font-medium">{label || placeholder}</span>
          {value && value.length > 0 && (
            <span>: {value.map((f) => f.name).join(", ")}</span>
          )}
        </p>
      </div>
    </label>
  );
};
