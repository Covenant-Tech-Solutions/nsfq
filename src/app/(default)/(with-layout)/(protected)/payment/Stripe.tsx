/** @format */

import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { StripeConfigTypes, StripePromiseType } from "@/types/payment";
import { loadStripe } from "@stripe/stripe-js";
import dynamic from "next/dynamic";

const StripeCheckoutForm = dynamic(
  () => import("@/components/payments/StripeCheckoutForm"),
  {
    ssr: false,
  },
);

type StripeProps = {
  config: StripeConfigTypes | null;
};
const Stripe: React.FC<StripeProps> = ({ config }) => {
  const stripePromise = React.useMemo<StripePromiseType>(() => {
    if (!config || !config.public_key || !config.client_secret) {
      return { stripe: null, options: { clientSecret: null } };
    }
    return {
      stripe: loadStripe(config.public_key),
      options: {
        clientSecret: config.client_secret,
        return_url: config.return_url,
      },
    };
  }, [config]);

  return (
    stripePromise.stripe &&
    stripePromise.options.clientSecret && (
      <Elements
        stripe={stripePromise.stripe}
        options={{ clientSecret: stripePromise.options.clientSecret }}
      >
        <StripeCheckoutForm
          return_url={stripePromise.options?.return_url || ""}
        />
      </Elements>
    )
  );
};

export default Stripe;
