/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useTranslations } from "@/providers/TranslationProviders";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function ForgotPasswordForm() {
  const { tran } = useTranslations();
  const router = useRouter();

  const [formData, setFormData] = useState({
    type: "",
    value: "",
  });

  const [formattedData, setFormattedData] = useState({});

  const isValidEmail = (value: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const isValidPhone = (value: string) => {
    return /^\+?\d{7,15}$/.test(value);
  };

  useEffect(() => {
    if (isValidEmail(formData.value)) {
      setFormData((prev) => ({ ...prev, type: "email" }));
      setFormattedData({ type: "email", email: formData.value });
    } else if (isValidPhone(formData.value)) {
      setFormData((prev) => ({ ...prev, type: "phone" }));
      setFormattedData({ type: "phone", phone: formData.value });
    }
  }, [formData.value]);

  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    isPublic: true,
    url: "auth/send-otp",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.type === "") {
      toast.error(tran("Please enter email or phone"));
      return;
    }

    mutate(formattedData, {
      onSuccess: (response) => {
        if (response.data.statusCode == 200) {
          router.push(`/change-pass-otp?${formData.type}=${formData.value}`);
        }
      },
    });
  };
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 pt-6">
      <InputGroup
        label={tran("Email or Phone")}
        name={formData.type}
        value={formData.value}
        onChange={(e) =>
          setFormData((prev) => ({
            ...prev,
            value: e,
          }))
        }
        errors={errors}
        placeholder={tran("Enter Your Email or Phone")}
      />

      <div className="pt-6">
        <Button type="submit" className="w-full" loading={isLoading}>
          {" "}
          {tran("Send OTP")}
        </Button>
      </div>
    </form>
  );
}
