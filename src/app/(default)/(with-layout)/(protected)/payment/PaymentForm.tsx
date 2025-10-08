/** @format */

import { Button } from "@/components/ui/Button";
import useClickOutside from "@/hooks/useClickOutside";
import { useCurrency } from "@/hooks/useCurrency";
import { usePaymentHandler } from "@/hooks/usePaymentHandler";
import {
  AmazonPayParams,
  BrainTreeConfigTypes,
  DepositFormType,
  StripeConfigTypes,
} from "@/types/payment";
import { cn } from "@/utils/cn";
import { CaretDownIcon } from "@phosphor-icons/react";
import React, { useCallback, useMemo, useState } from "react";
import Methods from "./Methods";

type PaymentFormProps = {
  depositForm: DepositFormType | null;
  setDepositForm: React.Dispatch<React.SetStateAction<DepositFormType | null>>;
  setPaymentConfig: React.Dispatch<
    React.SetStateAction<{
      stripe: StripeConfigTypes | null;
      braintree: BrainTreeConfigTypes | null;
      amazon: AmazonPayParams | null;
    }>
  >;
  setShowCheckoutModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const PaymentForm: React.FC<PaymentFormProps> = ({
  depositForm,
  setDepositForm,
  setPaymentConfig,
  setShowCheckoutModal,
}) => {
  const [currencies, setCurrencies] = useState<string[] | null>(null);
  const [topUpError, setTopUpError] = useState({
    amountError: "",
    currencyError: "",
  });
  const { modal, setModal, modalRef } = useClickOutside();
  const { getCurrency } = useCurrency();

  const {
    paymentGateways,
    tran,
    handleSubmit,
    validationError,
    forms,
    isLoading,
    isDepositsLoading,
    setManualGatewayForm,
    coinConfig,
  } = usePaymentHandler({
    depositForm,
    setShowCheckoutModal,
    setPaymentConfig,
    setTopUpError,
  });
  const handleSelectDepositForm = (depositForm: DepositFormType) => {
    setCurrencies(depositForm?.supported_currencies);
    setDepositForm((prevData) => ({
      ...prevData,
      ...depositForm,
    }));
    // Set manual gateway dynamic fields as initial value
    if (depositForm?.type === "manual" && depositForm?.meta?.length) {
      const fields = depositForm?.meta?.map((field) => ({
        value: null,
        type: field?.field_type,
        label: field?.label,
      }));

      setManualGatewayForm((prev) => ({
        ...prev,
        fields,
      }));
    }
  };

  const handleSelectCurrency = useCallback(
    (item: string) => {
      setModal(false);
      setTopUpError((prev) => ({ ...prev, currencyError: "" }));
      setDepositForm((prevData) => ({
        ...(prevData as DepositFormType),
        currency: item,
      }));
    },
    [setModal, setDepositForm],
  );

  const inputPlaceholder = useMemo(() => {
    if (depositForm?.min && depositForm?.max) {
      return `Min ${getCurrency()?.symbol}${depositForm?.min} - Max ${getCurrency()?.symbol}${depositForm?.max}`;
    }
    return tran("Enter Amount");
  }, [depositForm, getCurrency, tran]);

  const inputNumberArray = useMemo(() => {
    if (depositForm?.min && depositForm?.max) {
      return Array.from({ length: 6 }, (_, i) =>
        Number((i + 1) * depositForm?.min),
      );
    }
    return ["5", "10", "15", "20", "50", "100"];
  }, [depositForm]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="heading-3">{tran("Add Coins")}</h3>
          <p className="text-light4 pt-1">
            {tran(
              "Additional fees and taxes may apply depending on your location",
            )}
          </p>
        </div>
      </div>
      <div className="pt-6">
        <Methods
          handleSelectDepositForm={handleSelectDepositForm}
          depositForm={depositForm}
          paymentGateways={paymentGateways || []}
          isLoading={isLoading}
        />
        {validationError?.gateway && (
          <p className="text-red-500">{validationError.gateway}</p>
        )}
        <div>
          <p className="pt-6 text-xl font-semibold">{tran("Enter Amount")}</p>
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
            <p className="text-light4">
              If you enter {getCurrency()?.symbol}
              {depositForm?.amount} you will get{" "}
              {coinConfig * (depositForm?.amount || 0)} coins
            </p>
            <div>
              <span>
                {tran("1 USD = ")}{" "}
                <span className="font-semibold text-indigo-600">
                  {coinConfig + " Coins"}
                </span>
              </span>
            </div>
          </div>
          <div className="border-primary/30 flex h-14 w-full items-center justify-start gap-2 rounded-xl border bg-transparent px-4 text-lg font-medium outline-none">
            <span>{getCurrency()?.symbol}</span>
            <input
              type="text"
              inputMode="numeric"
              value={depositForm?.amount || ""}
              onChange={(e) => {
                const value = e.target.value;
                // Allow only digits
                if (/^\d*$/.test(value)) {
                  setDepositForm({
                    ...(depositForm as DepositFormType),
                    amount: Number(value),
                  });
                }
              }}
              placeholder={inputPlaceholder}
              required
              className={cn(
                "w-full border-none bg-transparent outline-none",
                validationError?.amount && "border-red-500",
              )}
            />
          </div>
          <div className="flex items-center justify-start gap-2 pt-3 sm:gap-3">
            {inputNumberArray.map((item) => (
              <span
                key={item}
                onClick={() =>
                  setDepositForm({
                    ...(depositForm as DepositFormType),
                    amount: Number(item),
                  })
                }
                className="border-primary/20 flex size-10 cursor-pointer items-center justify-center rounded-xl border text-sm font-medium sm:size-14 sm:text-base"
              >
                {getCurrency()?.symbol}
                {item}
              </span>
            ))}
          </div>
          {validationError?.amount && (
            <p className="text-red-500">{validationError?.amount}</p>
          )}
        </div>
      </div>

      {depositForm?.slug && (
        <div
          ref={modalRef}
          className="relative col-span-2 flex w-full flex-1 flex-col items-start justify-start gap-2 pt-6"
        >
          <p title={""} className="mb-1 text-xl font-semibold">
            {tran("Select Currency")}
          </p>
          <p
            onClick={() => setModal((prev) => !prev)}
            className={`${topUpError.currencyError ? "border-red-500" : "border-primary/30"} border-primary/30 flex w-full items-center justify-between gap-2 rounded-xl border bg-transparent px-5 py-2 outline-none sm:py-5`}
          >
            <span>
              {depositForm?.currency
                ? depositForm?.currency
                : "Select Currency"}
            </span>{" "}
            <CaretDownIcon />
          </p>
          <div
            className={`absolute top-34 right-0 left-0 ${modal ? "visible translate-y-0 opacity-100" : "invisible translate-y-4 opacity-0"} z-20 duration-300`}
          >
            <ul className="flex max-h-[150px] flex-col gap-3 overflow-auto rounded-md bg-white px-6 py-4 font-medium shadow-lg">
              {currencies?.map((item, idx) => (
                <li
                  className="hover:text-primary cursor-pointer duration-300"
                  key={idx}
                  onClick={() => handleSelectCurrency(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {topUpError.currencyError && (
            <p className="pt-1 text-red-500">{topUpError.currencyError}</p>
          )}
          {validationError?.currency && (
            <p className="pt-1 text-red-500">{validationError.currency}</p>
          )}
        </div>
      )}
      {depositForm?.type === "manual" && (
        <div className="space-y-4 pt-6">
          {forms.map((form: any, index: number) => (
            <div key={form.label}>
              {form.field}
              {validationError?.[`fields.${index}.value`] && (
                <p className="pt-1 text-red-500">
                  {validationError?.[`fields.${index}.value`]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="col-span-2 flex items-end justify-end gap-3 pt-6 max-[400px]:flex-col max-[400px]:items-start sm:gap-6">
        <Button href="/dashboard/buy-coin" variant="danger-outline">
          {tran("Cancel")}
        </Button>
        <Button
          loading={isDepositsLoading}
          type="submit"
          className="max-[400px]:w-full"
        >
          {tran("Confirm & Add Coins")}
        </Button>
      </div>
    </form>
  );
};

export default PaymentForm;
