import React from "react";

interface LabelProps {
  title: string;
  name: string;
  required?: boolean;
  className?: string;
}
export const Label: React.FC<LabelProps> = ({
  title,
  name,
  className,
  required,
}) => {
  return (
    <label htmlFor={name} className={`text-sm font-medium ${className}`}>
      {title} {required && <span className="text-red-500">*</span>}
    </label>
  );
};
