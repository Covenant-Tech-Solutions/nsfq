/** @format */

"use client";
import Breadcrumb from "@/components/partials/Breadcrumb";
import { useCurrency } from "@/hooks/useCurrency";
import { useTranslations } from "@/providers/TranslationProviders";
import {
  AmazonPayParams,
  BrainTreeConfigTypes,
  DepositFormType,
  StripeConfigTypes,
} from "@/types/payment";
import dynamic from "next/dynamic";
import { useMemo, useState } from "react";

const Stripe = dynamic(() => import("./Stripe"), {
  ssr: false,
});
const BrainTree = dynamic(() => import("./Braintree"), {
  ssr: false,
});
const Amazon = dynamic(() => import("./Amazon"), {
  ssr: false,
});
const PaymentForm = dynamic(() => import("./PaymentForm"), {
  ssr: false,
});

export default function PaymentPage() {
  const { tran } = useTranslations();
  const { convertAmount, getCurrency } = useCurrency();
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [depositForm, setDepositForm] = useState<DepositFormType | null>(null);

  const [paymentConfig, setPaymentConfig] = useState<{
    stripe: StripeConfigTypes | null;
    braintree: BrainTreeConfigTypes | null;
    amazon: AmazonPayParams | null;
  }>({
    stripe: null,
    braintree: null,
    amazon: null,
  });

  const paymentSection = useMemo(() => {
    if (
      (showCheckoutModal && paymentConfig.stripe) ||
      paymentConfig.braintree ||
      paymentConfig.amazon
    ) {
      const depositFormComponents = {
        stripe: <Stripe config={paymentConfig.stripe} />,
        braintree: <BrainTree config={paymentConfig.braintree} />,
        amazon: <Amazon config={paymentConfig.amazon} />,
      };
      return depositForm?.slug
        ? depositFormComponents[
            depositForm?.slug as keyof typeof depositFormComponents
          ]
        : null;
    }
  }, [depositForm?.slug, paymentConfig, showCheckoutModal]);

  const calculateCharge = useMemo(() => {
    if (
      depositForm?.amount &&
      depositForm?.fixed_charge &&
      depositForm?.percent_charge
    ) {
      const percentCharge =
        (depositForm?.amount * depositForm?.percent_charge) / 100;
      const totalCharge = depositForm?.fixed_charge + percentCharge;
      return totalCharge;
    }
    return 0;
  }, [depositForm]);

  return (
    <>
      <Breadcrumb title={tran("Add Coins")} />
      <div className="custom-container grid grid-cols-12 gap-6 pt-12">
        <div className="col-span-12 md:col-span-8">
          {showCheckoutModal ? (
            paymentSection
          ) : (
            <PaymentForm
              depositForm={depositForm}
              setDepositForm={setDepositForm}
              setPaymentConfig={setPaymentConfig}
              setShowCheckoutModal={setShowCheckoutModal}
            />
          )}
        </div>
        <div className="col-span-12 md:col-span-4">
          <div className="bg-primary/5 sticky top-0 col-span-2 flex flex-col gap-3 rounded-xl p-6">
            <label className="border-primary/20 border-b pb-3 text-xl font-semibold">
              {tran("Payment Details")}
            </label>
            <ul className="flex flex-col gap-2 text-sm text-black/90">
              <li className="flex items-center justify-between gap-2 font-medium">
                <span className="text-base font-medium">
                  {tran("Payment Amount:")}
                </span>
                <span>{convertAmount(depositForm?.amount || 0)}</span>
              </li>
              {depositForm?.name && (
                <li className="flex items-center justify-between gap-2 font-medium">
                  <span className="text-base font-medium">
                    {tran("Payment Method:")}
                  </span>
                  <span>{depositForm?.name}</span>
                </li>
              )}

              <li className="flex items-center justify-between gap-2 font-medium">
                <span className="text-base font-medium">
                  {tran("Gateway Charge:")}
                </span>
                <span>{convertAmount(calculateCharge)}</span>
              </li>
              {depositForm?.currency &&
                depositForm?.currency != getCurrency()?.code && (
                  <li className="flex items-center justify-between gap-2 font-medium">
                    <span className="text-base font-medium">
                      {tran("Conversion:")}
                    </span>
                    <span>
                      {convertAmount(
                        depositForm?.amount,
                        depositForm?.currency,
                      )}
                    </span>
                  </li>
                )}
              <li className="flex items-center justify-between gap-2 font-medium">
                <span className="text-base font-medium">
                  {tran("Total Amount:")}
                </span>
                <span>
                  {convertAmount(
                    Number(depositForm?.amount) + Number(calculateCharge) || 0,
                  )}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
