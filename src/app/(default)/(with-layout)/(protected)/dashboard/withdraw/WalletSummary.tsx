/** @format */

import addCoinIcon from "@/../public/add-coin-icon.svg";
import ImageLoader from "@/components/ui/ImageLoader";
import { useAuthStore } from "@/providers/AuthStoreProviders";
import { useTranslations } from "@/providers/TranslationProviders";

interface Props {
  coins?: number;
}

export default function WalletSummary({ coins = 0 }: Props) {
  const { tran } = useTranslations();
  const { appInfo, user } = useAuthStore((state) => state);

  // Memoize calculated values
  const coinRatio = appInfo?.application_info?.coins?.usd_ratio?.coin;
  const maxWithdrawUSD = Math.round((user?.coins || 0) / (coinRatio || 1));

  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {/* Total Coins Card */}

      <div className="bg-primary/10 flex w-full flex-col gap-2 rounded-lg p-5">
        <p className="text-danger heading-4">{tran("Total Coins")}:</p>
        <div className="flex items-center gap-2 text-2xl font-medium md:text-5xl">
          <ImageLoader
            src={addCoinIcon}
            alt="Total coins"
            width={40}
            height={40}
            className="size-10"
          />
          <span>{coins}</span>
        </div>
      </div>

      {/* Stats Card */}
      <div className="bg-primary/10 w-full min-w-[250px] shrink-0 space-y-2 rounded-lg p-5 md:w-auto">
        <StatItem label={tran("1 USD = ")} value={`${coinRatio} Coins`} />
        <StatItem label={tran("Your Total Coins = ")} value={user?.coins} />
        <StatItem
          label={tran("Maximum Withdraw = ")}
          value={`${maxWithdrawUSD} USD`}
        />
      </div>
    </div>
  );
}

// Helper component for consistent stat items
function StatItem({ label, value }: { label: string; value: string | number }) {
  return (
    <p className="text-base">
      {label}
      <span className="font-semibold text-indigo-600">{value}</span>
    </p>
  );
}
