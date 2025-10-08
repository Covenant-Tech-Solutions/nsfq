/** @format */

import { useTranslations } from "@/providers/TranslationProviders";
import { AmazonPayParams } from "@/types/payment";
import React, { useEffect } from "react";

type AmazonProps = {
  config: AmazonPayParams | null;
};
const Amazon: React.FC<AmazonProps> = ({ config }) => {
  const { tran } = useTranslations();
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static-na.payments-amazon.com/checkout.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (!window.amazon || !window.amazon.Pay || !config) return;

    const amazonPayButton = window.amazon.Pay.renderButton("#AmazonPayButton", {
      merchantId: config.merchantId,
      publicKeyId: config.publicKey,
      ledgerCurrency: "USD",
      checkoutLanguage: "en_US",
      productType: "PayOnly",
      placement: "Other",
      buttonColor: "Gold",
    });

    amazonPayButton.onClick(() => {
      amazonPayButton.initCheckout({
        estimatedOrderAmount: {
          amount: config.amount,
          currencyCode: config.currency,
        },
        createCheckoutSessionConfig: {
          payloadJSON: config.payload,
          signature: config.signature,
          algorithm: "AMZN-PAY-RSASSA-PSS-V2",
          publicKeyId: config.publicKey,
        },
      });
    });
  }, [config]);

  return (
    <>
      <p className="mb-2 font-medium">{tran("Amazon Pay Button")}:</p>
      <div id="AmazonPayButton"></div>
    </>
  );
};

export default Amazon;
