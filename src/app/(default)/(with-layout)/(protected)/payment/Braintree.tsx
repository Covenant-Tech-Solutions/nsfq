/** @format */
"use client";
import BraintreeForm from "@/components/payments/Braintreeform";
import { useTranslations } from "@/providers/TranslationProviders";
import { BrainTreeConfigTypes } from "@/types/payment";
import React from "react";
type BrainTreeProps = {
  config: BrainTreeConfigTypes | null;
};
const BrainTree: React.FC<BrainTreeProps> = ({ config }) => {
  const { tran } = useTranslations();
  if (!config) return null;

  return (
    config?.params?.authorization &&
    config.pid && (
      <div className="mx-auto w-full p-6">
        <h1 className="mb-4 text-xl font-semibold">
          {tran("Brain Tree Payment")}
        </h1>
        <BraintreeForm
          authorization={config?.params.authorization}
          return_url={config?.params?.return_url}
        />
      </div>
    )
  );
};

export default BrainTree;
