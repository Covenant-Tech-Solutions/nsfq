/** @format */

"use client";
import { Button } from "@/components/ui/Button";
import { InputGroup } from "@/components/ui/InputGroup";
import { Select } from "@/components/ui/Select";
import { useGetQuery } from "@/hooks/mutate/useGetQuery";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import { UserType } from "@/types/user";
import { WithdrawMethodTypes } from "@/types/withdraw";
import { useQueryClient } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import React, { useCallback, useMemo, useState } from "react";
import toast from "react-hot-toast";

const Loader = dynamic(() => import("@/components/ui/Loader"), {
  ssr: false,
});

type formTypes = {
  withdraw_method_id: number;
  coins: string;
  fields: {
    label: string;
    value: string;
  }[];
};

const WithdrawForm = () => {
  const { appInfo, user }: { appInfo: AppInfoType; user: UserType } =
    useAuthStore((state) => state);
  const { data: methods, isLoading } = useGetQuery({
    url: "/profile/withdraw-methods",
  });

  const { tran } = useTranslations();
  const [selectedMethod, setSelectedMethod] =
    useState<WithdrawMethodTypes | null>(null);
  const [form, setForm] = useState<formTypes>({
    withdraw_method_id: 0,
    coins: "",
    fields: [],
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const convertedCoins = useMemo(() => {
    if (!appInfo || !form.coins) return "";
    const coinConfig = appInfo?.application_info?.coins;
    if (coinConfig && form.coins) {
      return Math.round(coinConfig.usd_ratio?.coin * parseFloat(form.coins));
    }
  }, [appInfo, form.coins]);

  const {
    mutate,
    isLoading: isSubmitting,
    backendErrors: errors,
  } = useQueryMutation({
    url: "/profile/withdraws",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedMethod) {
      toast.error(tran("Please select a withdrawal method"));
      return;
    }

    if (!form.coins || parseFloat(form.coins) <= 0) {
      toast.error(tran("Please enter a valid amount to withdraw"));
      return;
    }

    if (Number(convertedCoins) > user?.coins) {
      toast.error(tran("You don't have enough coins to withdraw"));
      return;
    }

    mutate(
      {
        ...form,
        coins: convertedCoins,
      },
      {
        onSuccess: () => {
          toast.success(tran("Withdrawal request submitted successfully"));
          setSelectedMethod(null);
          queryClient.invalidateQueries({ queryKey: ["withdraws"] });
          router.push("/dashboard/withdraw");
        },
      },
    );
  };

  const setFieldValue = useCallback(
    (index: number) => {
      const field = form.fields[index];
      return field ? field.value : "";
    },
    [form],
  );

  const showCalculatedCoins = () => {
    if (!convertedCoins) return null;
    if (convertedCoins > user?.coins) {
      return (
        <div>
          <p className="mt-2 text-sm text-red-500">
            {tran("You don't have enough coins to withdraw this amount")}
          </p>
        </div>
      );
    }
    return (
      <div>
        <p className="mt-2 text-sm text-gray-500">
          {tran("You are withdrawing")}{" "}
          <span className="font-semibold text-indigo-600">
            {convertedCoins}
          </span>
          {tran(" Coins equivalent and your coin left")}{" "}
          <span className="font-semibold text-indigo-600">
            {Math.round(user?.coins - (convertedCoins || 0))}
          </span>
          {tran(" Coins")}
        </p>
      </div>
    );
  };

  if (isLoading) return <Loader />;

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4">
        <label className="text-sm font-medium">
          {tran("Select Withdraw Method")}
        </label>

        <Select
          name="withdraw_method_id"
          options={
            methods?.map((method: any) => ({
              label: method.name,
              value: method.id,
            })) as any
          }
          onChange={(value) => {
            setForm((prev) => ({
              ...prev,
              withdraw_method_id: parseInt(value),
              fields: methods
                ?.find((method: any) => method.id === parseInt(value))
                ?.fields?.map((field: any) => ({
                  label: field.label,
                  value: "",
                })),
            }));

            setSelectedMethod(
              methods?.find((method: any) => method.id === parseInt(value)),
            );
          }}
          value={
            methods?.find(
              (method: any) => method.id === form.withdraw_method_id,
            )?.name
          }
        />
      </div>

      {selectedMethod && (
        <div className="mt-6 space-y-4 rounded-xl border border-gray-100 bg-white p-6 shadow-lg">
          <div className="mb-4 flex items-center justify-between">
            <div className="mb-6 flex items-center">
              <div className="mr-3 rounded-full bg-indigo-100 p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-indigo-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-gray-800">
                {tran("Withdrawal Details")}
              </h2>
            </div>
          </div>

          <div>
            <InputGroup
              type="number"
              name="coins"
              value={form.coins}
              placeholder={tran("Enter amount to withdraw")}
              required
              label={tran("Enter Amount to Withdraw")}
              errors={errors}
              onChange={(value) => {
                setForm((prev) => ({ ...prev, coins: value }));
              }}
            />
            {showCalculatedCoins()}
          </div>

          {selectedMethod?.fields.map((field, index) => (
            <InputGroup
              key={index}
              type={field.field_type}
              name={field.label}
              required={field.required}
              value={setFieldValue(index)}
              label={field.label}
              errors={errors}
              onChange={(value) => {
                setForm((prev) => {
                  const updatedFields = [...prev.fields];
                  updatedFields[index] = { ...updatedFields[index], value };
                  return { ...prev, fields: updatedFields };
                });
              }}
            />
          ))}

          <div className="mt-8">
            <Button
              type="submit"
              loading={isSubmitting}
              disabled={isSubmitting}
              className="w-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-2 h-5 w-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
              {tran("Submit Withdrawal Request")}
            </Button>
          </div>
        </div>
      )}
    </form>
  );
};

export default WithdrawForm;
