/** @format */

"use client";
import { useEffect, useState } from "react";
import { useQueryMutation } from "@/hooks/mutate/useQueryMutation";
import { AmazonPayParams } from "@/types/payment";
import { useTranslations } from "@/providers/TranslationProviders";
declare global {
  interface Window {
    amazon: any;
  }
}

export default function AmazonPay() {
  const { tran } = useTranslations();
  const [amazonPayDetails, setAmazonPayDetails] =
    useState<AmazonPayParams | null>(null);
  const [amazonScriptLoaded, setAmazonScriptLoaded] = useState(false);

  const { mutate, isLoading } = useQueryMutation({
    isPublic: false,
    url: "/profile/deposits",
  });

  // 1. Load Amazon Pay script once
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://static-na.payments-amazon.com/checkout.js";
    script.async = true;
    script.onload = () => setAmazonScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  // 2. When both script and data are ready, render the button
  useEffect(() => {
    if (!amazonPayDetails || !amazonScriptLoaded) return;
    if (!window.amazon || !window.amazon.Pay) return;

    const amazonPayButton = window.amazon.Pay.renderButton("#AmazonPayButton", {
      merchantId: amazonPayDetails.merchantId,
      publicKeyId: amazonPayDetails.publicKey,
      ledgerCurrency: "USD",
      checkoutLanguage: "en_US",
      productType: "PayOnly",
      placement: "Other",
      buttonColor: "Gold",
    });

    amazonPayButton.onClick(() => {
      amazonPayButton.initCheckout({
        estimatedOrderAmount: {
          amount: amazonPayDetails.amount,
          currencyCode: amazonPayDetails.currency,
        },
        createCheckoutSessionConfig: {
          payloadJSON: amazonPayDetails.payload,
          signature: amazonPayDetails.signature,
          algorithm: "AMZN-PAY-RSASSA-PSS-V2",
          publicKeyId: amazonPayDetails.publicKey,
        },
      });
    });
  }, [amazonPayDetails, amazonScriptLoaded]);

  return (
    <div className="p-4">
      <button
        className="rounded bg-yellow-400 px-4 py-2 font-semibold text-black"
        disabled={isLoading}
        onClick={() =>
          mutate(
            {
              gateway: "amazon",
              amount: "100",
              currency: "USD",
            },
            {
              onSuccess: (response) => {
                const data = response.data.data.params;
                setAmazonPayDetails(data);
              },
            },
          )
        }
      >
        {tran(isLoading ? "Loading..." : "Start Amazon Pay Checkout")}
      </button>

      <div className="mt-6">
        {amazonPayDetails && (
          <>
            <p className="mb-2 font-medium">{tran("Amazon Pay Button")}:</p>
            <div id="AmazonPayButton" className="hidden"></div>
          </>
        )}
      </div>
    </div>
  );
}
