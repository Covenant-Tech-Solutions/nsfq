// hooks/useForm.ts
import { useState } from "react";

type ValidatorFn = (value: string) => string | null;

type ValidationRules<T> = {
  [K in keyof T]?: ValidatorFn[];
};

export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validationRules: ValidationRules<T> = {},
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });

    if (validationRules[name as keyof T]) {
      const rules = validationRules[name as keyof T] || [];
      for (const rule of rules) {
        const errorMsg = rule(value);
        if (errorMsg) {
          setErrors((prev) => ({ ...prev, [name]: errorMsg }));
          return;
        }
      }

      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof T];
        return newErrors;
      });
    }
  };

  const validateAll = () => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const key in validationRules) {
      const rules = validationRules[key] || [];
      for (const rule of rules) {
        const errorMsg = rule(values[key]);
        if (errorMsg) {
          newErrors[key] = errorMsg;
          break;
        }
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit =
    (callback: (values: T) => void) =>
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (validateAll()) {
        callback(values);
      }
    };

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
  };
}
