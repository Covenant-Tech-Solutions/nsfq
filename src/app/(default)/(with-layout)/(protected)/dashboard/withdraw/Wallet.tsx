/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";
import WalletSummary from "./WalletSummary";
import WalletTransactionHistory from "./WalletTransactionHistory";
import { CurrencyDollarIcon } from "@phosphor-icons/react/dist/ssr";

export default function Wallet() {
  const { tran } = useTranslations();
  const { user } = useAuthStore((state) => state);

  return (
    <div className="bg-primary/5 rounded-xl p-3 sm:p-6">
      <div className="flex items-center justify-between">
        <h3 className="heading-3 !font-medium">{tran("Withdraw")}</h3>{" "}
        <Button
          href="/dashboard/withdraw/withdraw"
          size="sm"
          variant="secondary"
          className="gap-1"
        >
          <CurrencyDollarIcon /> {tran("Withdraw")}
        </Button>
      </div>
      <div className="flex items-center justify-between pt-6">
        <div className="flex w-full flex-col rounded-lg bg-white p-3 sm:p-6">
          <WalletSummary coins={user?.coins} />
        </div>
      </div>
      <WalletTransactionHistory />
    </div>
  );
}
