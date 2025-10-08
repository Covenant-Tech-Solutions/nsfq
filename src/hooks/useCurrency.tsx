/** @format */
"use client";

import { useCallback } from "react";
import { useGetQuery } from "./mutate/useGetQuery";
import { AppInfoType, CurrencyType } from "@/types";
import { useAuthStore } from "@/providers/AuthStoreProviders";

export const useCurrency = () => {
  const { data } = useGetQuery<CurrencyType[]>({
    isPublic: true,
    url: "/currencies",
  });
  const { appInfo }: { appInfo: AppInfoType } = useAuthStore(
    (state: any) => state,
  );

  const default_currency = appInfo?.application_info?.defaultCurrency;

  const getCurrency = useCallback(
    (code?: string | null) => {
      if (!code) {
        return default_currency;
      }
      return data?.find((currency) => currency.code == code);
    },
    [data, default_currency],
  );

  const convertAmount = (amount: number, code?: string | null) => {
    const currency = getCurrency(code);
    if (currency) {
      amount = parseFloat(
        (
          (amount * Number(currency?.rate)) /
          Number(default_currency?.rate)
        ).toFixed(2),
      );
    }
    switch (currency?.symbol_position) {
      case "left":
        return `${currency?.symbol}${amount}`;
      case "right":
        return `${amount}${currency?.symbol}`;
      case "left_space":
        return `${currency?.symbol} ${amount}`;
      case "right_space":
        return `${amount} ${currency?.symbol}`;
      default:
        return amount;
    }
  };

  return {
    getCurrency,
    convertAmount,
    default_currency,
  };
};
