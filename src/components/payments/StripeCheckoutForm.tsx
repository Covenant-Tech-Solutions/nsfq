/** @format */

"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { Button } from "../ui/Button";
import { useTranslations } from "@/providers/TranslationProviders";

const StripeCheckoutForm = ({ return_url }: { return_url: string }) => {
  const { tran } = useTranslations();
  const stripe = useStripe();
  const elements = useElements();

  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (elements == null || stripe == null) {
      return;
    }

    const { error: submitError } = await elements.submit();
    if (submitError?.message) {
      setErrorMessage(submitError.message);
      return;
    }
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      //`Elements` instance that was used to create the Payment Element
      elements,
      confirmParams: {
        return_url,
      },
    });

    if (error) {
      setErrorMessage(error.message ?? "");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col items-center overflow-y-auto">
      <form onSubmit={handleSubmit} className="w-full max-w-[450px]">
        <PaymentElement />

        <div className="w-full pt-6 text-center">
          <Button
            type="submit"
            loading={isLoading}
            className="btn-primary w-full"
          >
            {tran("Pay")}
          </Button>
        </div>
        {/* Show error message to your customers */}
        {errorMessage && <div>{errorMessage}</div>}
      </form>
    </div>
  );
};

export default StripeCheckoutForm;
