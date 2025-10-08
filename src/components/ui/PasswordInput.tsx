/** @format */

import React, { useMemo, useState } from "react";
import { InputValidationMessage } from "./InputValidationMessage";
import AnimateHeight from "react-animate-height";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { AppInfoType } from "@/types";
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react/dist/ssr";
import { useTranslations } from "@/providers/TranslationProviders";

interface PasswordInputProps {
  label: string;
  errors: any;
  name: string;
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  isInvalid?: boolean;
}

type Rule = {
  label: string;
  test: (value: string) => boolean;
};

const rules: Rule[] = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "One lowercase letter", test: (v) => /[a-z]/.test(v) },
  { label: "One uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "One number", test: (v) => /\d/.test(v) },
  {
    label: "One special character",
    test: (v) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(v),
  },
];
export const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  errors,
  name,
  form,
  setForm,
  isInvalid,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const { info }: { info: AppInfoType } = useAuthStore((state: any) => state);
  const { tran } = useTranslations();
  const results = useMemo(
    () => rules.map((r) => ({ ...r, passed: r.test(form?.[name]) })),
    [form, name],
  );

  const passedCount = results.filter((r) => r.passed).length;

  const getColor = (passedCount: number) => {
    let backgroundColor = "#10b981"; // green
    if (passedCount === 0) {
      backgroundColor = "#ef4444"; // red
    } else if (passedCount < rules.length) {
      backgroundColor = "#f59e0b"; // amber
    }
    return (
      <div
        className="h-1 rounded transition-all"
        style={{
          width: `${(passedCount / rules.length) * 100}%`,
          backgroundColor,
        }}
      />
    );
  };

  const error = useMemo(() => {
    if (errors && errors[name]) {
      return errors[name];
    }
    return null;
  }, [errors, name]);

  return (
    <div className="flex w-full flex-1 flex-col items-start justify-start gap-2">
      <label htmlFor={name} className="text-sm font-medium">
        {tran(label)}
      </label>
      <div className="w-full">
        <div
          className={`relative flex w-full items-center justify-between gap-2 rounded-xl border bg-white px-5 ${error ? "border-red-300" : "border-dark5"} ${isInvalid ? "border-red-500 focus:border-red-500" : ""}`}
        >
          <input
            type={showPassword ? "text" : "password"}
            id={name}
            value={form?.[name]}
            onChange={(e) => {
              setForm({ ...form, [name]: e.target.value });
              setShowRules(name === "password");
            }}
            className={`w-full bg-transparent py-2 text-sm outline-none sm:py-3 ${error ? "border-red-300" : "border-dark5"}`}
            placeholder="Password"
          />
          <span
            className="block cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeSlashIcon /> : <EyeIcon />}
          </span>
        </div>
        {info?.service_switch?.system_config?.force_secure_password && (
          <AnimateHeight
            height={showRules && passedCount ? "auto" : 0}
            className=""
          >
            <div className="mt-3 h-1 w-full rounded bg-gray-200">
              {getColor(passedCount)}
            </div>
            <ul className="flex flex-col gap-1 pt-3 text-sm">
              {results.map(({ label, passed }) => (
                <li
                  key={label}
                  className={`flex items-center gap-2 ${passed ? "text-green-600" : "text-gray-600"}`}
                >
                  <span>{passed ? "✅" : "❌"}</span>
                  {label}
                </li>
              ))}
            </ul>
          </AnimateHeight>
        )}
        <InputValidationMessage message={errors?.[name]} />
      </div>
    </div>
  );
};
