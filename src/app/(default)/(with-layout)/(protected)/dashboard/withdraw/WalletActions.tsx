import Link from "next/link";
import { useTranslations } from "@/providers/TranslationProviders";

export default function WalletActions() {
  const { tran } = useTranslations();

  return (
    <div className="mt-6 flex items-start justify-start gap-3 pt-6 max-[400px]:flex-col">
      <Link
        href="/payment"
        className="bg-primary w-full rounded-full py-3 text-center text-white"
      >
        {tran("Top Up")}
      </Link>
      <Link
        href="/dashboard/withdraw/withdraw"
        className="bg-secondary w-full rounded-full py-3 text-center text-white"
      >
        {tran("Withdraw")}
      </Link>
    </div>
  );
}
