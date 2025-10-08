/** @format */

"use client";

import { Button } from "@/components/ui/Button";
import { useTranslations } from "@/providers/TranslationProviders";
import WithdrawForm from "./WithdrawForm";
import { ArrowLeftIcon } from "@phosphor-icons/react/dist/ssr";

export default function Withdraw() {
  const { tran } = useTranslations();
  return (
    <div className="bg-primary/5 rounded-xl p-3 sm:p-6">
      <div className="mb-6 flex flex-col items-start justify-between sm:flex-row sm:items-center">
        <h3 className="heading-3 !font-medium">{tran("Withdraw")}</h3>
        <Button
          href={"/dashboard/withdraw"}
          size="sm"
          variant="primary"
          className="items-center gap-2"
        >
          <ArrowLeftIcon /> {tran("Back to Wallet")}
        </Button>
      </div>
      <WithdrawForm />
    </div>
  );
}
