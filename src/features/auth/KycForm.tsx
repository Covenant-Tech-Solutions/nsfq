/** @format */

"use client";
import { Button } from "@/components/ui/Button";
import { DynamicFormFields } from "@/components/ui/DynamicFormFields";
import Loader from "@/components/ui/Loader";
import { ONBOARDING_POSITION, ONBOARDING_STEPS } from "@/configs";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthHandler } from "@/hooks/useAuthHandler";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { UserType } from "@/types/user";
import { getToken } from "@/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const KycForm = () => {
  const { data, isLoading: isKycFormLoading } = useGetQuery({
    url: "/auth/kyc-forms",
  });

  const router = useRouter();
  const { tran } = useTranslations();
  const {
    user,
    getUser,
  }: {
    user: UserType | undefined;
    getUser: () => Promise<UserType | undefined>;
  } = useAuthStore((state) => state);
  const { setKycWaitingStep, redirect } = useAuthHandler();
  const [kycForm, setKycForm] = useState<{
    country: string;
    city: string;
    state: string;
    zip_code: string;
    address: string;
    fields: Record<string, any>;
  }>({
    country: "Bangladesh",
    city: "Dhaka",
    state: "Dhaka",
    zip_code: "1324",
    address: "Hello",
    fields: {},
  });
  const token = getToken();
  useEffect(() => {
    if (
      token &&
      ONBOARDING_STEPS.waiting.value ===
        localStorage.getItem(ONBOARDING_POSITION) &&
      user?.kyc?.status === "pending"
    ) {
      router.push(redirect(user));
    }
  }, [user, token, router, redirect]);

  const {
    mutate,
    isLoading,
    backendErrors: errors,
  } = useQueryMutation({
    url: "auth/kyc-forms",
  });

  const onChangeHandle = (form: any, value: any) => {
    setKycForm((prev) => ({
      ...prev,
      fields: {
        ...prev.fields,
        [form.id]: value,
      },
    }));
  };

  const forms = useMemo(() => {
    const formData = data || [];

    return formData
      .sort((a: any, b: any) => a.position - b.position)
      .map((form: any) => ({
        ...form,
        field: (
          <DynamicFormFields
            key={form.id}
            type={form.field_type}
            required={form.required}
            {...form}
            name={`fields.${form.id}`}
            validationError={errors?.fields?.[form.id]}
            onChange={(value: any) => onChangeHandle(form, value)}
          />
        ),
      }));
  }, [data, errors]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(kycForm, {
      onSuccess: async (response: any) => {
        toast.success(response?.data?.message);
        const updatedUser = await getUser();
        if (updatedUser) {
          setKycWaitingStep();
          router.push(redirect(updatedUser));
        } else {
          toast.error(tran("Failed to update user data"));
        }
      },
    });
  };

  if (isKycFormLoading) {
    return <Loader />;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {forms.map((form: any) => (
        <div key={form.id}>{form.field}</div>
      ))}
      <Button loading={isLoading} type="submit" className="w-full">
        {tran("Submit")}
      </Button>
    </form>
  );
};

export default KycForm;
