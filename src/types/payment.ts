/** @format */

import { Stripe } from "@stripe/stripe-js";
export interface GatewayMeta {
  label: string;
  field_type: string;
  required: string;
  order: string;
}

// Interface for a single payment gateway
export interface PaymentMethodType {
  id: number;
  slug: string;
  name: string;
  image: string;
  meta: GatewayMeta[];
  type: "auto" | "manual";
  supported_currencies: string[];
  pay_instructions: string | null;
  fixed_charge: number;
  percent_charge: number;
  max: number;
  min: number;
}

export interface DepositFormType extends PaymentMethodType {
  amount: number;
  currency: string;
}

// Full API response for the list of payment gateways
export interface PaymentGatewayResponse {
  statusCode: number;
  data: PaymentMethodType[];
}

export type StripePromiseType = {
  stripe: Promise<Stripe | null> | null;
  options: {
    clientSecret: string | null;
    return_url?: string;
  };
};

export type StripeConfigTypes = {
  intent_id: string;
  client_secret: string;
  public_key: string;
  return_url?: string;
  gateway: string;
  pid: string;
};

export type BrainTreeConfigTypes = {
  gateway: string;
  pid: string;
  params: {
    publicKey: string;
    authorization: string;
    return_url: string;
  };
};

export interface PayUPaymentData {
  amount: string | null;
  productinfo: string | null;
  txnid: string | null;
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  currency: string | null;
  surl: string | null;
  furl: string | null;
  key: string | null;
  hash: string | null;
}

export interface AmazonPayPayload {
  webCheckoutDetails: {
    checkoutReviewReturnUrl: string;
    checkoutResultReturnUrl: string;
    checkoutCancelUrl: string;
  };
  paymentDetails: {
    paymentIntent: "AuthorizeWithCapture" | "Authorize";
    canHandlePendingAuthorization: boolean;
    softDescriptor: string;
    chargeAmount: {
      amount: string;
      currencyCode: string;
    };
  };
  merchantMetadata: {
    merchantReferenceId: string;
    merchantStoreName: string;
    noteToBuyer: string;
  };
  storeId: string;
}

export interface AmazonPayParams {
  payload: string;
  signature: string;
  amount: string;
  currency: string;
  publicKey: string;
  merchantId: string;
}

export interface AmazonPayData {
  params: AmazonPayParams;
  gateway: string;
  pid: string;
}

export interface AmazonPayApiResponse {
  statusCode: number;
  data: AmazonPayData;
}
