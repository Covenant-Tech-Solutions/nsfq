/** @format */

import { DynamicFormFields } from "@/components/ui/DynamicFormFields";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import { AppInfoType } from "@/types";
import {
  AmazonPayParams,
  BrainTreeConfigTypes,
  DepositFormType,
  PaymentMethodType,
  StripeConfigTypes,
} from "@/types/payment";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useGetQuery } from "./mutate/useGetQuery";
import { useQueryMutation } from "./mutate/useQueryMutation";
import toast from "react-hot-toast";
import { getQueryClient } from "@/configs/query-client";
type PropsType = {
  depositForm: DepositFormType | null;
  setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean>>;
  setPaymentConfig: React.Dispatch<
    React.SetStateAction<{
      stripe: StripeConfigTypes | null;
      braintree: BrainTreeConfigTypes | null;
      amazon: AmazonPayParams | null;
    }>
  >;
  setTopUpError: React.Dispatch<React.SetStateAction<any>>;
};

export interface ManualGatewayFormTypes {
  fields: {
    value: string | number | boolean | null;
    type: string;
    label: string;
  }[];
}
export const usePaymentHandler = ({
  depositForm,
  setShowCheckoutModal,
  setPaymentConfig,
  setTopUpError,
}: PropsType) => {
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore((state) => state);
  const [manualGatewayForm, setManualGatewayForm] =
    useState<ManualGatewayFormTypes>({
      fields: [],
    });

  const { push } = useRouter();
  const { tran } = useTranslations();

  const [validationError, setValidationError] = useState<Record<
    string,
    string
  > | null>(null);

  const { data: paymentGateways, isLoading } = useGetQuery<PaymentMethodType[]>(
    {
      isPublic: false,
      url: `/payment-gateways`,
    },
  );

  const checkFrontendValidation = () => {
    if (!depositForm?.slug) {
      setValidationError((prev) => ({
        ...prev,
        gateway: tran("Payment method is required!"),
      }));
      return false;
    }

    if (!depositForm?.amount) {
      setValidationError((prev) => ({
        ...prev,
        amount: tran("Amount is required!"),
      }));
      return false;
    }

    if (!depositForm?.currency) {
      setValidationError((prev) => ({
        ...prev,
        currency: tran("Currency is required!"),
      }));
      return false;
    }

    if (depositForm?.type === "manual" && manualGatewayForm.fields.length) {
      let isAllFieldsFilled = true;
      manualGatewayForm.fields.forEach((field, index) => {
        if (!field.value) {
          setValidationError((prev) => ({
            ...prev,
            [`fields.${index}.value`]: tran("Field is required!"),
          }));
          isAllFieldsFilled = false;
        }
      });

      if (!isAllFieldsFilled) {
        return false;
      }
    }

    return true;
  };

  const {
    mutate: depositMutate,
    isLoading: isDepositsLoading,
    backendErrors,
  } = useQueryMutation({
    isPublic: false,
    url: `/profile/deposits`,
  });

  const handleSubmit = (
    e?: React.FormEvent<HTMLFormElement>,
    nonce?: string,
  ) => {
    if (e) {
      e.preventDefault();
    }
    setValidationError(null);
    if (!checkFrontendValidation()) {
      return;
    }

    depositMutate(
      {
        amount: depositForm?.amount,
        currency: depositForm?.currency,
        gateway: depositForm?.slug,
        payment_method_id: 2,
        ...(nonce && { nonce }),
        ...(depositForm?.type === "manual" && {
          fields: manualGatewayForm.fields,
        }),
      },
      {
        onSuccess: (response) => {
          const data = response?.data?.data;
          if (!data) {
            toast.error(tran("Something went wrong. Please try again."));
            return;
          }

          // Handle checkout modal for matching gateway
          if (depositForm?.slug === data.gateway) {
            window.scrollTo(0, 0);
            setShowCheckoutModal(true);
            setPaymentConfig((prev) => ({
              ...prev,
              [data.gateway]: data,
            }));
            return; // stop here to avoid triggering other redirects
          }

          // Redirect if payment URL exists
          if (data.payment_url) {
            push(data.payment_url);
            return;
          }

          // Handle manual payment type
          if (depositForm?.type === "manual") {
            toast.success(tran(data.message));
            getQueryClient().invalidateQueries({ queryKey: ["deposits"] });
            push("/dashboard/buy-coin");
          }
        },
        onError: (error: any) => {
          const message =
            tran(error?.response?.data?.message) ||
            tran("Something went wrong. Please try again.");
          setTopUpError((prev: any) => ({
            ...prev,
            amountError: message,
          }));
        },
      },
    );
  };

  const coinConfig = appInfo?.application_info?.coins.usd_ratio.coin;

  const onChangeHandle = (form: any, value: any) => {
    setManualGatewayForm((prev) => {
      const updatedFields = [...prev.fields];
      const existingIndex = updatedFields.findIndex(
        (field) => field.label === form.label,
      );

      const newField = {
        value,
        type: form.field_type,
        label: form.label,
      };

      if (existingIndex !== -1) {
        updatedFields[existingIndex] = newField;
      } else {
        updatedFields.push(newField);
      }

      return {
        ...prev,
        fields: updatedFields,
      };
    });
  };
  const forms = useMemo(() => {
    if (depositForm?.type !== "manual") {
      return [];
    }

    const metaData = depositForm?.meta?.sort(
      (a: any, b: any) => a?.order - b?.order,
    );

    return (
      metaData?.map((form: any) => {
        const fieldData = manualGatewayForm.fields.find(
          (f) => f.label === form.label,
        );

        return {
          ...form,
          field: (
            <DynamicFormFields
              key={form.id}
              type={form.field_type}
              required={form.required}
              value={fieldData?.value || ""}
              {...form}
              name={`fields.${form.id}`}
              validationError={validationError?.fields?.[form.id]}
              onChange={(value: any) => onChangeHandle(form, value)}
            />
          ),
        };
      }) || []
    );
  }, [
    manualGatewayForm,
    depositForm?.meta,
    depositForm?.type,
    validationError?.fields,
  ]);

  return {
    paymentGateways,
    tran,
    handleSubmit,
    setManualGatewayForm,
    validationError: validationError || backendErrors,
    forms,
    isLoading,
    isDepositsLoading,
    coinConfig,
  };
};
