/** @format */

"use client";

import { PayUPaymentData } from "@/types/payment";
import { useEffect } from "react";
import { useTranslations } from "@/providers/TranslationProviders";

type PayUFormProps = {
  paymentData: PayUPaymentData;
  requestUrl: string;
};

export default function PayUForm({ paymentData, requestUrl }: PayUFormProps) {
  const { tran } = useTranslations();
  useEffect(() => {
    const form = document.createElement("form");
    form.method = "POST";
    form.action = requestUrl;
    form.id = "payu-form";

    Object.entries(paymentData).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  }, [paymentData, requestUrl]);

  return (
    <div className="mx-auto max-w-2xl rounded-lg border p-6 text-center shadow-lg">
      <p className="text-lg font-semibold text-gray-700">
        {tran("Redirecting to PayU...")}
      </p>
    </div>
  );
}
